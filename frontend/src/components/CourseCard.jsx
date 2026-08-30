import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CourseCard({ subject, title, teacher, lessonsDone, lessonsTotal, progress, completed }) {
  return (
    <div className="relative bg-cream-card border border-border rounded-card overflow-hidden">
      {/* الشريط الذهبي العلوي — توقيع "علّم" البصري */}
      <div className="h-1 bg-gold" />

      <div className="p-4">
        <p className="text-xs font-bold text-gold-dark mb-1">{subject}</p>
        <h3 className="text-base font-bold text-ink mb-1">{title}</h3>
        {teacher && <p className="text-xs text-ink-muted mb-3">{teacher}</p>}

        <div className="flex items-center justify-between text-xs text-ink-muted mb-2">
          <span>{lessonsDone} من {lessonsTotal} محاضرات مكتملة</span>
          <span className="font-bold text-navy">{progress}%</span>
        </div>

        <div className="h-1.5 bg-navy/10 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-navy rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {completed ? (
          <div className="flex items-center gap-1.5 text-sm font-semibold text-navy bg-navy/5 rounded-lg py-2 justify-center">
            <CheckCircle2 size={16} />
            <span>الكورس مكتمل</span>
          </div>
        ) : (
          <button className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-cream bg-navy hover:bg-navy-dark rounded-lg py-2 transition-colors">
            <span>استكمال</span>
            <ArrowLeft size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
