interface Props {
  params: { username: string };
}

export default function ProfilePage({ params }: Props) {
  return (
    <section className="space-y-4">
      <div className="h-48 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500" />
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">@{params.username}</h2>
        <p className="mt-2 text-slate-600">Bio and posts will render here.</p>
      </div>
    </section>
  );
}
