'use client';

export default function PrivacySettingsPage() {
  return (
    <section className="max-w-xl rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Privacy Settings</h2>
      <div className="mt-4 space-y-2 text-sm">
        <label className="flex items-center gap-2"><input type="radio" name="visibility" defaultChecked /> Public</label>
        <label className="flex items-center gap-2"><input type="radio" name="visibility" /> Friends</label>
        <label className="flex items-center gap-2"><input type="radio" name="visibility" /> Private</label>
      </div>
    </section>
  );
}
