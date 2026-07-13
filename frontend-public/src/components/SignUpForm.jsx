import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "./InputField";
import GoogleButton from "./GoogleButton";
import { useAuth } from "../context/AuthContext";

export default function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (fullName.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      await register({ fullName, email, password });
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al crear la cuenta"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Nombre */}
      <div>
        <label className="block text-white text-sm font-semibold mb-2">
          Nombre
        </label>
        <InputField
          type="text"
          placeholder="Ingresa tu nombre"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      {/* Correo */}
      <div>
        <label className="block text-white text-sm font-semibold mb-2">
          Correo
        </label>
        <InputField
          type="email"
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Contraseña */}
      <div>
        <label className="block text-white text-sm font-semibold mb-2">
          Contraseña
        </label>
        <div className="relative">
          <InputField
            type={showPassword ? "text" : "password"}
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.163-3.592M6.228 6.228A9.96 9.96 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.966 9.966 0 01-4.293 5.411M3 3l18 18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-zinc-600 hover:bg-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-1"
      >
        {loading ? "Creando cuenta..." : "Crear Cuenta"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-zinc-700" />
        <span className="text-zinc-500 text-xs">O</span>
        <div className="flex-1 h-px bg-zinc-700" />
      </div>

      {/* Google */}
      <GoogleButton />

      {/* Link a Iniciar sesión */}
      <p className="text-center text-zinc-500 text-xs mt-1">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
