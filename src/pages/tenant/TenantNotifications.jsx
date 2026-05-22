import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { listNotifications, markNotificationRead } from '../../services/notificationService'

export function TenantNotifications() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listNotifications()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id)
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n))
      )
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">Notifications</h3>
        {loading && (
          <p className="mt-4 text-sm text-ink-500">Loading notifications...</p>
        )}
        <div className="mt-4 space-y-3 text-sm text-ink-600">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-left"
              onClick={() => handleRead(item.id)}
            >
              <p className="font-semibold text-ink-800">{item.title}</p>
              <p className="text-xs text-ink-500">{item.message}</p>
            </button>
          ))}
          {!loading && !items.length && (
            <p className="text-xs text-ink-500">No notifications yet.</p>
          )}
        </div>
      </Card>
    </div>
  )
}
