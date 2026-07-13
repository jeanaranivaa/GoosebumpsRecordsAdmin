export default function InputField({
    type = "text",
    placeholder,
    value,
    onChange,
    className = "",
}) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`
        w-full bg-[#1a1a1a] border border-zinc-700 text-white text-sm
        placeholder:text-zinc-600 rounded-lg px-4 py-3
        focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400
        transition-all duration-200
        ${className}
      `}
        />
    );
}
