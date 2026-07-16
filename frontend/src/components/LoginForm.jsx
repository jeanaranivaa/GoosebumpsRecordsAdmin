import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "./InputField";
import GoogleButton from "./GoogleButton";
import { useAdmin } from "../hooks/useAdmin";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login } = useAdmin();

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        try {
            const data = await login(email, password);

            localStorage.setItem("token", data.token);
            localStorage.setItem("admin", JSON.stringify(data.admin));

            console.log("Login exitoso:", data);

            navigate("/dashboard");
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Error al iniciar sesión"
            );
        }
    }, [email, password, login, navigate]);

    const togglePassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <div>
                <label className="block text-white text-sm font-semibold mb-2">
                    Email
                </label>

                <InputField
                    type="email"
                    placeholder="Ingresa tu email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />
            </div>

            <div>
                <label className="block text-white text-sm font-semibold mb-2">
                    Contraseña
                </label>

                <div className="relative">
                    <InputField
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className="pr-10"
                    />

                    <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                        aria-label={
                            showPassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                        }
                    >
                        {showPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.163-3.592"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.228 6.228A9.96 9.96 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.966 9.966 0 01-4.293 5.411"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 3l18 18"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                <div className="text-right mt-2">
                    <Link
                        to="/recovery"
                        className="text-zinc-400 text-xs hover:text-white transition-colors"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-zinc-600 hover:bg-zinc-500 active:scale-[0.98] text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-1"
            >
                Iniciar Sesión
            </button>

            <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-zinc-700" />
                <span className="text-zinc-500 text-xs">
                    O
                </span>
                <div className="flex-1 h-px bg-zinc-700" />
            </div>

            <GoogleButton />

        </form>
    );
}