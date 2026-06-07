import LoginForm from "../components/LoginForm.jsx";
import vinilo from "../assets/vinyl1.png";

export default function LoginPage() {
  return (
    <div className="h-screen bg-black flex overflow-hidden">
      {/* Left panel - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-16 py-12 bg-[#111111] relative z-10 rounded-r-3xl">
        <div className="max-w-sm w-full mx-auto">
          <h1 className="text-white text-4xl font-extrabold mb-2 tracking-tight">
            ¡Bienvenido!
          </h1>
          <p className="text-zinc-400 text-sm mb-10">
            Listo para el primer track del día.
          </p>
          <LoginForm />
        </div>
      </div>

      {/* Right panel - Vinyl imagen real */}
      <div className="hidden md:flex w-1/2 items-center justify-start bg-white relative overflow-hidden">
        <img
          src={vinilo}
          alt="vinilo"
          className="h-full w-auto object-cover"
          style={{ marginLeft: "-80px" }}
        />
      </div>
    </div>
  );
}