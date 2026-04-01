# デプロイ手順

## 1. ローカルで動作確認

### 開発中のリアルタイム確認（ホットリロード）

DevContainerを起動すると自動でdevサーバーが立ち上がり、ブラウザが開きます。

ファイルを編集するとブラウザが即座に更新されます。

### デプロイ前の最終確認（本番ビルドで確認）

```bash
npm run build && npm run preview -- --host 0.0.0.0
```

ブラウザで `http://localhost:4321` を開いて確認します。

> devサーバーと異なり、実際にビルドされた成果物を確認できるため、デプロイ前に必ず実施することを推奨します。

---

## 2. GitHubにpush

```bash
git add src/ public/ doc/          # 変更したファイルを指定
git commit -m "記事タイトルや変更内容"
git push origin main
```

---

## 3. Cloudflare Pagesにデプロイ

### APIトークンの確認

初回のみ、CloudflareダッシュボードでAPIトークンを取得します。

1. https://dash.cloudflare.com にログイン
2. 右上アイコン → **My Profile** → **API Tokens**
3. **Create Token** → **Edit Cloudflare Workers** テンプレートを選択
4. **Continue to summary** → **Create Token**
5. 表示されたトークンを安全な場所に保存

> ⚠️ トークンは一度しか表示されません。必ずメモしておいてください。

### デプロイ実行

```bash
npm run build
CLOUDFLARE_API_TOKEN='あなたのAPIトークン' npx wrangler pages deploy dist --project-name homepage
```

成功すると以下のようなURLが表示されます。

```
✨ Deployment complete! Take a peek over at https://xxxxxx.homepage-3pk.pages.dev
```

### 本番URLで確認

https://homepage-3pk.pages.dev

---

## まとめ：毎回の作業フロー

```
① 記事・コードを編集
        ↓
② ブラウザで見た目を確認（自動ホットリロード）
   npm run dev -- --host 0.0.0.0     # コンテナ内で実行
   # または docker compose up        # ホストマシンで実行
        ↓
③ 本番ビルドで最終確認
   npm run build && npm run preview -- --host 0.0.0.0
        ↓
④ GitHubにpush
   git add / git commit / git push
        ↓
⑤ Cloudflare Pagesにデプロイ
   CLOUDFLARE_API_TOKEN='...' npx wrangler pages deploy dist --project-name homepage
        ↓
⑥ 本番URLで確認
   https://homepage-3pk.pages.dev
```
