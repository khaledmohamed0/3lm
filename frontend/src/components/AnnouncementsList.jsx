import { Megaphone } from "lucide-react";

export default function AnnouncementsList({ announcements = [] }) {
  if (announcements.length === 0) return null;

  return (
    <div className="bg-cream-card border border-border rounded-card p-4 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Megaphone size={18} className="text-navy" />
        <h2 className="text-base font-bold text-ink">إعلانات المدرسين</h2>
      </div>

      <div className="space-y-3">
        {announcements.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-navy/10 text-navy flex items-center justify-center text-sm font-bold shrink-0">
              {item.teacherName[0]}
            </div>
            <div className="flex-1 min-w-0 pb-3 border-b border-border last:border-0 last:pb-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-sm font-semibold text-ink truncate">{item.teacherName}</p>
                <span className="text-[11px] text-ink-muted shrink-0">{item.timeAgo}</span>
              </div>
              <p className="text-xs text-gold-dark font-semibold mb-1">{item.courseName}</p>
              <p className="text-sm text-ink-muted leading-relaxed">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
