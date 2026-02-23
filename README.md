本專案為個人/教學性質之練習與範例作品，僅供學習、展示與測試用途。專案在設計或介面上「向 Book Depository 致敬」，但本專案與 Book Depository 或其關聯公司無任何關係，亦非其官方產品或授權作品。
# MAP — Admin / Public Frontend

簡介
---
一個以 React + TypeScript + Vite 建置的前端專案，用於展示書籍與文章，帶有後台管理介面（產品 / 文章 / 地圖即時視覺化）。

主要技術
---
- React 19 + TypeScript
- Vite 開發環境（[vite.config.ts](vite.config.ts)）
- Zustand（狀態管理）
- Radix UI / shadcn 組件
- Leaflet 地圖（[src/components/LeafletMap.tsx](src/components/LeafletMap.tsx)）
- Axios（API 請求： [src/api/api.ts](src/api/api.ts)）
- Tailwind CSS（樣式在 [src/style/style.css](src/style/style.css)）

功能概況
---
- 公開端：
  - 首頁、商品列表與詳情、文章列表與內文（參考 [src/Page/public/ArticlePage.tsx](src/Page/public/ArticlePage.tsx)）
  - 即時地圖視覺化（Leaflet）：[src/components/LeafletMap.tsx](src/components/LeafletMap.tsx)
- 後台管理：
  - 商品管理（新增/編輯/上傳圖片）— 關鍵元件：[ProductModal](src/components/products/ProductModal/ProductModal.tsx)
  - 文章管理（新增/編輯/標籤/圖片）— 關鍵元件：[ArticleModal](src/components/products/articles/ArticleModal.tsx)
  - 圖片上傳邏輯抽成 Hook：[useProductImages](src/components/products/ProductModal/hooks/useProductImages.ts)

專案結構重點
---
- 入口：[src/main.tsx](src/main.tsx)、[src/App.tsx](src/App.tsx)
- API 封裝：[src/api/api.ts](src/api/api.ts) 與各子目錄（/folder_admin, /folder_user）
- 後台頁面：[src/Page/admin](src/Page/admin)
  - Article 管理：[`openModal`](src/Page/admin/Article.tsx) → 傳入 [ArticleModal](src/components/products/articles/ArticleModal.tsx)
- UI 元件： [src/components/ui](src/components/ui)
- Hook 與 Store： [src/store](src/store)、[src/components/products/ProductModal/hooks/useProductImages.ts](src/components/products/ProductModal/hooks/useProductImages.ts)

快速啟動
---
```sh
# 安裝
npm install

# 開發
npm run dev

# 建置
npm run build
```

重要檔案與參考
---
- [src/main.tsx](src/main.tsx) — 應用入口
- [vite.config.ts](vite.config.ts) — Vite 設定
- [package.json](package.json) — 指令與相依套件
- [src/api/api.ts](src/api/api.ts) — Axios 實例與攔截器
- [src/components/products/articles/ArticleModal.tsx](src/components/products/articles/ArticleModal.tsx) — 文章 Modal
- [src/components/products/ProductModal/hooks/useProductImages.ts](src/components/products/ProductModal/hooks/useProductImages.ts) — 圖片 Hook
- [src/Page/admin/Article.tsx](src/Page/admin/Article.tsx) — Article 管理頁（openModal）
