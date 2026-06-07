import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";



export default function VerifyCodePage() {
    const [code, setCode] = useState(["", "", "", ""]);
    const inputs = useRef([]);
    const navigate = useNavigate();

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

    const handleSubmit = (e) => {
    e.preventDefault();
    if (code.some((d) => d === "")) return;
    navigate("/newPassword");
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
                    Ingresa el código
                </h1>
                <p className="text-zinc-400 text-sm mb-8">
                    Te enviamos un código de 4 dígitos a tu email.
                </p>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <div className="text-center">
                        <label className="block text-white text-sm font-semibold mb-3">
                            Código de Verificación
                        </label>
                        {/* 4 inputs */}
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
                                    className="
                    w-14 h-14 text-center text-white text-2xl font-bold
    bg-[#1a1a2e] border border-zinc-600
    rounded-lg
    focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400
    transition-all duration-200
                  "
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-zinc-600 hover:bg-zinc-500 active:scale-[0.98] text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-1"
                    >
                        Verificar
                    </button>
                </form>

                <p className="text-zinc-500 text-xs mt-6">
                    ¿No recibiste el código?{" "}
                    <a href="/recovery" className="text-red-400 hover:text-red-300 transition-colors">
                        Reenviar
                    </a>
                </p>
            </div>
        </div>
    );
}