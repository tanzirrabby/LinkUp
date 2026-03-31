type Post = {
  id: string;
  contentText: string;
  createdAt: string;
  authorId: string;
};

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-xl bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">Author: {post.authorId}</p>
      <p className="mt-2 text-slate-900">{post.contentText}</p>
      <p className="mt-2 text-xs text-slate-400">{new Date(post.createdAt).toLocaleString()}</p>
      <div className="mt-3 flex gap-4 text-sm text-slate-600">
        <button>Like</button>
        <button>Comment</button>
        <button>Share</button>
      </div>
    </article>
  );
}
