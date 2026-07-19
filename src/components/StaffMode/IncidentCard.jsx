import { useState } from 'react'

const CATEGORY_CONFIG = {
  medical: {
    icon: '🚑',
    label: 'Medical',
    color: 'text-medical',
    bg: 'bg-medical-bg',
    border: 'border-medical/30',
  },
  crowd: {
    icon: '👥',
    label: 'Crowd',
    color: 'text-crowd',
    bg: 'bg-crowd-bg',
    border: 'border-crowd/30',
  },
  security: {
    icon: '🛡️',
    label: 'Security',
    color: 'text-security',
    bg: 'bg-security-bg',
    border: 'border-security/30',
  },
  facilities: {
    icon: '🔧',
    label: 'Facilities',
    color: 'text-facilities',
    bg: 'bg-facilities-bg',
    border: 'border-facilities/30',
  },
}

const PRIORITY_CONFIG = {
  high: { label: 'HIGH SEVERITY', bg: 'bg-red-100 text-red-800 border-red-300' },
  medium: { label: 'MEDIUM', bg: 'bg-orange-100 text-orange-800 border-orange-300' },
  low: { label: 'LOW', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
}

export default function IncidentCard({ incident, onResolve }) {
  const [expanded, setExpanded] = useState(false)

  const cat = CATEGORY_CONFIG[incident.category] || CATEGORY_CONFIG.facilities
  const pri = PRIORITY_CONFIG[incident.priority] || PRIORITY_CONFIG.low
  const matchedLocation = incident.matchedLocation || incident.location || 'Unconfirmed location'
  const isMatched = matchedLocation !== 'Unconfirmed location'

  return (
    <div
      className={`
        rounded-xl border ${cat.border} ${cat.bg} p-3.5 sm:p-4 animate-slide-in-right
        transition-all duration-200 hover:shadow-md cursor-pointer relative overflow-hidden
        ${incident.priority === 'high' ? 'ring-2 ring-red-400/40 animate-pulse-glow' : ''}
      `}
      onClick={() => setExpanded(!expanded)}
      role="button"
      aria-expanded={expanded}
    >
      {/* Top Row: Category + Priority + AI Badge + Resolve */}
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-base">{cat.icon}</span>
          <span className={`text-xs font-bold ${cat.color} uppercase tracking-wider`}>
            {cat.label}
          </span>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${pri.bg}`}>
            {pri.label}
          </span>
          <span className="text-[10px] text-text-muted bg-white/80 px-1.5 py-0.5 rounded border border-border">
            ✨ AI Triaged
          </span>
        </div>

        {/* Resolve Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onResolve(incident.id)
          }}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-border text-text-secondary hover:text-stadium-green hover:border-stadium-green/40 hover:bg-stadium-green-50 transition-all shadow-2xs flex items-center gap-1"
          aria-label={`Resolve incident ${incident.id}`}
        >
          <svg className="w-3.5 h-3.5 text-stadium-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Resolve
        </button>
      </div>

      {/* Summary */}
      <p className="text-xs sm:text-sm font-semibold text-text-primary leading-snug mb-2">
        {incident.summary}
      </p>

      {/* Shared Data Model Proof Tag (Matched Location) */}
      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-black/5 flex-wrap gap-1">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-text-muted">Matched to:</span>
          <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] border ${
            isMatched
              ? 'bg-stadium-green-50 text-stadium-green border-stadium-green/20'
              : 'bg-gray-100 text-gray-600 border-gray-300'
          }`}>
            {isMatched ? `📍 ${matchedLocation}` : '⚠️ Unconfirmed location'}
          </span>
        </div>

        <span className="text-[10px] text-text-muted">
          {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Expanded: original report text */}
      {expanded && (
        <div className="mt-2.5 pt-2 border-t border-black/10 animate-fade-in-up text-xs bg-white/60 p-2 rounded-lg">
          <p className="font-bold text-text-muted text-[10px] uppercase tracking-wider mb-0.5">
            Original Staff Note:
          </p>
          <p className="text-text-secondary italic">
            "{incident.originalText}"
          </p>
        </div>
      )}
    </div>
  )
}
