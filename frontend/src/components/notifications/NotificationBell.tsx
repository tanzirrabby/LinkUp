export function NotificationBell({ unreadCount }: { unreadCount: number }) {
  return <div className="rounded-full bg-slate-800 px-3 py-1 text-xs text-white">🔔 {unreadCount}</div>;
}
