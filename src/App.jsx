import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AuthModal from './components/auth/AuthModal'
import AppShell from './components/layout/AppShell'
import DashboardPage from './pages/DashboardPage'
import PracticePage from './pages/PracticePage'
import ReaderPage from './pages/ReaderPage'
import HistoryPage from './pages/HistoryPage'
import VocabNotebookPage from './pages/VocabNotebookPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="reader" element={<ReaderPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="vocab" element={<VocabNotebookPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        <AuthModal />
      </BrowserRouter>
    </AuthProvider>
  )
}
