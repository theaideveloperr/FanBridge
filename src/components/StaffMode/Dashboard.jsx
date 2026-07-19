import IncidentCard from './IncidentCard.jsx'

export default function Dashboard({ incidents, situationSummary, isSummaryLoading, onResolve }) {
  // Sort: high priority first, then medium, then low
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sorted = [...incidents].sort((a, b) =>
    (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
  )

  const highCount = incidents.filter(i => i.priority === 'high').length
  const medCount = incidents.filter(i => i.priority === 'medium').length
  const lowCount = incidents.filter(i => i.priority === 'low').length

  // Border color for Situation Summary banner matching highest severity
  const bannerBorderColor = highCount > 0
    ? 'border-l-medical border-l-4'
    : medCount > 0
      ? 'border-l-crowd border-l-4'
      : 'border-l-stadium-green border-l-4'

  return (
    <div className="space-y-4">
      {/* ─── Situation Summary Banner (Prominent AI Commander Widget) ─── */}
      <div className={`bg-white rounded-2xl border border-border shadow-sm overflow-hidden ${bannerBorderColor}`}>
        <div className="bg-stadium-green-50/70 px-4 py-2.5 border-b border-border flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-stadium-green animate-pulse" />
            <h3 className="text-xs font-extrabold text-stadium-green uppercase tracking-wider flex items-center gap-1.5">
              <span>✨</span> AI Situation Commander Summary
            </h3>
          </div>
          <span className="text-[10px] font-bold text-text-muted bg-white px-2 py-0.5 rounded border border-border">
            Auto-Updates Live
          </span>
        </div>

        <div className="p-4 sm:p-5">
          {isSummaryLoading ? (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-text-muted">
              <span className="w-4 h-4 border-2 border-stadium-green/30 border-t-stadium-green rounded-full animate-spin" />
              Re-evaluating stadium situation...
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-text-primary leading-relaxed font-semibold">
              {situationSummary}
            </p>
          )}
        </div>
      </div>

      {/* ─── Real Dashboard Stat Counter Widgets ─── */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* High Severity */}
        <div className="bg-red-50/80 border border-red-200 rounded-xl p-3 text-center shadow-2xs">
          <div className="text-xl sm:text-2xl font-black text-red-700 leading-none mb-1">
            {highCount}
          </div>
          <div className="text-[10px] sm:text-xs font-extrabold text-red-800 uppercase tracking-wider flex items-center justify-center gap-1">
            <span>🚨</span> High Priority
          </div>
        </div>

        {/* Medium Severity */}
        <div className="bg-orange-50/80 border border-orange-200 rounded-xl p-3 text-center shadow-2xs">
          <div className="text-xl sm:text-2xl font-black text-orange-700 leading-none mb-1">
            {medCount}
          </div>
          <div className="text-[10px] sm:text-xs font-extrabold text-orange-800 uppercase tracking-wider flex items-center justify-center gap-1">
            <span>⚠️</span> Medium Priority
          </div>
        </div>

        {/* Low Severity / Routine */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-center shadow-2xs">
          <div className="text-xl sm:text-2xl font-black text-emerald-700 leading-none mb-1">
            {lowCount}
          </div>
          <div className="text-[10px] sm:text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center justify-center gap-1">
            <span>ℹ️</span> Low / Facilities
          </div>
        </div>
      </div>

      {/* ─── Incident Cards Header + List ─── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
            Active Incident Stream ({sorted.length})
          </h3>
          <span className="text-[11px] text-text-muted">Sorted by Severity</span>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-border text-text-muted p-4">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-sm font-bold text-text-primary">All Clear Across Stadium</p>
            <p className="text-xs text-text-muted mt-0.5">No active incidents logged in control room.</p>
          </div>
        ) : (
          sorted.map(incident => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onResolve={onResolve}
            />
          ))
        )}
      </div>
    </div>
  )
}
