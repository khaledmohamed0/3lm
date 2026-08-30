export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors";

  const variants = {
    primary: "bg-navy text-cream hover:bg-navy-dark",
    gold: "bg-gold text-white hover:bg-gold-dark",
    outline: "border border-navy text-navy hover:bg-navy hover:text-cream",
    ghost: "text-navy hover:bg-navy/5",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
