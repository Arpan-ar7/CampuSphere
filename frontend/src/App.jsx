// All pages and their web addresses, in one place.
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { StreakProvider } from './context/StreakContext.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import FeedPage from './pages/FeedPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MessagesPage from './pages/MessagesPage.jsx'
import NotesPage from './pages/NotesPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import TeamsPage from './pages/TeamsPage.jsx'

export default function App() {
  const { user } = useAuth()

  // Not logged in → only the login page
  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    )
  }

  return (
    <StreakProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<FeedPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:conversationId" element={<MessagesPage />} />
          <Route path="/u/:handle" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </StreakProvider>
  )
}
