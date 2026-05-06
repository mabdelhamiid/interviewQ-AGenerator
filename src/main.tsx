/**
 * main.tsx
 * --------
 * Application entry point.
 * - Registers GSAP plugins
 * - Renders the React app into #root
 * Smooth scroll is handled by CSS scroll-behavior: smooth in index.css
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import App from './App.tsx'

/* ── Register GSAP plugins ───────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger)

/* ── React root ─────────────────────────────────────────────── */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
