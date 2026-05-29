import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { listNotifications, markNotificationRead } from '../../services/notificationService'
import { useNotificationStore } from '../../store/useNotificationStore'

export function TenantNotifications() {
  const { pushToast } = useNotificationStore()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingIds, setMarkingIds] = useState([])

  useEffect(() => {
    listNotifications()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const handleRead = async (id) => {
    if (markingIds.includes(id)) return
    setMarkingIds((prev) => [...prev, id])
    try {
      await markNotificationRead(id)
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n))
      )
      pushToast({ title: 'Marked as read', message: 'Notification updated.' })
    } catch (error) {
      pushToast({ title: 'Update failed', message: error.message })
    } finally {
      setMarkingIds((prev) => prev.filter((item) => item !== id))
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
              disabled={markingIds.includes(item.id)}
            >
              <p className="font-semibold text-ink-800">{item.title}</p>
              <p className="text-xs text-ink-500">{item.message}</p>
              <p className="mt-2 text-[11px] text-ink-400">
                {markingIds.includes(item.id)
                  ? 'Marking...'
                  : item.status === 'read'
                    ? 'Read'
                    : 'Tap to mark as read'}
              </p>
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
