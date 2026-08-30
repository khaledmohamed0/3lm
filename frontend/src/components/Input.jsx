export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className={`text-right ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-ink mb-1.5">{label}</label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-xl bg-cream-card border text-sm text-ink placeholder:text-ink-muted/60
          focus:outline-none focus:ring-2 focus:ring-navy/30 transition-shadow
          ${error ? "border-red-400" : "border-border"}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
