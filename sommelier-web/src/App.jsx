import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Wine,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  Star,
  ExternalLink,
  Info,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [analisis, setAnalisis] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [paso, setPaso] = useState(0);

  const analizarProducto = async () => {
    if (!url) return;
    setCargando(true);
    setAnalisis(null);
    setError("");
    setPaso(1);

    try {
      setTimeout(() => setPaso(2), 1500);

      const respuesta = await fetch(
        "https://localhost:7075/api/Analisis/extraer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        },
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {
        if (respuesta.status === 429)
          throw new Error("Demasiadas peticiones. Espera un minuto.");
        if (respuesta.status === 404)
          throw new Error("No se encontraron reseñas.");
        throw new Error(data.error || "Error del servidor.");
      }

      setAnalisis(data);
      setPaso(3);
    } catch (err) {
      setError(err.message);
      setPaso(0);
    } finally {
      setCargando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && url && !cargando) analizarProducto();
  };

  return (
    <div className="container">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Sommelier de Amazon</h1>
        <p className="subtitle">Análisis experto mediante IA y Selenium</p>
      </motion.header>

      <motion.div
        className="card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="input-group">
          <input
            type="text"
            placeholder="Pega la URL del producto de Amazon..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input-url"
            aria-label="URL del producto"
          />
          <button
            onClick={analizarProducto}
            disabled={cargando || !url}
            aria-label="Analizar producto"
          >
            {cargando ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Search size={20} />
            )}
            {cargando ? "Analizando..." : "Analizar Ahora"}
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="legal-disclaimer"
      >
        <ShieldAlert size={14} />
        <span>
          <strong>Aviso:</strong> Proyecto educativo. El scraping puede violar
          ToS de Amazon. Los análisis son generados por IA y no garantizan
          precisión absoluta.
        </span>
      </motion.div>

      <AnimatePresence mode="wait">
        {!cargando && !analisis && !error && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="welcome-box"
          >
            <div className="welcome-content">
              <Info size={24} className="welcome-icon" />
              <div>
                <h3>¿Cómo funciona?</h3>
                <p>
                  Pega un enlace de Amazon. <strong>Selenium</strong> extrae
                  opiniones reales y <strong>Llama 3</strong> genera un
                  veredicto estructurado.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {cargando && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="resultado"
            aria-live="polite"
          >
            <div className="shimmer skeleton-title"></div>
            <div className="shimmer skeleton-text"></div>
            <div className="shimmer skeleton-text"></div>
            <p className="subtitle-loading">
              {paso === 1 && "🌐 Conectando con Amazon..."}
              {paso === 2 && "🤖 Procesando con IA..."}
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="resultado error-result"
            aria-live="assertive"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "var(--error)",
              }}
            >
              <AlertTriangle size={24} />
              <h3>Error</h3>
            </div>
            <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
              {error}
            </p>
            <button
              onClick={() => setError("")}
              style={{
                marginTop: "1rem",
                background: "transparent",
                border: "1px solid var(--card-border)",
                width: "auto",
                color: "var(--text-primary)",
              }}
            >
              Intentar de nuevo
            </button>
          </motion.div>
        )}

        {analisis && !cargando && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="resultado"
            aria-live="polite"
          >
            <h2>
              <Wine size={24} /> Informe del Sommelier
            </h2>

            <div
              className="normal-block"
              style={{ marginBottom: "2rem", alignItems: "center" }}
            >
              <Star
                size={32}
                className="icon-margin icon-accent"
                style={{ marginTop: 0 }}
              />
              <div>
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    display: "block",
                  }}
                >
                  PUNTUACIÓN GENERAL
                </span>
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "var(--accent-color)",
                  }}
                >
                  {analisis.puntuacion}{" "}
                  <span style={{ fontSize: "1rem" }}>⭐</span>
                </span>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
              }}
            >
              <div>
                <h3
                  style={{
                    color: "var(--success)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <CheckCircle2 size={20} /> Lo Mejor
                </h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {analisis.mejor.map((item, idx) => (
                    <li
                      key={idx}
                      className="badge badge-success"
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        borderRadius: "8px",
                        textAlign: "left",
                        padding: "0.5rem 0.75rem",
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3
                  style={{
                    color: "var(--error)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <XCircle size={20} /> A Mejorar
                </h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {analisis.peor.map((item, idx) => (
                    <li
                      key={idx}
                      className="badge badge-error"
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        borderRadius: "8px",
                        textAlign: "left",
                        padding: "0.5rem 0.75rem",
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="conclusion-section">
              <div className="conclusion-header">
                <Sparkles size={18} />
                <span>VEREDICTO FINAL</span>
              </div>
              <p className="conclusion-text">{analisis.conclusion}</p>
            </div>

            <div className="result-footer">
              <button
                className="btn-ver-producto"
                onClick={() => window.open(url, "_blank")}
              >
                Ver producto original <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="footer-tag" animate={{ opacity: 0.5 }}>
        <Sparkles size={14} /> Powered by AI Sommelier Engine
      </motion.div>
    </div>
  );
}

export default App;
