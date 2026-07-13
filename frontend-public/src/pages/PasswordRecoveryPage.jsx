import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { useRecovery } from "../hooks/useRecovery";

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { sendCode, loading } = useRecovery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!email.trim()) {
      setError("Por favor ingresa tu correo.");
      return;
    }

    try {
      setError("");
      await sendCode(email);
      localStorage.setItem("recoveryEmail", email);
      navigate("/verify");
    } catch (error) {
      setError(
        error.response?.data?.message || "Error al enviar el código"
      );
    }
  };

  return (
    <div className="h-screen bg-[#111111] flex items-center justify-center">
      <div
        className="w-full max-w-md mx-4 rounded-2xl p-10 flex flex-col items-center text-center"
        style={{
          background: "#1a1a2e",
          border: "1px solid rgba(100, 100, 255, 0.3)",
          boxShadow:
            "0 0 30px rgba(80, 80, 255, 0.15), 0 0 60px rgba(80, 80, 255, 0.08), inset 0 0 30px rgba(80, 80, 255, 0.05)",
        }}
      >
        <h1 className="text-white text-3xl font-extrabold mb-2 tracking-tight">
          Recuperar Contraseña
        </h1>

        <p className="text-zinc-400 text-sm mb-8">
          Ingresa tu correo para enviar el código de verificación.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="text-left">
            <label className="block text-white text-sm font-semibold mb-2">
              Correo Electrónico
            </label>

            <InputField
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && (
              <p className="text-red-400 text-xs mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-600 hover:bg-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-1"
          >
            {loading ? "Enviando código..." : "Enviar Código"}
          </button>
        </form>

        <p className="text-zinc-500 text-xs mt-6">
          ¿Recordaste tu contraseña?{" "}
          <a
            href="/login"
            className="text-purple-400 hover:text-red-300 transition-colors"
          >
            Volver al Login
          </a>
        </p>
      </div>
    </div>
  );
}
