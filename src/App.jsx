import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import { CommandPalette } from './components/CommandPalette'
import { ToastHost } from './components/ToastHost'
import { ScrollToTop } from './components/ScrollToTop'
import { useThemeStore } from './store/useThemeStore'
import { useUserStore } from './store/useUserStore'

function App() {
  const { theme } = useThemeStore()
  const hydrate = useUserStore((state) => state.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

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
