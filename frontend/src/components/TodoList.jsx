import { useState } from "react";
import { FileQuestion, ClipboardList, Check } from "lucide-react";

const typeConfig = {
  quiz: { icon: FileQuestion, label: "امتحان" },
  assignment: { icon: ClipboardList, label: "واجب" },
};

export default function TodoList({ items: initialItems }) {
  const [items, setItems] = useState(initialItems);

  const toggle = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
    // TODO: ابعت التحديث للـ API هنا لما نوصله
  };

  const pendingCount = items.filter((i) => !i.done).length;

  if (items.length === 0) return null;

  return (
    <div className="bg-cream-card border border-border rounded-card p-4 mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-ink">مهامي القادمة</h2>
        {pendingCount > 0 && (
          <span className="text-xs font-bold bg-gold/15 text-gold-dark px-2.5 py-1 rounded-full">
            {pendingCount} متبقي
          </span>
        )}
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const { icon: Icon, label } = typeConfig[item.type];
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-navy/5 transition-colors"
            >
              <button
                onClick={() => toggle(item.id)}
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                  item.done
                    ? "bg-navy border-navy text-cream"
                    : "border-border text-transparent"
                }`}
                aria-label="تم الإنجاز"
              >
                <Check size={14} strokeWidth={3} />
              </button>

              <Icon size={16} className="text-ink-muted shrink-0" />

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold truncate ${
                    item.done ? "text-ink-muted line-through" : "text-ink"
                  }`}
                >
                  {item.title}
                </p>
                <p className="text-xs text-ink-muted">
                  {label} · {item.courseName}
                </p>
              </div>

              {!item.done && item.dueLabel && (
                <span className="text-xs font-semibold text-gold-dark shrink-0">
                  {item.dueLabel}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
