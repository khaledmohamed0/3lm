import { useState, useRef, useEffect } from "react";
import { Bell, FileQuestion, Megaphone, Radio, Check } from "lucide-react";

const typeIcon = {
  quiz: FileQuestion,
  announcement: Megaphone,
  live: Radio,
};

export default function NotificationBell({ notifications: initial = [], dark = false }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initial);
  const ref = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    // TODO: ابعت التحديث للـ API هنا لما نوصله
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // TODO: ابعت التحديث للـ API هنا لما نوصله
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
          dark ? "text-cream/80 hover:bg-white/10" : "text-ink-muted hover:bg-ink/5"
        }`}
        aria-label="الإشعارات"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 left-1.5 w-2 h-2 rounded-full bg-gold" />
        )}
      </button>

      {open && (
        <div className="fixed top-[72px] inset-x-4 md:absolute md:inset-x-auto md:top-auto md:right-0 md:mt-2 md:w-80 max-w-full md:max-w-[calc(100vw-2rem)] bg-cream-card border border-border rounded-card shadow-lg z-50 overflow-hidden"  dir="rtl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-bold text-ink">الإشعارات</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-navy hover:underline"
              >
                تعليم الكل كمقروء
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-ink-muted text-center py-8">مفيش إشعارات جديدة</p>
            ) : (
              notifications.map((n) => {
                const Icon = typeIcon[n.type] || Bell;
                return (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`w-full flex gap-3 px-4 py-3 text-right border-b border-border last:border-0 transition-colors ${
                      n.read ? "bg-transparent" : "bg-navy/5"
                    } hover:bg-navy/5`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        n.read ? "bg-ink/5 text-ink-muted" : "bg-gold/15 text-gold-dark"
                      }`}
                    >
                      <Icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${n.read ? "text-ink-muted" : "text-ink font-semibold"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-ink-muted mt-0.5">{n.timeAgo}</p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
