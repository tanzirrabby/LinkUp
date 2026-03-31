# LinkUp — Scalable Social Networking Platform Design

## 1) High-Level System Architecture

```text
[Web/Mobile Client (Next.js/React)]
            |
            v
      [API Gateway / Load Balancer]
            |
   +--------+---------+
   |                  |
   v                  v
[Auth + User API]   [Social API]
   |                  |
   |          +-------+------------------------------+
   |          |       |              |               |
   |          v       v              v               v
   |       [Feed]  [Graph]       [Search]   [Notification Service]
   |          |       |              |               |
   +----------+-------+--------------+---------------+
                      |
                      v
       [PostgreSQL (primary) + Read Replicas]
                      |
                      v
             [Redis Cache + Pub/Sub]
                      |
                      v
      [Object Storage (S3-compatible) for media]
                      |
                      v
           [CDN for image/video delivery]
```

### Core architectural choices
- **Frontend:** Next.js (TypeScript + Tailwind CSS) for SSR/ISR, fast initial page loads, and SEO for public profiles/posts.
- **Backend:** Node.js + Express (modular monolith initially, service extraction later).
- **Database:** **PostgreSQL** for relational integrity (friend graph, privacy ACLs, notifications).
- **Realtime:** Socket.IO with Redis adapter for horizontally scaled notification delivery.
- **Storage:** S3-style bucket (e.g., AWS S3, Cloudflare R2, MinIO).

### Scalability strategy
- Start as a **modular monolith** with clear bounded modules: auth, users, posts, comments, reactions, friendships, notifications, search.
- Scale with:
  - Horizontal API replicas behind load balancer.
  - Redis for cache, rate-limits, session/jti revocation, and socket fanout.
  - Postgres read replicas for read-heavy feeds and profile pages.
  - Queue-backed workers for fanout, thumbnails, and async notification processing.

---

## 2) Backend Project Structure (Node.js + Express + TypeScript)

```text
linkup-backend/
  src/
    app.ts
    server.ts

    config/
      env.ts
      logger.ts
      db.ts
      redis.ts
      socket.ts

    modules/
      auth/
        auth.controller.ts
        auth.service.ts
        auth.repository.ts
        auth.routes.ts
        auth.schema.ts

      users/
        user.controller.ts
        user.service.ts
        user.repository.ts
        user.routes.ts
        user.schema.ts

      friendships/
        friendship.controller.ts
        friendship.service.ts
        friendship.repository.ts
        friendship.routes.ts

      posts/
        post.controller.ts
        post.service.ts
        post.repository.ts
        post.routes.ts
        post.schema.ts

      comments/
        comment.controller.ts
        comment.service.ts
        comment.repository.ts
        comment.routes.ts

      reactions/
        reaction.controller.ts
        reaction.service.ts
        reaction.repository.ts
        reaction.routes.ts

      shares/
        share.controller.ts
        share.service.ts
        share.repository.ts
        share.routes.ts

      notifications/
        notification.controller.ts
        notification.service.ts
        notification.repository.ts
        notification.routes.ts
        notification.gateway.ts

      search/
        search.controller.ts
        search.service.ts
        search.routes.ts

      media/
        media.controller.ts
        media.service.ts
        media.routes.ts

    middleware/
      auth.middleware.ts
      role.middleware.ts
      privacy.middleware.ts
      rateLimit.middleware.ts
      validation.middleware.ts
      error.middleware.ts

    common/
      constants/
      errors/
      types/
      utils/

    jobs/
      feedFanout.job.ts
      thumbnail.job.ts
      notification.job.ts

    docs/
      openapi.yaml

  tests/
    integration/
    unit/

  package.json
  tsconfig.json
```

---

## 3) REST API Endpoint List

### Auth
- `POST /api/v1/auth/signup` — register user
- `POST /api/v1/auth/login` — login with email/username + password
- `POST /api/v1/auth/oauth/google` — OAuth login
- `POST /api/v1/auth/refresh` — rotate refresh token
- `POST /api/v1/auth/logout` — revoke refresh token/device

