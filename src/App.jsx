import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import { CommandPalette } from './components/CommandPalette'
import { ToastHost } from './components/ToastHost'
import { ScrollToTop } from './components/ScrollToTop'
import { useThemeStore } from './store/useThemeStore'

function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
      <CommandPalette />
      <ToastHost />
    </BrowserRouter>
  )
}

export default App
