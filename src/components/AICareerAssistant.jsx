import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import apiClient from '../services/apiClient';

export default function AICareerAssistant({ studentProfile }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hello ${studentProfile.name || 'there'}! I'm your AI Career Assistant. How can I help you today? Ask me about companies, interview prep, or your readiness score.` }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await apiClient.post('/api/ai/chat', {
        messages: newMessages,
        studentId: studentProfile.uid || 'unknown'
      });
      
      setMessages([...newMessages, { role: 'assistant', content: response.reply }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="section-container animate-fade-in">
      <div className="banner-card glass-card flex-between" style={{ marginBottom: '1.5rem' }}>
        <div className="flex-items" style={{ gap: '0.5rem' }}>
          <MessageSquare size={28} className="icon-indigo" />
          <h2 className="section-title">AI Career Assistant</h2>
        </div>
      </div>

      <div className="chat-container glass-card" style={{ display: 'flex', flexDirection: 'column', height: '600px', padding: 0, overflow: 'hidden' }}>
        <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message flex-items ${msg.role === 'user' ? 'user-message' : 'bot-message'}`} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%', alignItems: 'flex-start', gap: '0.8rem' }}>
              {msg.role === 'assistant' && (
                <div className="avatar bot-avatar" style={{ background: 'var(--primary-color)', color: 'white', padding: '0.4rem', borderRadius: '50%' }}>
                  <Bot size={20} />
                </div>
              )}
              <div className="message-bubble" style={{
                background: msg.role === 'user' ? 'var(--primary-color)' : 'var(--glass-bg)',
                color: msg.role === 'user' ? 'white' : 'var(--text-color)',
                padding: '1rem',
                borderRadius: '12px',
                border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="avatar user-avatar" style={{ background: 'var(--surface-color)', color: 'var(--text-muted)', padding: '0.4rem', borderRadius: '50%', border: '1px solid var(--border-color)' }}>
                  <User size={20} />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="chat-message bot-message flex-items" style={{ alignSelf: 'flex-start', gap: '0.8rem' }}>
              <div className="avatar bot-avatar" style={{ background: 'var(--primary-color)', color: 'white', padding: '0.4rem', borderRadius: '50%' }}>
                <Bot size={20} />
              </div>
              <div className="message-bubble flex-items" style={{ background: 'var(--glass-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <Loader2 size={16} className="animate-spin" style={{ marginRight: '0.5rem' }} /> AI is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSend} className="chat-input-area" style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
          <div className="flex-items" style={{ gap: '0.5rem' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
              disabled={isTyping}
            />
            <button type="submit" className="btn btn-primary btn-icon" disabled={!input.trim() || isTyping} style={{ padding: '1rem' }}>
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
