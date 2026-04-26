# 🍷 Sommelier de Amazon (AI + Selenium)

Una aplicación Full-Stack que analiza reseñas reales de productos de Amazon utilizando **Selenium** para el scraping y **Llama 3 (vía Groq)** para generar un informe experto estructurado.

## 🌟 Características
- **Extracción Real:** Usa Selenium para obtener reseñas directamente de Amazon.
- **Análisis con IA:** Procesa las opiniones con Llama-3-70b para extraer pros, contras y veredicto.
- **Formato JSON:** Respuestas estructuradas para una integración frontend robusta.
- **Privacidad:** Se ejecuta localmente. Tú controlas tus datos y tu clave de API.

## 🛠️ Tecnologías
- **Backend:** C# / .NET 8, Selenium WebDriver, HttpClient.
- **Frontend:** React, Vite, Framer Motion, Tailwind/CSS.
- **IA:** Groq API (Llama 3).

## 🚀 Cómo ejecutarlo localmente

### Requisitos previos
- [.NET SDK 8.0](https://dotnet.microsoft.com/download) instalado.
- [Node.js](https://nodejs.org/) instalado.
- Una clave API gratuita de [Groq](https://console.groq.com/).

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/sommelier-amazon.git
cd sommelier-amazon