import { useState, useRef, useEffect } from 'react'
import ChatBubble from './ChatBubble.jsx'
import ThinkingIndicator from './ThinkingIndicator.jsx'
import StadiumDiagram from './StadiumDiagram.jsx'
import { generateFanResponse } from '../../services/aiService.js'

const LANGUAGES = [
  { code: 'en', label: '🇺🇸 English' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'pt', label: '🇧🇷 Português' },
  { code: 'hi', label: '🇮🇳 हिन्दी' },
]

const EXAMPLE_CHIPS = [
  { text: 'Where is Section 214?', lang: 'en' },
  { text: 'Nearest accessible restroom to Gate C?', lang: 'en' },
  { text: "Where's the closest medical station?", lang: 'en' },
  { text: '¿Dónde está la Sección 118?', lang: 'es' },
]

export default function FanMode() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [language, setLanguage] = useState('en')
  const [accessibilityMode, setAccessibilityMode] = useState(false)
  const [selectedGateId, setSelectedGateId] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleGateSelectFromDiagram = (gateId) => {
    setSelectedGateId(gateId)
    const promptText = `What is near Gate ${gateId}?`
    handleSend(promptText)
  }

  const handleSend = async (text) => {
    const question = text || input.trim()
    if (!question) return

    // 1. Detect language: use selected dropdown language as primary authority
    let targetLang = language

    // If typing Spanish / Portuguese / Hindi specific script, update dropdown matching automatically
    if (/[¿¡áéíóúñ]/i.test(question) && language === 'en') {
      targetLang = 'es'
      setLanguage('es')
    } else if (/seção|onde|banheiro/i.test(question) && language === 'en') {
      targetLang = 'pt'
      setLanguage('pt')
    } else if (/[\u0900-\u097F]/.test(question) && language === 'en') {
      targetLang = 'hi'
      setLanguage('hi')
    }

    // Add user message
    const userMsg = { role: 'user', text: question, timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsThinking(true)

    try {
      const responseObj = await generateFanResponse(question, targetLang, accessibilityMode)
      const aiMsg = {
        role: 'assistant',
        text: responseObj.text,
        respondedLanguage: responseObj.respondedLanguage,
        sources: responseObj.sources,
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      const errMsg = {
        role: 'assistant',
        text: 'Sorry, unable to connect to stadium navigation service.',
        respondedLanguage: 'English',
        sources: ['System Error'],
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setIsThinking(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-140px)] sm:h-[calc(100vh-150px)]">

      {/* ─── Left Column: Interactive Stadium Diagram (4 cols on Desktop) ─── */}
      <div className="lg:col-span-4 flex flex-col gap-3">
        <StadiumDiagram activeGateId={selectedGateId} onGateSelect={handleGateSelectFromDiagram} />

        {/* Quick Tips Box */}
        <div className="bg-white rounded-xl border border-border p-3 shadow-xs text-xs space-y-1.5 hidden sm:block">
          <div className="flex items-center gap-1.5 font-bold text-stadium-green uppercase tracking-wider text-[11px]">
            <span>💡</span> Pro Tip for Fans
          </div>
          <p className="text-text-secondary leading-relaxed">
            Toggle <strong>Accessibility Priority</strong> at the top to receive step-free routes, elevators, and accessible restrooms.
          </p>
        </div>
      </div>

      {/* ─── Right Column: Chat Interface (8 cols on Desktop) ─── */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-border p-4 shadow-sm flex flex-col h-full overflow-hidden">

        {/* ─── Top Control Bar: Accessibility + Language ─── */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-border flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer group" htmlFor="accessibility-toggle">
            <div className="relative">
              <input
                id="accessibility-toggle"
                type="checkbox"
                checked={accessibilityMode}
                onChange={(e) => setAccessibilityMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-stadium-green transition-colors duration-200" />
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-text-secondary group-hover:text-stadium-green transition-colors flex items-center gap-1">
              ♿ Accessibility priority
              {accessibilityMode && <span className="text-[10px] font-extrabold text-stadium-green bg-stadium-green-50 px-1.5 py-0.5 rounded uppercase">ON</span>}
            </span>
          </label>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-text-muted hidden sm:inline">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs sm:text-sm border border-border rounded-lg px-2.5 py-1.5 bg-surface text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-stadium-green/30 focus:border-stadium-green transition-all cursor-pointer shadow-2xs"
              aria-label="Select language"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ─── Chat Messages History ─── */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 pb-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-6">
              <div className="w-12 h-12 rounded-2xl bg-stadium-green-50 text-stadium-green text-2xl flex items-center justify-center mb-2 shadow-xs">
                🏟️
              </div>
              <h2 className="text-base sm:text-lg font-bold text-text-primary mb-1">
                Continental Arena Fan Navigator
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary max-w-sm leading-relaxed mb-4">
                Ask about section seats, gate entrances, first aid, restrooms, or tap a gate on the map!
              </p>

              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-stadium-green bg-stadium-green-50 px-3 py-1 rounded-full border border-stadium-green/20">
                <span>✨</span> Grounded in Real Stadium Data
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatBubble
              key={i}
              role={msg.role}
              text={msg.text}
              timestamp={msg.timestamp}
              respondedLanguage={msg.respondedLanguage}
              sources={msg.sources}
            />
          ))}

          {isThinking && <ThinkingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* ─── Example Question Chips ─── */}
        <div className="pt-2 pb-2 border-t border-border flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider whitespace-nowrap flex-shrink-0">
            Examples:
          </span>
          {EXAMPLE_CHIPS.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSend(chip.text)}
              disabled={isThinking}
              className="text-xs px-3 py-1.5 rounded-full border border-stadium-green/20 text-stadium-green bg-stadium-green-50 hover:bg-stadium-green hover:text-white transition-all duration-200 disabled:opacity-50 whitespace-nowrap flex-shrink-0 font-medium"
            >
              {chip.text}
            </button>
          ))}
        </div>

        {/* ─── Input Bar ─── */}
        <div className="flex items-center gap-2 bg-surface rounded-xl border border-border p-2 focus-within:ring-2 focus-within:ring-stadium-green/30 focus-within:border-stadium-green transition-all shadow-2xs">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'es' ? '¿Pregúntame sobre el estadio...'
              : language === 'pt' ? 'Pergunte sobre o estádio...'
              : language === 'hi' ? 'स्टेडियम के बारे में पूछें...'
              : 'Ask me about the stadium...'
            }
            disabled={isThinking}
            className="flex-1 text-xs sm:text-sm text-text-primary placeholder-text-muted outline-none bg-transparent px-2 disabled:opacity-50"
            aria-label="Type your question"
          />
          <button
            onClick={() => handleSend()}
            disabled={isThinking || !input.trim()}
            className={`
              w-9 h-9 rounded-lg flex items-center justify-center transition-all flex-shrink-0 font-bold
              ${input.trim() && !isThinking
                ? 'bg-stadium-green text-white hover:bg-stadium-green-light shadow-sm cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
            aria-label="Send message"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  )
}
