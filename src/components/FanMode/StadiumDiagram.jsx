import { useState } from 'react'
import stadiumData from '../../data/stadiumData.json'

export default function StadiumDiagram({ activeGateId, onGateSelect }) {
  const [hoveredGate, setHoveredGate] = useState(null)

  // Gate positioning on radial layout (percentage relative to container)
  const GATE_POSITIONS = {
    A: { x: '35%', y: '8%', label: 'A', dir: 'North', accessible: true },
    B: { x: '65%', y: '8%', label: 'B', dir: 'North', accessible: false },
    C: { x: '92%', y: '35%', label: 'C', dir: 'East', accessible: true },
    D: { x: '92%', y: '65%', label: 'D', dir: 'East', accessible: false },
    E: { x: '65%', y: '92%', label: 'E', dir: 'South', accessible: true },
    F: { x: '35%', y: '92%', label: 'F', dir: 'South', accessible: false },
    G: { x: '8%', y: '65%', label: 'G', dir: 'West', accessible: true },
    H: { x: '8%', y: '35%', label: 'H', dir: 'West', accessible: false },
  }

  const currentHoverGateData = hoveredGate
    ? stadiumData.gates.find(g => g.id === hoveredGate)
    : null

  return (
    <div className="bg-white rounded-2xl border border-border p-4 shadow-sm relative overflow-hidden flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏟️</span>
          <h3 className="text-xs sm:text-sm font-bold text-text-primary uppercase tracking-wider">
            Stadium Map (Gates A–H)
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-text-muted">
          <span className="inline-flex items-center gap-1 font-medium text-stadium-green">
            <span className="w-2 h-2 rounded-full bg-stadium-green" /> ♿ Accessible Gate
          </span>
        </div>
      </div>

      {/* ─── SVG / CSS Stadium Oval ─── */}
      <div className="relative w-full max-w-[320px] aspect-[4/3] bg-stadium-green-50 rounded-3xl p-3 border-2 border-stadium-green/20 shadow-inner flex items-center justify-center">

        {/* Outer Oval Ring */}
        <div className="absolute inset-6 rounded-[50%] border-4 border-dashed border-stadium-green/30 pointer-events-none" />

        {/* Pitch (Green Field) */}
        <div className="relative w-[60%] h-[55%] bg-stadium-green rounded-xl border-2 border-white/40 shadow-md flex items-center justify-center overflow-hidden">
          {/* Pitch Markings */}
          <div className="absolute inset-0 border border-white/30 rounded-lg m-1" />
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/30 -translate-x-1/2" />
          <div className="w-10 h-10 rounded-full border border-white/30" />
          <div className="absolute text-[10px] font-extrabold tracking-widest text-white/40 uppercase">
            PITCH
          </div>
        </div>

        {/* Directional Labels */}
        <span className="absolute top-1 text-[9px] font-bold text-stadium-green/70 tracking-widest">NORTH</span>
        <span className="absolute bottom-1 text-[9px] font-bold text-stadium-green/70 tracking-widest">SOUTH</span>
        <span className="absolute left-1 text-[9px] font-bold text-stadium-green/70 tracking-widest [writing-mode:vertical-lr]">WEST</span>
        <span className="absolute right-1 text-[9px] font-bold text-stadium-green/70 tracking-widest [writing-mode:vertical-lr]">EAST</span>

        {/* Gate Nodes */}
        {Object.entries(GATE_POSITIONS).map(([id, pos]) => {
          const isActive = activeGateId === id
          const isHovered = hoveredGate === id
          const gateData = stadiumData.gates.find(g => g.id === id)

          return (
            <button
              key={id}
              onClick={() => onGateSelect && onGateSelect(id)}
              onMouseEnter={() => setHoveredGate(id)}
              onMouseLeave={() => setHoveredGate(null)}
              style={{ left: pos.x, top: pos.y }}
              className={`
                absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full
                flex items-center justify-center text-xs font-bold transition-all duration-200 shadow-md
                ${pos.accessible ? 'ring-2 ring-stadium-green' : 'ring-1 ring-border'}
                ${isActive || isHovered
                  ? 'bg-gold text-white scale-125 z-20 shadow-lg'
                  : pos.accessible
                    ? 'bg-stadium-green text-white hover:bg-stadium-green-light'
                    : 'bg-white text-text-primary hover:bg-gray-100'
                }
              `}
              title={`${gateData?.name} (${pos.accessible ? '♿ Accessible' : 'Standard Entrance'})`}
              aria-label={`Gate ${id}`}
            >
              {id}
              {pos.accessible && (
                <span className="absolute -top-1 -right-1 text-[8px] leading-none">♿</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Gate Hover / Active info drawer */}
      <div className="w-full mt-3 min-h-[36px] bg-surface rounded-xl p-2 px-3 border border-border text-center text-xs">
        {currentHoverGateData ? (
          <div className="animate-fade-in-up flex items-center justify-between">
            <span className="font-bold text-stadium-green">
              {currentHoverGateData.name}
            </span>
            <span className="text-[11px] text-text-muted">
              {currentHoverGateData.accessible ? '♿ Step-Free Access' : 'Standard Stairs'} • Sections {currentHoverGateData.opensTo.join(', ')}
            </span>
          </div>
        ) : (
          <span className="text-text-muted text-[11px]">
            Hover or tap any gate (A–H) to see access info and section mappings.
          </span>
        )}
      </div>
    </div>
  )
}
