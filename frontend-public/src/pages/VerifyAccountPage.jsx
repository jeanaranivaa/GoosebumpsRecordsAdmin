import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

export default function VerifyAccountPage() {
    const [code, setCode] = useState(["", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const inputs = useRef([]);
    const navigate = useNavigate();
    const { verifyAccount, resendVerification } = useAuth();

    const email = localStorage.getItem("pendingVerificationEmail");

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return; // solo números
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        // avanza al siguiente input automáticamente
        if (value && index < 3) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading || code.some((d) => d === "")) return;

        try {
            setError("");
            setLoading(true);

            await verifyAccount(email, code.join(""));
            localStorage.removeItem("pendingVerificationEmail");

            await Swal.fire({
                icon: "success",
                title: "¡Cuenta confirmada!",
                text: "Ya puedes comprar en Goosebumps Records.",
                background: "#14162a",
                color: "#ffffff",
                confirmButtonColor: "#ec4899",
            });

            navigate("/home");
        } catch (error) {
            setError(
                error.response?.data?.message || "Código incorrecto"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setError("");
            await resendVerification(email);

            Swal.fire({
                icon: "success",
                title: "Código reenviado",
                text: "Revisa tu correo.",
                background: "#14162a",
                color: "#ffffff",
                confirmButtonColor: "#ec4899",
            });
        } catch (error) {
            setError(
                error.response?.data?.message || "No se pudo reenviar el código"
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
                    boxShadow: "0 0 30px rgba(80, 80, 255, 0.15), 0 0 60px rgba(80, 80, 255, 0.08), inset 0 0 30px rgba(80, 80, 255, 0.05)",
                }}
            >
                <h1 className="text-white text-3xl font-extrabold mb-2 tracking-tight">
                    Confirma tu cuenta
                </h1>
                <p className="text-zinc-400 text-sm mb-8">
                    Te enviamos un código de 4 dígitos a{" "}
                    <span className="text-white">{email || "tu correo"}</span>.
                </p>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <div className="text-center">
                        <label className="block text-white text-sm font-semibold mb-3">
                            Código de Confirmación
                        </label>
                        <div className="flex gap-3 justify-center">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-14 h-14 text-center text-white text-xl font-bold bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                                />
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-xs">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-zinc-600 hover:bg-zinc-500 disabled:opacity-50 active:scale-[0.98] text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-2"
                    >
                        {loading ? "Confirmando..." : "Confirmar Cuenta"}
                    </button>

                    <button
                        type="button"
                        onClick={handleResend}
                        className="text-blue-400 hover:text-blue-300 text-xs transition-colors"
                    >
                        Reenviar código
                    </button>
                </form>
            </div>
        </div>
    );
}
