# デプロイ手順

## 1. ローカルで動作確認

### 開発中のリアルタイム確認（ホットリロード）

DevContainerを起動すると自動でdevサーバーが立ち上がり、ブラウザが開きます。

ファイルを編集するとブラウザが即座に更新されます。

### デプロイ前の最終確認（本番ビルドで確認）

```bash
npm run build && npm run preview -- --host 0.0.0.0
```

それぞれ以下のURLで確認します。

| 表示           | URL                             |
| -------------- | ------------------------------- |
| PC             | `http://localhost:4321/`        |
| スマートフォン | `http://localhost:4321/preview` |

スマートフォン用URLでは、サイトがモバイル幅（390px）で表示されます。iframe内で通常通りリンクをたどれるため、本番と同じ操作感で確認できます。

特定ページを直接開く場合は `path` パラメータを使います。

```
http://localhost:4321/preview?path=/blog/記事名
```

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

## 4. アクセス数カウンターのセットアップ（初回のみ）

ホーム画面に「today」「total visits」を表示するために、Cloudflare KV の設定が必要です。

### KV ネームスペースの作成

```bash
CLOUDFLARE_API_TOKEN='あなたのAPIトークン' npx wrangler kv namespace create VISITS_KV
```

成功すると以下のように表示されます。

```
{ binding = "VISITS_KV", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
```

表示された **id** をメモしておきます。

### Cloudflare ダッシュボードで KV バインドを設定

1. https://dash.cloudflare.com にログイン
2. **Workers & Pages** → **homepage** プロジェクトを選択
3. **設定** → **Functions** → **KV namespace bindings**
4. **Add binding** をクリック
5. Variable name: `VISITS_KV`、KV namespace: 先ほど作成したネームスペースを選択
6. **Save** をクリック

設定後、次回のデプロイから `today` / `total visits` の値が表示されます。

> ローカル開発中（`npm run dev`）はカウンターは動作せず、「—」と表示されます。これは正常です。

---

## まとめ：毎回の作業フロー

```
① 記事・コードを編集
        ↓
② ブラウザで見た目を確認（自動ホットリロード）
   npm run dev -- --host 0.0.0.0     # コンテナ内で実行
   # または docker compose up        # ホストマシンで実行
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
   CLOUDFLARE_API_TOKEN='...' npx wrangler pages deploy dist --project-name homepage
        ↓
⑥ 本番URLで確認
   https://homepage-3pk.pages.dev
```
