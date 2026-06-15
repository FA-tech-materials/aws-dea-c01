import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages はサブパス（/<repo名>/）で配信されるため base を設定。
// リポジトリ名が異なる場合はここを変更してください（例: '/my-repo/'）。
// 環境変数 VITE_BASE で上書き可能。
export default defineConfig({
  base: process.env.VITE_BASE || '/dea-c01-master/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
