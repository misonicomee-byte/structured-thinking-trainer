# 構造化思考トレーニングアプリ

ごうホームクリニックの職員向け構造化思考トレーニングアプリケーション

## 概要

在宅医療の現場で必要な構造化思考を、実践的なシナリオを通じて学習できるWebアプリケーションです。
AI（Claude）による自動評価とフィードバックで、効率的なスキルアップをサポートします。

## 機能

- **3つの練習問題**: MECE、ロジックツリー、ピラミッドストラクチャーの各フレームワークを実践
- **AI自動評価**: Claude API による構造化思考の評価とフィードバック
- **自動保存**: 回答内容を自動的にローカルストレージに保存
- **進捗管理**: 各問題のスコアと進捗をビジュアル表示
- **修正・再提出**: フィードバックを参考に回答を改善可能

## 技術スタック

- **フロントエンド**: React 19 + TypeScript + Vite 7
- **UI**: Tailwind CSS 4
- **State Management**: React Context API
- **AI評価**: Claude Sonnet 4.5 (Anthropic API)
- **API Proxy**: Cloudflare Workers
- **Hosting**: GitHub Pages

## 開発環境のセットアップ

### 必要な環境

- Node.js 20+
- npm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/misonicomee-byte/structured-thinking-trainer.git
cd structured-thinking-trainer

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:5173 にアクセス

### ビルド

```bash
npm run build
```

## Cloudflare Worker のセットアップ

1. Cloudflare Workersディレクトリに移動:
```bash
cd cloudflare-worker
npm install
```

2. Anthropic API キーを環境変数として設定:
```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

3. デプロイ:
```bash
npm run deploy
```

4. デプロイされたWorker URLをフロントエンドの設定に反映:
`src/hooks/useClaudeEvaluation.ts` の `WORKER_URL` を更新

## プロジェクト構造

```
structured-thinking-trainer/
├── src/
│   ├── components/          # UIコンポーネント
│   │   ├── ProblemCard.tsx
│   │   ├── AnswerInput.tsx
│   │   ├── ProgressTracker.tsx
│   │   └── FeedbackDisplay.tsx
│   ├── contexts/            # グローバルステート管理
│   │   └── AppContext.tsx
│   ├── hooks/               # カスタムフック
│   │   ├── useLocalStorage.ts
│   │   ├── useAutoSave.ts
│   │   └── useClaudeEvaluation.ts
│   ├── lib/                 # ユーティリティ
│   │   └── problems.ts
│   └── types/               # TypeScript型定義
│       └── index.ts
├── cloudflare-worker/       # APIプロキシ
│   └── src/
│       └── index.js
└── .github/workflows/       # CI/CD
    └── deploy.yml
```

## デプロイ

GitHub Pagesへの自動デプロイが設定されています。
`main` ブランチにプッシュすると自動的にデプロイされます。

デプロイURL: https://misonicomee-byte.github.io/structured-thinking-trainer/

## ライセンス

MIT

## 作成者

ごうホームクリニック - 開発チーム
