# 🍷 Sommelier de Amazon (AI + Selenium)

Una aplicación Full-Stack que analiza reseñas reales de productos de Amazon utilizando **Selenium** para el scraping y **Llama 3 (vía Groq)** para generar un informe experto estructurado.

## 🌟 Características
- **Extracción Real:** Usa Selenium para obtener opiniones directamente de Amazon.
- **Análisis con IA:** Procesa las reseñas con Llama-3-70b para extraer pros, contras y veredicto.
- **Formato JSON:** Respuestas estructuradas para una integración frontend robusta.
- **Privacidad:** Se ejecuta localmente. Tú controlas tus datos y tu clave de API.

## 🛠️ Tecnologías
- **Backend:** C# / .NET 8, Selenium WebDriver, HttpClient.
- **Frontend:** React, Vite, Framer Motion, Lucide Icons.
- **IA:** Groq API (Llama 3).

## 🚀 Cómo ejecutarlo localmente

### Requisitos previos
- [.NET SDK 8.0](https://dotnet.microsoft.com/download) instalado.
- [Node.js](https://nodejs.org/) instalado.
- Una clave API gratuita de [Groq](https://console.groq.com/).

### Paso 1: Clonar el repositorio
Abre tu terminal y ejecuta:

```
git clone https://github.com/albergrs90/sommelier-amazon-ai.git
cd sommelier-amazon-ai
```
## Paso 2: Estructura del proyecto
- El repositorio contiene dos partes independientes que debes ejecutar por separado:
/sommelier-web → Frontend en React.
- Archivos raíz (Program.cs, Controllers/, etc.) → Backend en .NET.
- Nota: Necesitarás abrir dos terminales diferentes para ejecutar cada parte.
## Paso 3: Configurar y ejecutar el Backend
- Abre la primera terminal en la carpeta raíz del proyecto.
- Crea un archivo llamado .env en esa misma carpeta (junto a Program.cs).
- Añade tu clave de Groq dentro del archivo:

- (Puedes usar el archivo .env.example como referencia).
Ejecuta el backend:
```
dotnet run
```
- La API estará disponible normalmente en https://localhost:7075 (revisa la consola para confirmar el puerto exacto).
## Paso 4: Configurar y ejecutar el Frontend
- Abre la segunda terminal.
- Navega a la carpeta del frontend:
```
cd sommelier-web
```
- Instala las dependencias (solo la primera vez):
bash
1
Ejecuta el frontend:
```
npm run dev
```
- Abre el enlace que te muestra la consola (usualmente http://localhost:5173).
## Paso 5: ¡A probar!
- Pega la URL de cualquier producto de Amazon en la aplicación y obtén tu análisis generado por IA en segundos.
## ⚠️ Consideraciones Legales y de Uso
- Esta herramienta es un proyecto educativo/demostrativo. El scraping de Amazon puede violar sus Términos de Servicio. Úsalo bajo tu propia responsabilidad y con moderación. Necesitas tu propia clave de API de Groq (gratuita con límites generosos) para que funcione.
## 📄 Licencia
Este proyecto es de código abierto y está disponible para fines educativos.
