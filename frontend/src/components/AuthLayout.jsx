export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col" dir="rtl">
      {/* أعلى الصفحة بشكل مقوّس مستوحى من اللوجو */}
      <div className="bg-navy-dark rounded-b-[40px] px-6 pt-10 pb-14 text-center relative overflow-hidden">
        <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-gold/10" />
        <div className="absolute -bottom-8 -right-4 w-20 h-20 rounded-full bg-gold/10" />

        <p className="font-heading text-4xl text-cream mb-2 relative">علّم</p>
        <div className="w-10 h-0.5 bg-gold mx-auto mb-3 relative" />
        <p className="text-cream/70 text-sm relative">كُن مَن يُعَلِّم ويُتَعَلِّم</p>
      </div>

      {/* الكارت العائم فوق المنحنى */}
      <div className="flex-1 px-5 -mt-8 relative">
        <div className="bg-cream-card rounded-card border border-border p-6 max-w-md mx-auto shadow-sm">
          {eyebrow && (
            <p className="text-xs font-bold text-gold-dark tracking-wide mb-1">{eyebrow}</p>
          )}
          <h1 className="text-xl font-bold text-ink mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-ink-muted mb-6">{subtitle}</p>}

          {children}
        </div>
      </div>
    </div>
  );
}
