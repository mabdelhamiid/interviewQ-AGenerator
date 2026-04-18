# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```









# 📁 هيكل المشروع - إزاي تحط الملفات

## الملفات دي اتعملت بالترتيب ده:

```
interview-pro/
│
├── src/
│   ├── types/
│   │   └── index.ts              ← من: types__index.ts
│   │
│   ├── constants/
│   │   ├── index.ts              ← من: constants__index.ts
│   │   └── models.ts             ← من: constants__models.ts
│   │
│   ├── utils/
│   │   ├── storage.ts            ← من: utils__storage.ts
│   │   └── parser.ts             ← من: utils__parser.ts
│   │
│   ├── context/
│   │   └── AppContext.tsx        ← من: context__AppContext.tsx
│   │
│   ├── components/
│   │   └── layout/
│   │       └── Header.tsx        ← من: components__layout__Header.tsx
│   │
│   ├── pages/
│   │   ├── HomePage.tsx          ← من: pages__HomePage.tsx
│   │   ├── GeneratePage.tsx      ← من: pages__GeneratePage.tsx
│   │   ├── SavedPage.tsx         ← من: pages__SavedPage.tsx
│   │   └── SettingsPage.tsx      ← من: pages__SettingsPage.tsx
│   │
│   ├── App.tsx                   ← من: App.tsx
│   └── index.css                 ← من: index.css
│
├── vite.config.ts                ← من: vite.config.ts
└── (باقي ملفات المشروع زي ما هي)
```

## خطوات التثبيت:

1. اعمل الـ folders دي في `src/`:
   - `types/`
   - `constants/`
   - `utils/`
   - `context/`
   - `components/layout/`
   - `pages/`

2. انسخ كل ملف لمكانه الصح حسب الجدول فوق

3. شغّل:
```powershell
npm run dev
```

## الصفحات:
- `/`          → الرئيسية (Dashboard)
- `/generate`  → توليد الأسئلة
- `/saved`     → الأسئلة المحفوظة
- `/settings`  → إعدادات الـ API Keys
