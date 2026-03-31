'use client';

import { FormEvent, useState } from 'react';
import { api } from '../../../lib/apiClient';
import { authStore } from '../../../stores/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await api<{ accessToken: string; user: { id: string; username: string; displayName: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    authStore.setToken(result.accessToken);
    authStore.setUser(result.user);
    setStatus('Logged in successfully');
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-3 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Login</h2>
      <input className="w-full rounded border p-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="w-full rounded border p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button className="rounded bg-brand px-4 py-2 text-white" type="submit">Sign in</button>
      {status && <p className="text-sm text-green-600">{status}</p>}
    </form>
  );
}
