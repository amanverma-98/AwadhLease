import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { useChatStore } from '../../store/useChatStore'
import { sendChatMessage } from '../../services/chatService'

export function AssistantPage() {
  const {
    conversations,
    activeId,
    addMessage,
    prompts,
    typing,
    setTyping,
    setConversationBackendId
  } = useChatStore()
  const [message, setMessage] = useState('')

  const activeConversation = useMemo(
    () => conversations.find((conv) => conv.id === activeId),
    [conversations, activeId]
  )

  const conversationId = activeConversation?.backendId || null

  const handleSend = async () => {
    if (!message.trim()) return
    const outgoing = message
    addMessage({ role: 'user', content: outgoing })
    setMessage('')
    setTyping(true)
    try {
      const result = await sendChatMessage(outgoing, conversationId)
      if (result.conversation_id) {
        setConversationBackendId(result.conversation_id)
      }
      addMessage({ role: 'assistant', content: result.response })
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: 'AI service is offline. Showing cached insights instead.'
      })
    } finally {
      setTyping(false)
    }
  }

  return (
    <div className="grid gap-6 pb-20 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
          Suggested prompts
        </p>
        <div className="mt-4 space-y-3">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-left text-sm text-ink-700"
              onClick={() => setMessage(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="mt-8 rounded-2xl bg-ink-900 px-4 py-4 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            AI streams
          </p>
          <p className="mt-2 text-sm">
            Predictive alerts active for rent delays, vacancy risk, and vendor
            SLA.
          </p>
        </div>
      </Card>

      <Card className="flex h-[70vh] flex-col">
        <div className="border-b border-ink-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-ink-900">AwadhLease</h2>
          <p className="text-xs text-ink-500">
            Smart summaries and automation suggestions.
          </p>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          {activeConversation?.messages.map((item, index) => (
            <div
              key={`${item.role}-${index}`}
              className={`rounded-2xl px-4 py-3 text-sm ${
                item.role === 'user'
                  ? 'ml-auto bg-brand-500 text-white'
                  : 'bg-ink-100 text-ink-700'
              }`}
            >
              <ReactMarkdown>{item.content}</ReactMarkdown>
            </div>
          ))}
          {typing && (
            <div className="rounded-2xl bg-ink-100 px-4 py-3 text-sm text-ink-500">
              AI is typing...
            </div>
          )}
        </div>
        <div className="border-t border-ink-100 px-6 py-4">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Ask AwadhLease anything"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
