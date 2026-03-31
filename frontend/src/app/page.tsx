import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">Welcome to LinkUp</h2>
      <p className="text-slate-600">A modern social platform starter.</p>
      <div className="flex gap-3">
        <Link className="rounded bg-brand px-4 py-2 text-white" href="/feed">Go to Feed</Link>
        <Link className="rounded border px-4 py-2" href="/login">Login</Link>
      </div>
    </div>
  );
}