### Users / Profile
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `GET /api/v1/users/:userId`
- `PATCH /api/v1/users/me/avatar` (pre-signed upload flow)
- `PATCH /api/v1/users/me/cover`

### Friend Requests & Connections
- `POST /api/v1/friendships/requests/:targetUserId`
- `PATCH /api/v1/friendships/requests/:requestId/accept`
- `PATCH /api/v1/friendships/requests/:requestId/reject`
- `DELETE /api/v1/friendships/:friendUserId` (unfriend)
- `GET /api/v1/friendships/requests/incoming`
- `GET /api/v1/friendships/requests/outgoing`
- `GET /api/v1/friendships/:userId/friends`

### Posts / Feed
- `POST /api/v1/posts`
- `GET /api/v1/posts/:postId`
- `PATCH /api/v1/posts/:postId`
- `DELETE /api/v1/posts/:postId`
- `GET /api/v1/feed?cursor=...` (mixed home feed)
- `GET /api/v1/users/:userId/posts?cursor=...`

### Reactions, Comments, Shares
- `POST /api/v1/posts/:postId/reactions` (like/love etc.)
- `DELETE /api/v1/posts/:postId/reactions`
- `POST /api/v1/posts/:postId/comments`
- `GET /api/v1/posts/:postId/comments?cursor=...`
- `PATCH /api/v1/comments/:commentId`
- `DELETE /api/v1/comments/:commentId`
- `POST /api/v1/posts/:postId/shares`

### Notifications (Realtime + REST)
- `GET /api/v1/notifications?cursor=...`
- `PATCH /api/v1/notifications/:id/read`
- `PATCH /api/v1/notifications/read-all`
- Socket event: `notification:new`
- Socket event: `notification:read`

### Search
- `GET /api/v1/search/users?q=...`
- `GET /api/v1/search/posts?q=...`
- `GET /api/v1/search/all?q=...`

### Privacy
- Post payload includes `visibility: public | friends | private`
- `PATCH /api/v1/posts/:postId/privacy`
- `GET /api/v1/users/me/privacy-settings`
- `PATCH /api/v1/users/me/privacy-settings`

---

## 4) Database Design (PostgreSQL)

### Primary tables

#### `users`
- `id (uuid, pk)`
- `email (unique, indexed)`
- `username (unique, indexed)`
- `password_hash`
- `display_name`
- `bio`
- `avatar_url`
- `cover_url`
- `is_verified`
- `created_at`, `updated_at`

#### `auth_identities`
- `id`
- `user_id (fk users.id)`
- `provider (local|google|github...)`
- `provider_user_id`
- `created_at`

#### `refresh_tokens`
- `id`
- `user_id`
- `token_hash`
- `device_info`
- `ip`
- `expires_at`
- `revoked_at`

#### `friend_requests`
- `id`
- `requester_id`
- `receiver_id`
- `status (pending|accepted|rejected|cancelled)`
- `created_at`, `responded_at`
- unique partial index for one pending pair

#### `friendships`
- `id`
- `user_id`
- `friend_id`
- `created_at`
- uniqueness on `(user_id, friend_id)`

#### `posts`
- `id`
- `author_id`
- `content_text`
- `visibility (public|friends|private)`
- `parent_post_id` (for shares/reposts)
- `created_at`, `updated_at`, `deleted_at`

#### `post_media`
- `id`
- `post_id`
- `media_type (image|video)`
- `url`
- `width`, `height`
- `sort_order`

#### `comments`
- `id`
- `post_id`
- `author_id`
- `parent_comment_id` (nullable for threading)
- `content`
- `created_at`, `updated_at`, `deleted_at`

#### `reactions`
- `id`
- `post_id`
- `user_id`
- `reaction_type`
- `created_at`
- unique `(post_id, user_id)`

#### `notifications`
- `id`
- `user_id` (recipient)
- `actor_id`
- `type` (friend_request, like, comment, share, mention)
- `entity_type` / `entity_id`
- `payload_json`
- `is_read`
- `created_at`

#### `privacy_settings`
- `user_id (pk)`
- `default_post_visibility`
- `allow_friend_requests`
- `profile_visibility`

