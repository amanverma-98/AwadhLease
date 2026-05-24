import { create } from 'zustand'

const starterPrompts = [
  'Show overdue rents',
  'Generate rent reminder',
  'Summarize this month',
  'Which property has highest maintenance cost?'
]

export const useChatStore = create((set) => ({
  conversations: [
    {
      id: 'conv-1',
      title: 'May portfolio summary',
      messages: []
    }
  ],
  activeId: 'conv-1',
  typing: false,
  prompts: starterPrompts,
  addMessage: (message) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === state.activeId
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      )
    })),
  setTyping: (typing) => set({ typing }),
  createConversation: (title) =>
    set((state) => {
      const newId = crypto.randomUUID()
      return {
        conversations: [
          { id: newId, title, messages: [] },
          ...state.conversations
        ],
        activeId: newId
      }
    }),
  setActive: (id) => set({ activeId: id }),
  setConversationBackendId: (backendId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === state.activeId ? { ...conv, backendId } : conv
      )
    }))
}))
