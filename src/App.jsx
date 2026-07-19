import { useState } from 'react'
import RoleGate from './components/shared/RoleGate.jsx'
import FanMode from './components/FanMode/FanMode.jsx'
import StaffMode from './components/StaffMode/StaffMode.jsx'
import stadiumData from './data/stadiumData.json'

export default function App() {
  // null = show role gate, { role: 'fan', displayName } or { role: 'staff' }
  const [session, setSession] = useState(null)

  const handleLogout = () => {
    setSession(null)
  }

  // ─── Role Gate (login screen) ───
  if (!session) {
    return <RoleGate onSelectRole={setSession} />
  }

  // ─── Dashboard (Fan or Staff) ───
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ─── Header ─── */}
      <header className="bg-stadium-green text-white shadow-lg relative overflow-hidden">
        {/* Decorative field pattern */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 48%, rgba(255,255,255,0.15) 48%, rgba(255,255,255,0.15) 52%, transparent 52%)`,
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                🏟️
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  FanBridge
                </h1>
                <p className="text-white/70 text-xs sm:text-sm font-medium">
                  {session.role === 'fan'
                    ? `${stadiumData.stadiumName} — Welcome, ${session.displayName}`
                    : `${stadiumData.stadiumName} — Staff Dashboard`
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Role badge */}
              <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                session.role === 'fan'
                  ? 'bg-white/15 text-white'
                  : 'bg-gold/20 text-gold-light'
              }`}>
                {session.role === 'fan' ? '🎉 Fan' : '📋 Staff'}
              </span>

              {/* Log out */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
                aria-label="Log out"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Content ─── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-4 sm:py-6">
        {session.role === 'fan' ? <FanMode /> : <StaffMode />}
      </main>
    </div>
  )
}
