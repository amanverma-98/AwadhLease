import { useMemo, useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { useChatStore } from '../../store/useChatStore'
import { sendChatMessage } from '../../services/chatService'
import { PageHeader } from '../../components/PageHeader'
import { Bot, User, Send, Sparkles, Terminal, Activity, ArrowRight } from 'lucide-react'
import { cn } from '../../utils/cn'

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
  const chatBottomRef = useRef(null)

  const activeConversation = useMemo(
    () => conversations.find((conv) => conv.id === activeId),
    [conversations, activeId]
  )

  const conversationId = activeConversation?.backendId || null

  // Auto scroll to bottom
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeConversation?.messages, typing])

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
        content: 'AI Service is currently resolving pending ledger operations. Live audit insights and tenant screening remain active in your workspace.'
      })
    } finally {
      setTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <PageHeader 
        title="AI Assistant Workspace" 
        subtitle="Prompt the AI broker agents to audit invoices, write automated notifications, or analyze background risks."
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        {/* Left Suggestions Pane */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-4">
              <Sparkles className="h-4 w-4" />
              Suggested Prompt Templates
            </div>
            
            <div className="space-y-2.5">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  className="w-full text-left text-xs font-semibold text-ink-700 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-400 bg-ink-50/50 dark:bg-ink-900/40 hover:bg-brand-500/5 p-3 rounded-2xl border border-ink-100 dark:border-ink-800 transition duration-150 flex items-center justify-between gap-3 group"
                  onClick={() => setMessage(prompt)}
                >
                  <span className="line-clamp-2 leading-relaxed">{prompt}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
              ))}
            </div>
          </Card>

          {/* AI Streams Info */}
          <Card className="p-6 bg-gradient-to-br from-ink-950 to-brand-950 text-white relative overflow-hidden shadow-soft">
            <div className="absolute inset-0 bg-noise-bg opacity-10 pointer-events-none" />
            <div className="flex items-center gap-2 text-xs font-bold text-brand-300 uppercase tracking-widest mb-3">
              <Terminal className="h-4 w-4" />
              Agent Core Live Streams
            </div>
            <p className="text-xs text-brand-100 leading-relaxed font-medium">
              We proactively audit rental schedules, evaluate repair costs, and predict tenant exit risks to ensure high-velocity cashflow.
            </p>
          </Card>
        </div>

        {/* Right Chat Pane */}
        <Card className="flex h-[60vh] flex-col overflow-hidden border border-ink-100 dark:border-ink-800">
          {/* Header */}
          <div className="border-b border-ink-100 dark:border-ink-800/80 px-6 py-4 bg-white/50 dark:bg-ink-950 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold font-sora text-ink-950 dark:text-ink-50 flex items-center gap-2">
                <Bot className="h-4.5 w-4.5 text-brand-500" />
                AwadhLease Copilot
              </h2>
              <p className="text-[10px] text-ink-400 mt-0.5 font-bold uppercase tracking-wider">
                Verifying May Ledger Records
              </p>
            </div>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          {/* Chat message thread */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-ink-50/10 dark:bg-ink-950/20">
            {activeConversation?.messages.map((item, index) => {
              const isUser = item.role === 'user'
              return (
                <div
                  key={`${item.role}-${index}`}
                  className={cn(
                    "flex gap-3 max-w-[80%]",
                    isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  {/* Avatar circle */}
                  <div className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center shadow-soft flex-shrink-0 text-sm",
                    isUser 
                      ? "bg-brand-500 text-white font-bold" 
                      : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                  )}>
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  {/* Message bubble */}
                  <div className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    isUser
                      ? "bg-brand-500 text-white font-semibold"
                      : "bg-white dark:bg-ink-900 text-ink-800 dark:text-ink-100 border border-ink-100 dark:border-ink-800 shadow-soft"
                  )}>
                    <ReactMarkdown className="markdown-body text-xs font-medium space-y-1.5">{item.content}</ReactMarkdown>
                  </div>
                </div>
              )
            })}
            
            {/* CSS Typing indicator */}
            {typing && (
              <div className="flex gap-3 max-w-[80%] mr-auto items-end animate-pulse">
                <div className="h-8 w-8 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-soft flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-white dark:bg-ink-900 px-4.5 py-3 text-sm border border-ink-100 dark:border-ink-800 shadow-soft flex items-center gap-1.5 min-h-[38px]">
                  <div className="w-1.5 h-1.5 bg-ink-400 dark:bg-ink-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-ink-400 dark:bg-ink-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-ink-400 dark:bg-ink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={chatBottomRef} />
          </div>

          {/* Message input */}
          <div className="border-t border-ink-100 dark:border-ink-800/80 px-6 py-4 bg-white/50 dark:bg-ink-950/40">
            <div className="flex gap-3">
              <Input
                placeholder="Audit Shalimar Emerald accounts or draft a lease rules reminder..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 shadow-inner"
              />
              <Button onClick={handleSend} className="shadow-glow px-5 flex items-center gap-2">
                <Send className="h-4 w-4" />
                <span>Send</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
