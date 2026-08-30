import { Radio, Calendar } from "lucide-react";
import Button from "./Button";

export default function LiveSessions({ sessions = [] }) {
  if (sessions.length === 0) return null;

  return (
    <div className="bg-cream-card border border-border rounded-card p-4 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={18} className="text-navy" />
        <h2 className="text-base font-bold text-ink">الحصص اللايف القادمة</h2>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-cream border border-border"
          >
            <div className="w-12 shrink-0 text-center">
              <p className="text-[11px] text-ink-muted">{session.dayLabel}</p>
              <p className="text-sm font-bold text-navy">{session.time}</p>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{session.title}</p>
              <p className="text-xs text-ink-muted truncate">{session.teacher}</p>
            </div>

            {session.isLive ? (
              <Button variant="gold" className="shrink-0 px-3 py-1.5 text-xs gap-1.5">
                <Radio size={13} />
                <span>انضم الآن</span>
              </Button>
            ) : (
              <Button variant="outline" className="shrink-0 px-3 py-1.5 text-xs">
                تذكير
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
