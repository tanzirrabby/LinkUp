export function ProfileHeader({ name, bio }: { name: string; bio?: string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">{name}</h2>
      <p className="mt-2 text-slate-600">{bio ?? 'No bio yet.'}</p>
    </div>
  );
}
