import { useState } from 'react'

const EXAMPLE_INCIDENTS = [
  'Fan feeling unwell near Section 118',
  'Large crowd bottleneck forming at Gate D',
  'Spilled drinks causing slippery floor near Gate F concession',
]

export default function IncidentForm({ onSubmit, isSubmitting }) {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (!text.trim() || isSubmitting) return
    onSubmit(text.trim())
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const isFormValid = text.trim().length > 0 && !isSubmitting

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <span>📋</span> Report an Incident
        </h2>
        <span className="text-[10px] font-semibold text-stadium-green bg-stadium-green-50 px-2 py-0.5 rounded-full border border-stadium-green/20">
          ✨ Live AI Triage
        </span>
      </div>

      <p className="text-xs text-text-muted mb-3">
        Describe what you observe. AI will map location to <strong>stadiumData.json</strong>, classify severity, and update commanders.
      </p>

      {/* Text area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. Crowd building up near Gate D, looks like a bottleneck..."
        disabled={isSubmitting}
        rows={3}
        className="w-full text-xs sm:text-sm text-text-primary placeholder-text-muted border border-border rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-stadium-green/30 focus:border-stadium-green transition-all resize-none bg-surface"
        aria-label="Report an incident"
      />

      {/* Submit Button with Clean Single Icon */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isFormValid}
        className={`
          mt-3 w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2
          ${isFormValid
            ? 'bg-stadium-green text-white hover:bg-stadium-green-light shadow-md cursor-pointer active:scale-[0.99]'
            : 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed opacity-70 shadow-none'
          }
        `}
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing & Categorizing...
          </>
        ) : (
          <>
            {/* ONE Clean Send Icon (Arrow Right) */}
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Submit Incident Report
          </>
        )}
      </button>

      {/* Example buttons */}
      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-[11px] font-bold text-text-muted mb-2 uppercase tracking-wider">
          Quick Example Incident Presets:
        </p>
        <div className="space-y-1.5">
          {EXAMPLE_INCIDENTS.map((example, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setText(example)}
              disabled={isSubmitting}
              className="w-full text-left text-xs px-3 py-2 rounded-lg border border-border hover:border-stadium-green/30 hover:bg-stadium-green-50 text-text-secondary hover:text-stadium-green transition-all disabled:opacity-50 flex items-center justify-between"
            >
              <span className="truncate mr-2"><span className="opacity-60 mr-1">💡</span> {example}</span>
              <span className="text-[10px] text-stadium-green font-bold flex-shrink-0">Use</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
