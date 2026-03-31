import { api } from '../../lib/apiClient';
import { PostCard } from '../../components/feed/PostCard';
import { PostComposer } from '../../components/feed/PostComposer';

type Post = {
  id: string;
  contentText: string;
  createdAt: string;
  authorId: string;
};

export default async function FeedPage() {
  let posts: Post[] = [];
  try {
    posts = await api<Post[]>('/posts/feed', { headers: { Authorization: 'Bearer dev-token' } });
  } catch {
    posts = [];
  }

  return (
    <section className="space-y-4">
      <PostComposer />
      {posts.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-slate-500 shadow-sm">No posts yet.</div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </section>
  );
}
