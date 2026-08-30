import { Home, BookOpen, CheckSquare, Wallet } from "lucide-react";

const items = [
  { id: "home", label: "الرئيسية", icon: Home },
  { id: "courses", label: "كورساتي", icon: BookOpen },
  { id: "grades", label: "درجاتي", icon: CheckSquare },
  { id: "wallet", label: "المحفظة", icon: Wallet },
];

export default function BottomNav({ active = "home", onChange }) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-cream-card border-t border-border px-2 py-2 flex items-center justify-around max-w-md mx-auto">
      {items.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange?.(id)}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 2}
              className={isActive ? "text-navy" : "text-ink-muted"}
            />
            <span
              className={`text-[11px] font-semibold ${
                isActive ? "text-navy" : "text-ink-muted"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
