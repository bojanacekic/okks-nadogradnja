import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { ordersApi } from '../services/api'

export default function OrderChat({ order, readOnly = false }) {
  const [open, setOpen] = useState(false)
  const [conversation, setConversation] = useState(null)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const pendingId = useRef(null)
  const requestSequence = useRef(0)
  const sendingRef = useRef(false)
  const messageList = useRef(null)

  useEffect(() => {
    if (!open) return
    let active = true
    const load = async () => {
      if (sendingRef.current) return
      const sequence = ++requestSequence.current
      try {
        const { data } = await ordersApi.getMessages(order.id)
        if (active && sequence === requestSequence.current) { setConversation(data); setError('') }
      } catch {
        if (active && sequence === requestSequence.current) setError('Unable to refresh messages. Retrying shortly.')
      }
    }
    load()
    const interval = setInterval(load, 3000)
    return () => { active = false; clearInterval(interval) }
  }, [open, order.id, order.status, order.courierId])

  useEffect(() => {
    if (messageList.current) messageList.current.scrollTop = messageList.current.scrollHeight
  }, [conversation?.messages.length, open])

  const send = async (event) => {
    event.preventDefault()
    if (!text.trim() || sendingRef.current) return
    sendingRef.current = true
    ++requestSequence.current
    setSending(true)
    setError('')
    pendingId.current ??= crypto.randomUUID()
    try {
      const { data } = await ordersApi.sendMessage(order.id, { text: text.trim(), clientMessageId: pendingId.current })
      setConversation(data)
      setText('')
      pendingId.current = null
    } catch (err) {
      setError(err.response?.data?.message || 'Message could not be sent. Please try again.')
    } finally {
      sendingRef.current = false
      setSending(false)
    }
  }

  return (
    <section className="border-t border-gray-100 py-4">
      <button type="button" onClick={() => setOpen(current => !current)} aria-expanded={open} className="text-sm font-semibold text-orange-600 hover:text-orange-700">
        {open ? 'Hide conversation' : 'Courier messages'}
      </button>
      {open && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-3">Simulated courier replies based on your message</p>
          {error && <p role="alert" className="text-sm text-red-600 mb-3">{error}</p>}
          {!conversation ? <p className="text-sm text-gray-500" role="status">Loading conversation...</p> : (
            <>
              <div ref={messageList} role="log" aria-label="Order conversation" className="max-h-72 overflow-y-auto space-y-3 bg-gray-50 rounded-xl p-3">
                {conversation.messages.length === 0 && <p className="text-sm text-gray-500">No messages yet.</p>}
                {conversation.messages.map(message => (
                  <div key={message.id} className={`rounded-xl p-3 text-sm max-w-[90%] ${message.sender === 'user' ? 'ml-auto bg-orange-100 text-gray-900' : 'bg-white border border-gray-200 text-gray-700'}`}>
                    <p className="text-xs font-semibold mb-1">{message.senderName}</p>
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    <time dateTime={message.createdAt} className="block text-xs text-gray-500 mt-1">{new Date(message.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</time>
                  </div>
                ))}
                {conversation.isReplyPending && <p role="status" className="text-xs text-gray-500">Courier is typing...</p>}
              </div>
              {!readOnly && (conversation.canSend ? (
                <form onSubmit={send} className="mt-3 space-y-2">
                  <label htmlFor={`message-${order.id}`} className="text-sm font-medium text-gray-700">Message to {conversation.courierName}</label>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                    <textarea id={`message-${order.id}`} value={text} maxLength={1000} rows={2} disabled={sending} required
                      onChange={event => { setText(event.target.value); pendingId.current = null }} className="input resize-none sm:flex-1 min-w-0" placeholder="Delivery instructions or a question..." />
                    <button type="submit" disabled={sending || !text.trim()} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 text-sm">
                      <Send size={16} aria-hidden="true" />
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              ) : <p className="text-sm text-gray-500 mt-3">Messaging is available while your order is out for delivery with an assigned courier.</p>)}
            </>
          )}
        </div>
      )}
    </section>
  )
}