### Indexing notes
- Feed queries: index `posts(author_id, created_at desc)` and `posts(created_at desc)`.
- Notifications: `notifications(user_id, is_read, created_at desc)`.
- Search:
  - Basic: Postgres `GIN` full-text indexes.
  - Advanced: offload to OpenSearch/Meilisearch.

---

## 5) Authentication Flow (JWT + Rotating Refresh Tokens)

1. User logs in via local credentials or OAuth provider.
2. Server issues:
   - short-lived **access token** (e.g., 15 min)
   - long-lived **refresh token** (e.g., 30 days, HTTP-only secure cookie)
3. Access token used for API authorization (`Authorization: Bearer ...`).
4. On expiry, client hits `/auth/refresh`.
5. Refresh token is rotated and old token invalidated (replay protection).
6. Logout revokes current refresh token (or all device sessions).

### Security controls
- Passwords hashed with Argon2id/bcrypt + strong policy.
- HTTP-only, Secure, SameSite cookies for refresh token.
- CSRF protection for cookie-auth endpoints.
- Rate limiting: login/signup/password reset.
- IP/device heuristics for suspicious session detection.
- JWT signed with asymmetric keys (`RS256`) and key rotation (`kid`).
- Input validation (`zod`/`joi`) + output escaping.
- Strict authorization checks on every social action.

---

## 6) Privacy Model

For each post fetch, evaluate visibility policy:
- `public`: visible to all.
- `friends`: only author’s confirmed friends.
- `private`: only author.

Enforce on:
- Feed generation.
- Direct post lookup by ID.
- Search result inclusion.
- Share/repost eligibility.

---

## 7) Frontend Structure (Next.js + TypeScript + Tailwind)

```text
linkup-frontend/
  src/
    app/
      (auth)/login/page.tsx
      (auth)/signup/page.tsx
      feed/page.tsx
      profile/[username]/page.tsx
      settings/privacy/page.tsx

    components/
      layout/
      feed/
        PostComposer.tsx
        PostCard.tsx
        CommentList.tsx
      profile/
        ProfileHeader.tsx
      friendship/
        FriendButton.tsx
      notifications/
        NotificationBell.tsx

    lib/
      apiClient.ts
      auth.ts
      socket.ts
      queryClient.ts

    stores/
      authStore.ts

    hooks/
      useFeed.ts
      useNotifications.ts
      useProfile.ts
```

### UI/UX principles
- Mobile-first responsive design.
- Skeleton loading and optimistic updates.
- Infinite scroll feed with cursor pagination.
- Accessible components (ARIA labels, keyboard nav, focus states).
- Consistent design tokens via Tailwind config.

---

## 8) Realtime Notification Design

- On social event (like/comment/friend request), API writes notification row.
- Event also published to Redis pub/sub topic.
- Socket gateway subscribed via Redis adapter emits `notification:new` to user room (`user:{id}`).
- Client updates bell count and list instantly.
- Fallback to polling `/notifications` when socket unavailable.

---

## 9) Future Scalability Improvements

1. **Feed fanout optimization**
   - Start with fanout-on-read.
   - Introduce hybrid fanout (on-write for normal users, on-read for celebrities).

2. **Service extraction**
   - Split into auth, social graph, feed, media, notifications microservices.

3. **CQRS for heavy read paths**
   - Dedicated read models for feed/profile timelines.

4. **Search scaling**
   - Move from SQL text search to OpenSearch clusters with ranking tuning.

5. **Event-driven architecture**
   - Kafka/NATS for durable domain events and replayable workflows.

6. **Global scale**
   - Multi-region read replicas, CDN edge caching, geo-routing.

7. **Observability and reliability**
   - OpenTelemetry traces, SLOs, circuit breakers, dead-letter queues.

8. **Security maturity**
   - Secrets manager, WAF, bot mitigation, anomaly detection, periodic threat modeling.

---

## 10) Suggested Build Order

1. Auth + Users + media upload.
2. Friend request workflow + privacy basics.
3. Posts/feed + comments/reactions/shares.
4. Notifications REST then realtime sockets.
5. Search + performance tuning.
6. Hardening: rate limits, audit logs, observability.
