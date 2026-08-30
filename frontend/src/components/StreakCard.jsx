import { Flame } from "lucide-react";

const dayLabels = ["س", "ح", "ن", "ث", "ر", "خ", "ج"];

export default function StreakCard({ streakCount = 0, activeDays = [] }) {
  // activeDays: array of 7 booleans تمثل آخر 7 أيام (من الأقدم للأحدث)

  return (
    <div className="bg-cream-card border border-border rounded-card p-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
            <Flame size={20} className="text-gold-dark" fill="currentColor" fillOpacity={0.2} />
          </div>
          <div>
            <p className="text-lg font-bold text-ink leading-tight">{streakCount} أيام متتالية</p>
            <p className="text-xs text-ink-muted">استمر عشان محرقّش تتابعك</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        {dayLabels.map((label, i) => {
          const active = activeDays[i];
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  active ? "bg-gold text-navy-dark" : "bg-ink/5 text-ink-muted"
                }`}
              >
                {active ? <Flame size={14} /> : label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
