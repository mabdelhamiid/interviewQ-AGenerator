# Interview Pro ⚡

> AI-powered interview preparation — generate targeted Q&A, save your progress, and walk into every interview ready.

![Interview Pro](https://img.shields.io/badge/version-1.0.0-6366f1?style=flat-square)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06b6d4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)

---

## Overview

**Interview Pro** is a modern, minimal interview coaching tool that uses AI to generate role-specific questions and model answers. Built for developers who want to prepare efficiently — not spend hours scrolling generic guides.

The UI is intentionally calm and focused. Think Linear meets Vercel — dark, precise, distraction-free.

---

## Features

- **AI Q&A Generation** — generate interview questions by role, level, and topic
- **Save & Organize** — bookmark questions and build your personal prep library
- **Arabic + English** — full RTL support, Cairo font for Arabic content
- **Keyboard-first** — navigate everything without leaving the keyboard
- **Offline-ready** — saved questions persist locally

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 5 |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| Animation | GSAP 3 + ScrollTrigger |
| Fonts | Cairo (headings/Arabic) + Inter (UI) |
| State | React hooks (no external store) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/interview-pro.git
cd interview-pro

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
interview-pro/
├── public/
│   └── favicon.svg          # IC monogram mark
├── src/
│   ├── components/
│   │   ├── Shell.tsx         # Sidebar navigation (persistent)
│   │   └── PageContainer.tsx # Unified max-width + padding wrapper
│   ├── pages/
│   │   ├── HomePage.tsx      # Landing / hero
│   │   ├── GeneratePage.tsx  # AI Q&A generator
│   │   ├── SavedPage.tsx     # Saved questions
│   │   ├── SettingsPage.tsx  # User preferences
│   │   └── GitHubPage.tsx    # Repo info
│   ├── index.css             # Design system tokens + global styles
│   └── main.tsx              # App entry point
├── index.html                # Font imports (Cairo + Inter)
├── CLAUDE.md                 # AI coding context for Claude Code
└── vite.config.ts
```

---

## Design System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0a0f` | Page background |
| `--bg-surface` | `#111118` | Cards, sidebar |
| `--bg-elevated` | `#16161f` | Inputs, dropdowns |
| `--border-subtle` | `#1e1e2e` | Dividers |
| `--border-default` | `#2a2a3e` | Input borders |
| `--text-primary` | `#e8e8f0` | Headings, body |
| `--text-muted` | `#6b6b80` | Labels, hints |
| `--accent` | `#6366f1` | CTAs, active states |

### Typography

- **Cairo** — all headings (h1–h6), navigation, Arabic text
- **Inter** — body text, inputs, labels, code

### Layout

Every page uses `PageContainer`:
```
max-width: 1200px
padding: clamp(20px, 4vw, 56px) — horizontal
```

---

## Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

### Commit Convention

```
feat: new feature
fix: bug fix
style: visual/CSS changes
refactor: code restructure
docs: documentation
```

---

## Roadmap

- [ ] Export saved questions as PDF
- [ ] Topic categories (System Design, Behavioral, DSA)
- [ ] Timer mode — simulate real interview pressure
- [ ] Voice mode — answer questions out loud, get feedback
- [ ] Team sharing — share question sets with friends

---

## License

MIT — use it, fork it, build on it.

---

<div align="center">
  Built by <a href="https://github.com/YOUR_USERNAME">Mohamed Abdelhamid</a> · Cairo, Egypt
</div>