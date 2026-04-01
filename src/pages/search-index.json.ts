import { getCollection } from 'astro:content';

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, '')        // コードブロック
    .replace(/`[^`]*`/g, '')               // インラインコード
    .replace(/#{1,6}\s/g, '')              // 見出し
    .replace(/\*\*([^*]+)\*\*/g, '$1')    // bold
    .replace(/\*([^*]+)\*/g, '$1')         // italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // リンク
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')  // 画像
    .replace(/>\s/g, '')                   // 引用
    .replace(/[-*+]\s/g, '')              // リスト
    .replace(/\$\$[\s\S]*?\$\$/g, '')     // 数式ブロック
    .replace(/\$[^$]*\$/g, '')            // インライン数式
    .replace(/\n+/g, ' ')
    .trim();
}

export async function GET() {
  const posts = await getCollection('blog');
  const index = posts
    .filter((p) => !p.data.draft)
    .map((p) => ({
      id: p.id,
      title: p.data.title,
      description: p.data.description,
      tags: p.data.tags,
      date: p.data.date.toISOString().slice(0, 10),
      body: stripMarkdown(p.body ?? ''),
    }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
}
