function kvKey(postId) {
  return `comments:${postId}`;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export async function onRequestGet(context) {
  const kv = context.env.VISITS_KV;
  const postId = new URL(context.request.url).searchParams.get("post");

  if (!postId) return jsonResponse({ error: "post parameter required" }, 400);
  if (!kv) return jsonResponse([], 200);

  const raw = await kv.get(kvKey(postId));
  const comments = raw ? JSON.parse(raw) : [];
  // トークンは返さない
  return jsonResponse(comments.map(({ token, ...rest }) => rest));
}

export async function onRequestPost(context) {
  const kv = context.env.VISITS_KV;
  const postId = new URL(context.request.url).searchParams.get("post");

  if (!postId) return jsonResponse({ error: "post parameter required" }, 400);

  let content;
  try {
    const body = await context.request.json();
    content = body.content?.trim();
  } catch {
    return jsonResponse({ error: "invalid JSON body" }, 400);
  }

  if (!content) return jsonResponse({ error: "content required" }, 400);
  if (content.length > 1000) return jsonResponse({ error: "content too long (max 1000)" }, 400);

  const token = crypto.randomUUID();
  const comment = {
    id: crypto.randomUUID(),
    content,
    timestamp: new Date().toISOString(),
    edited: false,
    token,
  };

  if (!kv) return jsonResponse(comment);

  const key = kvKey(postId);
  const raw = await kv.get(key);
  const comments = raw ? JSON.parse(raw) : [];
  comments.push(comment);
  await kv.put(key, JSON.stringify(comments));

  return jsonResponse(comment);
}

export async function onRequestPut(context) {
  const kv = context.env.VISITS_KV;
  const url = new URL(context.request.url);
  const postId = url.searchParams.get("post");
  const commentId = url.searchParams.get("id");

  if (!postId || !commentId) return jsonResponse({ error: "post and id required" }, 400);

  let token, content;
  try {
    const body = await context.request.json();
    token = body.token;
    content = body.content?.trim();
  } catch {
    return jsonResponse({ error: "invalid JSON body" }, 400);
  }

  if (!token || !content) return jsonResponse({ error: "token and content required" }, 400);
  if (content.length > 1000) return jsonResponse({ error: "content too long (max 1000)" }, 400);
  if (!kv) return jsonResponse({ error: "storage unavailable" }, 503);

  const key = kvKey(postId);
  const raw = await kv.get(key);
  const comments = raw ? JSON.parse(raw) : [];
  const idx = comments.findIndex((c) => c.id === commentId);

  if (idx === -1) return jsonResponse({ error: "comment not found" }, 404);
  if (comments[idx].token !== token) return jsonResponse({ error: "unauthorized" }, 403);

  comments[idx].content = content;
  comments[idx].edited = true;
  await kv.put(key, JSON.stringify(comments));

  const { token: _t, ...publicComment } = comments[idx];
  return jsonResponse(publicComment);
}

export async function onRequestDelete(context) {
  const kv = context.env.VISITS_KV;
  const url = new URL(context.request.url);
  const postId = url.searchParams.get("post");
  const commentId = url.searchParams.get("id");

  if (!postId || !commentId) return jsonResponse({ error: "post and id required" }, 400);

  let token;
  try {
    const body = await context.request.json();
    token = body.token;
  } catch {
    return jsonResponse({ error: "invalid JSON body" }, 400);
  }

  if (!token) return jsonResponse({ error: "token required" }, 400);
  if (!kv) return jsonResponse({ error: "storage unavailable" }, 503);

  const key = kvKey(postId);
  const raw = await kv.get(key);
  const comments = raw ? JSON.parse(raw) : [];
  const idx = comments.findIndex((c) => c.id === commentId);

  if (idx === -1) return jsonResponse({ error: "comment not found" }, 404);
  if (comments[idx].token !== token) return jsonResponse({ error: "unauthorized" }, 403);

  comments.splice(idx, 1);
  await kv.put(key, JSON.stringify(comments));

  return jsonResponse({ success: true });
}
