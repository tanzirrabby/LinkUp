'use client';

import { FormEvent, useState } from 'react';
import { api } from '../../../lib/apiClient';

export default function SignupPage() {
  const [form, setForm] = useState({ email: '', username: '', password: '', displayName: '' });
  const [status, setStatus] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await api('/auth/signup', { method: 'POST', body: JSON.stringify(form) });
    setStatus('Account created. You can now login.');
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-3 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Create account</h2>
      <input className="w-full rounded border p-2" placeholder="Display name" onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
      <input className="w-full rounded border p-2" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input className="w-full rounded border p-2" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="w-full rounded border p-2" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="rounded bg-brand px-4 py-2 text-white" type="submit">Sign up</button>
      {status && <p className="text-sm text-green-600">{status}</p>}
    </form>
  );
}
