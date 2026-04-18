// src/App.tsx
// ══════════════════════════════════════════
// نقطة التجميع - Router + Layout
// ══════════════════════════════════════════

import type { CSSProperties, FC } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Header from './components/layout/Header'
import HomePage from './pages/HomePage'
import GeneratePage from './pages/GeneratePage'
import SavedPage from './pages/SavedPage'
import SettingsPage from './pages/SettingsPage'

const App: FC = () => {
  return (
    // AppProvider يغلف كل حاجة علشان الـ context يوصل لكل صفحة
    <AppProvider>
      {/* BrowserRouter يفعّل الـ routing */}
      <BrowserRouter>
        <div style={styles.root}>

          {/* خلفية */}
          <div style={styles.orb1} />
          <div style={styles.orb2} />

          {/* Header ثابت في كل الصفحات */}
          <Header />

          {/* الصفحات - بتتبدل حسب الـ URL */}
          <Routes>
            <Route path="/"         element={<HomePage />}     />
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/saved"    element={<SavedPage />}    />
            <Route path="/settings" element={<SettingsPage />} />
            {/* لو حد كتب URL غلط، يروح الرئيسية */}
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

const styles: Record<string, CSSProperties> = {
  root: {
    fontFamily: "'Segoe UI', 'Cairo', Arial, sans-serif",
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #020B18 0%, #030D20 40%, #050F24 100%)',
    color: '#CBD5E1',
    direction: 'rtl',
    position: 'relative',
    overflowX: 'hidden',
  },
  orb1: {
    position: 'fixed', top: -200, right: -200,
    width: 600, height: 600, borderRadius: '50%',
    background: 'radial-gradient(circle, #1D4ED822 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
  orb2: {
    position: 'fixed', bottom: -300, left: -200,
    width: 700, height: 700, borderRadius: '50%',
    background: 'radial-gradient(circle, #0F4C8122 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
}

export default App
