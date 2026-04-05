# デプロイ手順

各作業は独立して実施できます。それぞれ必要な手順をすべて記載しています。

---

## ローカルで動作確認する

### 開発中（ホットリロード）

コメント・リアクションをローカルで保存しながら確認するには `dev:pages` を使います。

```bash
# コンテナ内で（既存のdevサーバーが起動中の場合は先にCtrl+Cで停止する）
npm run dev:pages
```

`http://localhost:4321/` でブラウザ確認できます。ファイルを編集すると即座に更新されます。

> コメント・リアクションのデータは `.wrangler/state/` に保存されるため、再起動後もリロードで消えません（本番KVとは別のデータです）。

`docker compose up` では同様に `dev:pages` が実行されます。

### デプロイ前の最終確認（本番ビルドで確認）

```bash
npm run build && npm run preview -- --host 0.0.0.0
```

| 表示           | URL                             |
| -------------- | ------------------------------- |
| PC             | `http://localhost:4321/`        |
| スマートフォン | `http://localhost:4321/preview` |

特定ページを直接開く場合は `path` パラメータを使います。

```
http://localhost:4321/preview?path=/blog/記事名
```

> devサーバーと異なり、実際にビルドされた成果物を確認できるため、デプロイ前に必ず実施することを推奨します。

---

## GitHubにpushする

```bash
git add src/ public/ doc/          # 変更したファイルを指定
git commit -m "記事タイトルや変更内容"
git push origin main
```

---

## Cloudflare Pagesにデプロイする

```bash
npm run build
CLOUDFLARE_API_TOKEN='あなたのAPIトークン' npx wrangler pages deploy dist --project-name homepage
```

> `npm run build` は `dist/` の生成と `dist/functions/` へのAPI関数のコピーを同時に行います。

成功すると以下のようなURLが表示されます。

```
✨ Deployment complete! Take a peek over at https://xxxxxx.homepage-3pk.pages.dev
```

本番URL: https://homepage-3pk.pages.dev

> **APIトークンの取得（初回のみ）**
> 1. https://dash.cloudflare.com にログイン
> 2. 右上アイコン → **My Profile** → **API Tokens**
> 3. **Create Token** → **Edit Cloudflare Workers** テンプレートを選択
> 4. **Continue to summary** → **Create Token**
> 5. 表示されたトークンを安全な場所に保存（一度しか表示されません）

---

## KVネームスペースをセットアップする（初回のみ）

ホーム画面の「today」「total visits」表示、コメント・リアクション機能に必要です。

### 1. KVネームスペースを作成する

```bash
CLOUDFLARE_API_TOKEN='あなたのAPIトークン' npx wrangler kv namespace create VISITS_KV
```

成功すると以下のように表示されます。

```
{ binding = "VISITS_KV", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
```

表示された **id** をメモしておきます。

### 2. Cloudflareダッシュボードでバインドを設定する

1. https://dash.cloudflare.com にログイン
2. **Workers & Pages** → **homepage** プロジェクトを選択
3. **設定** → **Functions** → **KV namespace bindings**
4. **Add binding** をクリック
5. Variable name: `VISITS_KV`、KV namespace: 先ほど作成したネームスペースを選択
6. **Save** をクリック

設定後、次回のデプロイからコメント・リアクション・アクセス数が正しく動作します。

---

## まとめ：毎回の作業フロー

```
① 記事・コードを編集
        ↓
② ブラウザで見た目を確認（自動ホットリロード）
   npm run dev:pages              # コンテナ内で実行（コメント・リアクションも動作）
   # または docker compose up     # ホストマシンで実行
        ↓
③ PC・スマートフォン両方の表示を確認
   npm run build && npm run preview -- --host 0.0.0.0
   - PC表示：   http://localhost:4321/
   - スマホ表示：http://localhost:4321/preview
        ↓
④ GitHubにpush
   git add / git commit / git push
        ↓
⑤ Cloudflare Pagesにデプロイ
   npm run build
   CLOUDFLARE_API_TOKEN='...' npx wrangler pages deploy dist --project-name homepage
        ↓
⑥ 本番URLで確認
   https://homepage-3pk.pages.dev
```
