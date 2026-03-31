'use client';

import { useState } from 'react';
import { api } from '../../lib/apiClient';

export function PostComposer() {
  const [contentText, setContentText] = useState('');

  const submit = async () => {
    if (!contentText.trim()) return;
    await api('/posts', {
      method: 'POST',
      body: JSON.stringify({ contentText, visibility: 'public' })
    });
    setContentText('');
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <textarea
        value={contentText}
        onChange={(e) => setContentText(e.target.value)}
        className="h-24 w-full rounded-lg border border-slate-200 p-3"
        placeholder="What's on your mind?"
      />
      <button onClick={submit} className="mt-3 rounded-lg bg-brand px-4 py-2 text-white">
        Post
      </button>
    </div>
  );
}
