using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using System.Text;
using System.Text.Json;
using System.Linq;
using System.Net.Http.Headers;

namespace SommelierApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalisisController : ControllerBase
    {
        private readonly string _groqApiKey;
        private readonly IHttpClientFactory _httpClientFactory;

        public AnalisisController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            _groqApiKey = Environment.GetEnvironmentVariable("GROQ_API_KEY")
                ?? throw new InvalidOperationException("GROQ_API_KEY no configurada.");
        }

        [HttpPost("extraer")]
        public async Task<IActionResult> Extraer([FromBody] PeticionUrl peticion)
        {
            if (string.IsNullOrEmpty(peticion.Url))
                return BadRequest(new { error = "La URL es obligatoria." });

            if (!Uri.TryCreate(peticion.Url, UriKind.Absolute, out var uriResult) ||
                !(uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps))
                return BadRequest(new { error = "URL inválida." });

            if (!uriResult.Host.Contains("amazon.", StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { error = "Solo se permiten URLs de Amazon." });

            ChromeOptions options = new ChromeOptions();
            options.AddArgument("--headless=new");
            options.AddArgument("--disable-gpu");
            options.AddArgument("--no-sandbox");
            options.AddArgument("--disable-dev-shm-usage");
            options.AddArgument("--window-size=1920,1080");
            options.AddArgument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");

            using (IWebDriver driver = new ChromeDriver(options))
            {
                try
                {
                    driver.Navigate().GoToUrl(peticion.Url);

                    WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
                    try { wait.Until(d => d.FindElements(By.CssSelector("[data-hook='review-body']")).Count > 0); }
                    catch (WebDriverTimeoutException) { }

                    string notaAmazonOficial = "N/A";
                    try
                    {
                        var elementoNota = driver.FindElement(By.CssSelector("[data-hook='average-star-rating']"));
                        notaAmazonOficial = elementoNota.GetAttribute("textContent").Trim();
                    }
                    catch
                    {
                        try { notaAmazonOficial = driver.FindElement(By.Id("acrCustomerReviewText")).Text; } catch { }
                    }

                    var reseñasElementos = driver.FindElements(By.CssSelector("[data-hook='review-body']"));
                    var listaReseñas = reseñasElementos
                        .Select(e => e.Text.Trim())
                        .Where(t => !string.IsNullOrEmpty(t))
                        .Take(15)
                        .ToList();

                    if (!listaReseñas.Any())
                        return NotFound(new { error = "No se encontraron reseñas públicas." });

                    string todasLasReseñas = string.Join("\n", listaReseñas);

                    string instruccionesSystem = "Eres un analista de datos experto. Tu única salida debe ser un objeto JSON válido. No incluyas texto markdown ni explicaciones.";

                    string promptUsuario = $@"
Analiza estas reseñas de Amazon. Calificación Oficial: {notaAmazonOficial}.

Devuelve EXACTAMENTE este formato JSON:
{{
  ""puntuacion"": ""4.5"",
  ""mejor"": [""Punto fuerte 1"", ""Punto fuerte 2""],
  ""peor"": [""Debilidad 1"", ""Debilidad 2""],
  ""conclusion"": ""Veredicto final en un párrafo.""
}}

RESEÑAS:
{todasLasReseñas}";

                    var cliente = _httpClientFactory.CreateClient("GroqClient");
                    cliente.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _groqApiKey);

                    var cuerpoPeticion = new
                    {
                        model = "llama-3.3-70b-versatile",
                        messages = new[] {
                            new { role = "system", content = instruccionesSystem },
                            new { role = "user", content = promptUsuario }
                        },
                        temperature = 0.1,
                        response_format = new { type = "json_object" }
                    };

                    string jsonCuerpo = JsonSerializer.Serialize(cuerpoPeticion);
                    var contenidoHttp = new StringContent(jsonCuerpo, Encoding.UTF8, "application/json");

                    var respuestaHttp = await cliente.PostAsync("https://api.groq.com/openai/v1/chat/completions", contenidoHttp);

                    if (!respuestaHttp.IsSuccessStatusCode)
                        return StatusCode((int)respuestaHttp.StatusCode, new { error = "Error en servicio de IA." });

                    string resultadoJson = await respuestaHttp.Content.ReadAsStringAsync();

                    using JsonDocument doc = JsonDocument.Parse(resultadoJson);
                    string contenidoIA = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();

                    if (string.IsNullOrEmpty(contenidoIA))
                        return StatusCode(500, new { error = "La IA no devolvió contenido." });

                    try
                    {
                        var analisisResult = JsonSerializer.Deserialize<AnalisisResultado>(contenidoIA);
                        if (analisisResult == null) throw new Exception("Deserialización nula");
                        return Ok(analisisResult);
                    }
                    catch
                    {
                        return StatusCode(500, new { error = "Error procesando la respuesta de la IA." });
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { error = $"Error interno: {ex.Message}" });
                }
            }
        }
    }

    public class PeticionUrl
    {
        public string Url { get; set; } = string.Empty;
    }

    public class AnalisisResultado
    {
        public string puntuacion { get; set; } = "";
        public List<string> mejor { get; set; } = new();
        public List<string> peor { get; set; } = new();
        public string conclusion { get; set; } = "";
    }
}