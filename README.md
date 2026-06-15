# DEA-C01 Master 🗄️

**AWS Certified Data Engineer – Associate (DEA-C01)** の学習Webアプリです。
React + TypeScript + Vite + Tailwind CSS で構築され、GitHub Actions で自動ビルド・デプロイされます。

![tech](https://img.shields.io/badge/React-18-61dafb) ![tech](https://img.shields.io/badge/TypeScript-5-3178c6) ![tech](https://img.shields.io/badge/Vite-6-646cff) ![tech](https://img.shields.io/badge/Tailwind-3-38bdf8)

## ✨ 特徴

- **全72問** — 公式試験ガイドの4ドメイン構成に準拠
  - D1 データの取り込みと変換（34%）— 24問
  - D2 データストアの管理（26%）— 18問
  - D3 データ運用とサポート（22%）— 16問
  - D4 データセキュリティとガバナンス（18%）— 14問
- **🎯 本番形式 模擬試験** — 65問・制限時間130分・タイマー付き・合格判定（72%）
- **🔀 クイック練習** — 1問ごとに即時解説
- **📂 分野別学習** — 弱点分野を集中強化
- **📖 学習リファレンス** — 分野ごとの頻出AWSサービス早見表
- **⭐ ブックマーク** — 後で復習したい問題を保存
- **❌ 間違えた問題の復習** — 結果画面から不正解問だけ再挑戦
- **📊 統計ダッシュボード** — 分野別正答率・苦手問題・受験履歴
- **💾 データ管理** — localStorage 自動保存 + JSON エクスポート/インポート
- **📱 レスポンシブ** — PC・スマホ対応のダークモダンUI

## 🛠 技術スタック

| 領域 | 採用技術 |
|------|---------|
| フレームワーク | React 18 + TypeScript 5 |
| ビルド | Vite 6 |
| スタイル | Tailwind CSS 3 |
| 状態管理 | React Hooks（カスタムフック）|
| 永続化 | localStorage |
| CI/CD | GitHub Actions → GitHub Pages |

単一HTMLではなく、**コンポーネント分割・型安全・自動ビルドパイプライン**を備えた本格的なSPA構成です。

```
src/
├── components/      # UIコンポーネント（Home, Quiz, Result, Stats, Study, Settings...）
├── data/            # 問題データ・ドメイン定義
├── hooks/           # useProgress（永続化）, useTimer（試験タイマー）
├── types/           # TypeScript 型定義
└── styles/          # Tailwind + カスタムCSS
```

## 🚀 GitHub Pages へのデプロイ

### 前提
- このプロジェクト一式を GitHub リポジトリにプッシュ

### 手順

1. **リポジトリを作成してプッシュ**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: DEA-C01 Master"
   git branch -M main
   git remote add origin https://github.com/<ユーザー名>/<リポジトリ名>.git
   git push -u origin main
   ```

2. **GitHub Pages を有効化**
   - リポジトリの **Settings → Pages** を開く
   - **Source** で **「GitHub Actions」** を選択（"Deploy from a branch" ではない点に注意）

3. **自動デプロイ**
   - `main` ブランチへのプッシュで `.github/workflows/deploy.yml` が起動
   - 自動で `npm ci` → `npm run build` → デプロイ
   - 数分後 `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開

> **base パスについて**: ワークフローはリポジトリ名を自動検出して Vite の `base` に設定します（`VITE_BASE="/<repo>/"`）。リポジトリ名を変えても追加設定は不要です。

### ローカル開発

```bash
npm install      # 依存インストール
npm run dev      # 開発サーバー（http://localhost:5173）
npm run build    # 本番ビルド（dist/ に出力）
npm run preview  # ビルド結果をプレビュー
```

## 📝 問題の追加・編集

問題データは `src/data/questions-part1.ts`（D1/D2）と `src/data/questions.ts`（D3/D4）にあります。

```typescript
{
  id: 'd1-025',          // 一意なID（重複不可）
  domain: 'D1',          // 'D1' | 'D2' | 'D3' | 'D4'
  service: 'Kinesis',    // 関連AWSサービス（タグ表示・任意）
  question: '問題文…',    // 問題文（```で囲むとコードブロック表示）
  options: ['選択肢A', '選択肢B', '選択肢C', '選択肢D'],
  answer: 1,             // 正解インデックス（0〜3）
  explanation: '解説…',  // 解説文
}
```

型は `src/types/index.ts` で定義されているため、エディタの補完と型チェックが効きます。

## 💾 データの保存

- 学習データはブラウザの **localStorage**（キー: `dea-c01-master-v1`）に保存
- 同一ブラウザ・同一ドメインで永続化
- 「設定」画面から JSON エクスポート/インポートで端末間移行が可能

## 📄 ライセンス

自由に改変・再配布できます。問題内容はDEA-C01の学習目的で作成したオリジナルです。

---

**試験情報（2026年時点）**: 65問 / 130分 / 合格720点(1000点満点) / 受験料 $150
4ドメイン構成。詳細は[公式試験ガイド](https://aws.amazon.com/certification/certified-data-engineer-associate/)を確認してください。
