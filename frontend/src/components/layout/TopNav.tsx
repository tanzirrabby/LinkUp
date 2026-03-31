export function TopNav() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-brand">LinkUp</h1>
        <nav className="text-sm text-slate-600">Home · Friends · Notifications</nav>
      </div>
    </header>
  );
}
