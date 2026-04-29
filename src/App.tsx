import type { FC } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Shell from './components/layout/Shell'
import HomePage from './pages/HomePage'
import GeneratePage from './pages/GeneratePage'
import SavedPage from './pages/SavedPage'
import SettingsPage from './pages/SettingsPage'
import GitHubPage from './pages/GitHubPage'

const App: FC = () => (
  <AppProvider>
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/"         element={<HomePage />}     />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/saved"    element={<SavedPage />}    />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/github"   element={<GitHubPage />}   />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  </AppProvider>
)

export default App
