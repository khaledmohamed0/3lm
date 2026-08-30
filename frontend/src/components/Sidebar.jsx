import { Home, BookOpen, CheckSquare, Wallet } from "lucide-react";
import NotificationBell from "./NotificationBell";

const items = [
  { id: "home", label: "الرئيسية", icon: Home },
  { id: "courses", label: "كورساتي", icon: BookOpen },
  { id: "grades", label: "درجاتي", icon: CheckSquare },
  { id: "wallet", label: "المحفظة", icon: Wallet },
];

export default function Sidebar({ active = "home", onChange, studentName, notifications = [] }) {
  return (
    <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 bg-navy-dark min-h-screen px-4 py-6 sticky top-0">
      <div className="flex items-center justify-between mb-8 px-2">
        <span className="font-heading text-3xl text-cream">علّم</span>
        <NotificationBell notifications={notifications} dark />
      </div>

      <div className="flex items-center gap-2.5 mb-8 px-2">
        <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-navy-dark font-bold text-sm shrink-0">
          {studentName?.[0]}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-cream truncate">{studentName}</p>
          <p className="text-xs text-cream/60">طالب</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange?.(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive ? "bg-gold text-navy-dark" : "text-cream/70 hover:bg-white/5"
              }`}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
