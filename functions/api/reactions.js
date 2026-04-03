function kvKey(postId) {
  return `reaction2:${postId}`;
}

export async function onRequestGet(context) {
  const kv = context.env.VISITS_KV;
  const postId = new URL(context.request.url).searchParams.get("post");

  if (!postId) {
    return new Response(JSON.stringify({ error: "post parameter required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!kv) {
    return new Response(JSON.stringify({}), {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  const raw = await kv.get(kvKey(postId));
  const data = raw ? JSON.parse(raw) : {};

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export async function onRequestPost(context) {
  const kv = context.env.VISITS_KV;
  const url = new URL(context.request.url);
  const postId = url.searchParams.get("post");

  let emoji, remove;
  try {
    const body = await context.request.json();
    emoji = body.emoji;
    remove = body.remove === true;
  } catch {
    return new Response(JSON.stringify({ error: "invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!postId || !emoji) {
    return new Response(JSON.stringify({ error: "post and emoji required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 絵文字の長さを制限（スプレッドで正確なコードポイント数を計算）
  if ([...emoji].length > 2) {
    return new Response(JSON.stringify({ error: "invalid emoji" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!kv) {
    return new Response(JSON.stringify({ emoji, count: remove ? 0 : 1 }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const key = kvKey(postId);
  const raw = await kv.get(key);
  const data = raw ? JSON.parse(raw) : {};
  if (remove) {
    data[emoji] = Math.max(0, (data[emoji] ?? 0) - 1);
    if (data[emoji] === 0) delete data[emoji];
  } else {
    data[emoji] = (data[emoji] ?? 0) + 1;
  }
  await kv.put(key, JSON.stringify(data));

  return new Response(JSON.stringify({ emoji, count: data[emoji] }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
