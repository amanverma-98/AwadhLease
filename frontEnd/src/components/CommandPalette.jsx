import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useCommandPaletteStore } from '../store/useCommandPaletteStore'
import { Input } from './ui/input'
import { Card } from './ui/card'

const commands = [
  { label: 'Search properties', path: '/' },
  { label: 'Landlord dashboard', path: '/dashboard' },
  { label: 'Tenant dashboard', path: '/tenant/dashboard' },
  { label: 'Maintenance center', path: '/maintenance' },
  { label: 'AI assistant', path: '/assistant' }
]

export function CommandPalette() {
  const navigate = useNavigate()
  const { open, setOpen } = useCommandPaletteStore()

  useEffect(() => {
    const handler = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(!open)
      }
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, setOpen])

  const visibleCommands = useMemo(() => commands, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink-950/40 p-6">
      <Card className="w-full max-w-xl overflow-hidden">
        <div className="flex items-center gap-2 border-b border-ink-100 px-5 py-4">
          <Search className="h-4 w-4 text-ink-400" />
          <Input placeholder="Search properties, tenants, or quick actions" />
        </div>
        <div className="space-y-2 p-4">
          {visibleCommands.map((command) => (
            <button
              key={command.label}
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-ink-800 transition hover:bg-ink-100"
              onClick={() => {
                setOpen(false)
                navigate(command.path)
              }}
            >
              {command.label}
              <span className="text-xs text-ink-400">Enter</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
