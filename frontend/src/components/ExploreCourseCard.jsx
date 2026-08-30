import { BookOpen } from "lucide-react";

export default function ExploreCourseCard({ subject, title, teacher, price, className = "" }) {
  return (
    <div className={`shrink-0 w-40 bg-cream-card border border-border rounded-card overflow-hidden ${className}`}>
      {/* غلاف بديل لحد ما يبقى عندنا صور حقيقية للكورسات */}
      <div className="h-20 bg-navy/5 flex items-center justify-center">
        <BookOpen size={24} className="text-navy/40" />
      </div>
      <div className="p-3">
        <p className="text-[11px] font-bold text-gold-dark mb-0.5">{subject}</p>
        <p className="text-sm font-bold text-ink leading-snug mb-1 line-clamp-2">{title}</p>
        <p className="text-[11px] text-ink-muted mb-2">{teacher}</p>
        <p className="text-sm font-bold text-navy">{price}</p>
      </div>
    </div>
  );
}
