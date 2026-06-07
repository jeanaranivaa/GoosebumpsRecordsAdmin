import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";

export default function NewPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!password.trim() || !confirm.trim()) {
            setError("Por favor completa ambos campos.");
            return;
        }
        if (password !== confirm) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        setError("");
        navigate("/login");
    };

    return (
        <div className="h-screen bg-[#111111] flex items-center justify-center">
            <div
                className="w-full max-w-md mx-4 rounded-2xl p-10 flex flex-col items-center text-center"
                style={{
                    background: "#1a1a2e",
                    border: "1px solid rgba(100, 100, 255, 0.3)",
                    boxShadow: "0 0 30px rgba(80, 80, 255, 0.15), 0 0 60px rgba(80, 80, 255, 0.08), inset 0 0 30px rgba(80, 80, 255, 0.05)",
                }}
            >
                <h1 className="text-white text-3xl font-extrabold mb-2 tracking-tight">
                    Ingresa una contraseña nueva
                </h1>
                <p className="text-zinc-400 text-sm mb-8">
                    Crea una nueva contraseña para tu cuenta.
                </p>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <div className="text-left">
                        <label className="block text-white text-sm font-semibold mb-2">
                            Nueva Contraseña
                        </label>
                        <InputField
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="text-left">
                        <label className="block text-white text-sm font-semibold mb-2">
                            Confirmar Contraseña
                        </label>
                        <InputField
                            type="password"
                            placeholder="••••••••"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs text-left">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-zinc-600 hover:bg-zinc-500 active:scale-[0.98] text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-1"
                    >
                        Actualizar Contraseña
                    </button>
                </form>
            </div>
        </div>
    );
}