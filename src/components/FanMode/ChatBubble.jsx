/** Renders markdown-lite text: bold (**text**), bullet points, and line breaks */
function formatText(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Process bold markers
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    // Detect bullet points
    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
      return (
        <div key={i} className="flex gap-2 ml-1 my-0.5">
          <span className="text-stadium-green font-bold flex-shrink-0">•</span>
          <span>{rendered}</span>
        </div>
      );
    }

    // Detect numbered steps
    const numberMatch = line.trim().match(/^(\d+)\.\s/);
    if (numberMatch) {
      return (
        <div key={i} className="flex gap-2.5 ml-1 my-1">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-stadium-green/10 text-stadium-green text-xs font-bold flex items-center justify-center mt-0.5">
            {numberMatch[1]}
          </span>
          <span>{rendered}</span>
        </div>
      );
    }

    if (line.trim() === '') return <div key={i} className="h-1.5" />;

    return <p key={i}>{rendered}</p>;
  });
}

export default function ChatBubble({ role, text, timestamp, respondedLanguage, sources }) {
  const isUser = role === 'user';

  return (
    <div className={`flex items-start gap-2.5 animate-fade-in-up ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 shadow-sm
        ${isUser
          ? 'bg-gold/20 text-gold-dark ring-2 ring-gold/30'
          : 'bg-stadium-green/10 text-stadium-green ring-2 ring-stadium-green/20'
        }
      `}>
        {isUser ? '👤' : '🏟️'}
      </div>

      {/* Bubble Container */}
      <div className={`
        max-w-[88%] sm:max-w-[78%] px-4 py-3.5 shadow-sm rounded-2xl
        ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}
      `}>

        {/* AI Header Badge */}
        {!isUser && (
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-border/40 text-[11px]">
            <span className="inline-flex items-center gap-1 font-semibold text-stadium-green">
              <span>✨</span> Powered by AI
            </span>
            {respondedLanguage && (
              <span className="inline-flex items-center gap-1 font-medium text-text-muted bg-surface px-2 py-0.5 rounded-md border border-border">
                🌐 Responded in: <strong className="text-text-primary">{respondedLanguage}</strong>
              </span>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className={`text-sm leading-relaxed space-y-1 ${isUser ? 'text-white font-medium' : 'text-text-primary'}`}>
          {isUser ? text : formatText(text)}
        </div>

        {/* AI Sources Tag (Data Grounding Proof) */}
        {!isUser && sources && sources.length > 0 && (
          <div className="mt-3 pt-2 border-t border-border/40 flex items-center gap-1.5 flex-wrap text-[11px]">
            <span className="font-semibold text-text-muted">📍 Source:</span>
            {sources.map((src, idx) => (
              <span
                key={idx}
                className="bg-stadium-green-50 text-stadium-green font-medium px-2 py-0.5 rounded-full border border-stadium-green/20"
              >
                {src}
              </span>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-[10px] mt-2 ${isUser ? 'text-white/60 text-right' : 'text-text-muted text-right'}`}>
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
