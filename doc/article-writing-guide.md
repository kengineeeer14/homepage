# 記事の書き方ガイド

`src/content/blog/` に `.mdx` ファイルを作成して記事を書きます。

---

## ファイルの作成

ファイル名がそのままURLになります。

```
src/content/blog/my-article.mdx
→ http://localhost:4321/blog/my-article
```

---

## フロントマター（必須）

各記事ファイルの先頭に以下を記述します。

```mdx
---
title: "記事タイトル"
description: "記事の概要（一覧ページに表示されます）"
date: 2026-04-01
tags: ["math", "python", "tips"]
draft: false
---
```

| フィールド    | 必須 | 説明                              |
| ------------- | ---- | --------------------------------- |
| `title`       | ✅   | 記事タイトル                      |
| `description` | ✅   | 記事の概要                        |
| `date`        | ✅   | 公開日（YYYY-MM-DD形式）          |
| `tags`        | -    | タグ（省略時は空配列）            |
| `draft`       | -    | `true` にすると一覧に表示されない |

---

## 見出し

```md
# H1 見出し（記事タイトルに使うため本文では基本使わない）

## H2 見出し

### H3 見出し

#### H4 見出し
```

---

## テキスト装飾

```md
**太字**
_イタリック_
~~打ち消し線~~
`インラインコード`
```

**太字** / _イタリック_ / ~~打ち消し線~~ / `インラインコード`

---

## リスト

```md
- 箇条書き1
- 箇条書き2
  - ネスト

1. 番号付き1
2. 番号付き2
```

---

## リンク

```md
[リンクテキスト](https://example.com)
```

---

## 引用

```md
> これは引用文です。
> 複数行も書けます。
```

---

## 水平線

```md
---
```

---

## インライン数式

`$` で囲みます。

```md
質量とエネルギーの関係: $E = mc^2$

標準正規分布の確率密度関数: $f(x) = \frac{1}{\sqrt{2\pi}} e^{-\frac{x^2}{2}}$
```

質量とエネルギーの関係: $E = mc^2$

---

## ブロック数式

`$$` で囲みます。

```md
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

### よく使う数式の例

```md
# 総和

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

# 行列

$$
A = \begin{pmatrix}
  a_{11} & a_{12} \\
  a_{21} & a_{22}
\end{pmatrix}
$$

# 極限

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

# 分数・根号

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

# 偏微分

$$
\frac{\partial f}{\partial x} = 2x
$$
```

KaTeXのシンタックスリファレンス: https://katex.org/docs/supported.html

---

## コードブロック

バッククォート3つで囲み、言語名を指定するとシンタックスハイライトが適用されます。
右上に **copyボタン** が自動で表示されます。

````md
```python
def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("World"))
```
````

### 対応言語（主なもの）

| 言語         | 指定キーワード |
| ------------ | -------------- |
| Python       | `python`       |
| TypeScript   | `typescript`   |
| JavaScript   | `javascript`   |
| Rust         | `rust`         |
| Go           | `go`           |
| Shell / Bash | `bash`         |
| SQL          | `sql`          |
| YAML         | `yaml`         |
| JSON         | `json`         |
| Markdown     | `md`           |
| HTML         | `html`         |
| CSS          | `css`          |
| C / C++      | `c` / `cpp`    |
| Java         | `java`         |

---

## 画像の挿入

### 方法1: publicフォルダに置く（推奨）

`public/images/` フォルダに画像ファイルを配置し、絶対パスで参照します。

```
public/
└── images/
    └── my-image.png
```

```md
![画像の説明](/images/my-image.png)
```

### 方法2: 記事と同じフォルダに置く

記事をフォルダ形式にして画像を一緒に置く方法です。

```
src/content/blog/
└── my-article/
    ├── index.mdx     ← 記事ファイル
    └── diagram.png   ← 画像ファイル
```

```md
![図の説明](./diagram.png)
```

### 画像サイズの指定（MDXのみ）

MDXではHTMLタグも使えるため、サイズ指定が可能です。

```mdx
<img src="/images/my-image.png" alt="画像の説明" width="600" />
```

---

## テーブル

```md
| ヘッダー1 | ヘッダー2 | ヘッダー3 |
| --------- | --------- | --------- |
| セル1     | セル2     | セル3     |
| セル4     | セル5     | セル6     |
```

---

## MDXの特徴：HTMLが書ける

`.mdx` ファイルではHTMLタグをそのまま記述できます。

```mdx
<details>
<summary>クリックして展開</summary>

折りたたみ内のコンテンツです。

</details>
```

```mdx
<div style="background: #161b22; padding: 1rem; border-radius: 8px; border-left: 4px solid #58a6ff;">
  💡 ポイントとなる情報をここに書く
</div>
```

---

## 記事ファイルの例

````mdx
---
title: "勾配降下法の仕組み"
description: "機械学習の最適化手法である勾配降下法を数式付きで解説します"
date: 2026-04-01
tags: ["機械学習", "数学", "python"]
---

## 概要

勾配降下法は損失関数 $L(\theta)$ を最小化するパラメータ $\theta$ を求める手法です。

## 更新則

$$
\theta \leftarrow \theta - \eta \nabla_\theta L(\theta)
$$

ここで $\eta$ は学習率（learning rate）です。

## Pythonによる実装

```python
def gradient_descent(grad_fn, theta_init, lr=0.01, steps=100):
    theta = theta_init
    for _ in range(steps):
        grad = grad_fn(theta)
        theta -= lr * grad
    return theta
```

## 参考

- [参考リンク](https://example.com)
````
