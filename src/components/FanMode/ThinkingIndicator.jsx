export default function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in-up">
      <div className="w-8 h-8 rounded-full bg-stadium-green/10 flex items-center justify-center text-sm flex-shrink-0">
        🏟️
      </div>
      <div className="chat-bubble-ai px-5 py-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-stadium-green thinking-dot" />
          <span className="w-2 h-2 rounded-full bg-stadium-green thinking-dot" />
          <span className="w-2 h-2 rounded-full bg-stadium-green thinking-dot" />
          <span className="ml-2 text-sm text-text-muted">Thinking...</span>
        </div>
      </div>
    </div>
  )
}
