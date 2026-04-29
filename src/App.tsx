import type { FC } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Header from './components/layout/Header'
import HomePage from './pages/HomePage'
import GeneratePage from './pages/GeneratePage'
import SavedPage from './pages/SavedPage'
import SettingsPage from './pages/SettingsPage'
import GitHubPage from './pages/GitHubPage'

const App: FC = () => (
  <AppProvider>
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] relative overflow-x-hidden">

        {/* Subtle grid texture */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-text) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-text) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Violet radial glow — top right */}
        <div
          className="fixed top-[-200px] right-[-150px] w-[600px] h-[600px] rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 65%)' }}
        />

        {/* Cyan radial glow — bottom left */}
        <div
          className="fixed bottom-[-300px] left-[-200px] w-[700px] h-[700px] rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 65%)' }}
        />

        <div className="relative z-10">
          <Header />
          <Routes>
            <Route path="/"         element={<HomePage />}     />
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/saved"    element={<SavedPage />}    />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/github"   element={<GitHubPage />}   />
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  </AppProvider>
)

export default App
