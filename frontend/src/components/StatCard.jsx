export default function StatCard({ icon: Icon, label, value, tone = "light", className = "" }) {
  const isDark = tone === "dark";

  return (
    <div
      className={`rounded-card p-4 flex items-center gap-3 border ${
        isDark
          ? "bg-navy border-navy text-cream"
          : "bg-cream-card border-border text-ink"
      } ${className}`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          isDark ? "bg-white/10 text-gold-light" : "bg-navy/5 text-navy"
        }`}
      >
        <Icon size={20} strokeWidth={2} />
      </div>
      <div>
        <p className={`text-xs mb-0.5 ${isDark ? "text-cream/70" : "text-ink-muted"}`}>
          {label}
        </p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
