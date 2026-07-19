import { useState } from 'react'
import stadiumData from '../../data/stadiumData.json'

export default function RoleGate({ onSelectRole }) {
  const [selectedRole, setSelectedRole] = useState(null) // null | 'fan' | 'staff'
  const [fanName, setFanName] = useState('')
  const [staffCode, setStaffCode] = useState('')
  const [staffError, setStaffError] = useState('')

  const handleFanSubmit = () => {
    if (!fanName.trim()) return
    onSelectRole({ role: 'fan', displayName: fanName.trim() })
  }

  const handleStaffSubmit = () => {
    if (staffCode === 'FANBRIDGE2026') {
      setStaffError('')
      onSelectRole({ role: 'staff' })
    } else {
      setStaffError('Invalid access code')
    }
  }

  const handleKeyDown = (e, handler) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handler()
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ─── Header ─── */}
      <header className="bg-stadium-green text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-white rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 48%, rgba(255,255,255,0.15) 48%, rgba(255,255,255,0.15) 52%, transparent 52%)`,
            }}
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 py-8 sm:py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-sm text-3xl sm:text-4xl shadow-lg mb-3">
            🏟️
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            FanBridge
          </h1>
          <p className="text-white/70 text-xs sm:text-sm font-medium">
            FIFA World Cup 2026 — {stadiumData.stadiumName}
          </p>
        </div>
      </header>

      {/* ─── Role Selection ─── */}
      <main className="flex-1 flex items-start justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-2xl">
          {/* ─── Initial: Choose Role ─── */}
          {selectedRole === null && (
            <div className="animate-fade-in-up">
              <h2 className="text-center text-lg sm:text-xl font-bold text-text-primary mb-1">
                Welcome! How are you joining today?
              </h2>
              <p className="text-center text-xs sm:text-sm text-text-secondary mb-6">
                Select your role to access the stadium portal
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Fan Card */}
                <button
                  onClick={() => setSelectedRole('fan')}
                  className="group relative bg-white rounded-2xl border-2 border-border hover:border-stadium-green p-6 sm:p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-stadium-green/40 cursor-pointer"
                >
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stadium-green-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-stadium-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="text-4xl sm:text-5xl mb-3">🎉</div>
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-1.5 group-hover:text-stadium-green transition-colors">
                    I'm a Fan
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    Get AI-powered seat directions, find restrooms, medical stations, and food — in your language.
                  </p>
                </button>

                {/* Staff Card */}
                <button
                  onClick={() => setSelectedRole('staff')}
                  className="group relative bg-white rounded-2xl border-2 border-border hover:border-gold p-6 sm:p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gold/40 cursor-pointer"
                >
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="text-4xl sm:text-5xl mb-3">📋</div>
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-1.5 group-hover:text-gold-dark transition-colors">
                    I'm Staff
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    Report and triage incidents with AI classification, priority scoring, and live situation commander.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* ─── Fan: Display Name ─── */}
          {selectedRole === 'fan' && (
            <div className="animate-fade-in-up max-w-md mx-auto">
              <button
                onClick={() => setSelectedRole(null)}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-text-secondary hover:text-stadium-green transition-colors mb-4 font-semibold cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Role Selection
              </button>

              <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
                <div className="text-3xl mb-2">🎉</div>
                <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-1">
                  Welcome, Fan!
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary mb-5">
                  Enter your display name to join the match atmosphere.
                </p>

                <label htmlFor="fan-name" className="block text-xs font-bold text-text-primary mb-1.5 uppercase tracking-wider">
                  Display Name
                </label>
                <input
                  id="fan-name"
                  type="text"
                  value={fanName}
                  onChange={(e) => setFanName(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleFanSubmit)}
                  placeholder="e.g. Alex, Fan #7, María..."
                  autoFocus
                  className="w-full text-sm border border-border rounded-xl px-4 py-3 bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-stadium-green/30 focus:border-stadium-green transition-all"
                />

                <button
                  onClick={handleFanSubmit}
                  disabled={!fanName.trim()}
                  className={`
                    mt-5 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2
                    ${fanName.trim()
                      ? 'bg-stadium-green text-white hover:bg-stadium-green-light cursor-pointer'
                      : 'bg-gray-200 text-gray-400 border border-gray-300 shadow-none cursor-not-allowed opacity-70'
                    }
                  `}
                >
                  Enter the Stadium →
                </button>
              </div>
            </div>
          )}

          {/* ─── Staff: Access Code ─── */}
          {selectedRole === 'staff' && (
            <div className="animate-fade-in-up max-w-md mx-auto">
              <button
                onClick={() => { setSelectedRole(null); setStaffError(''); setStaffCode(''); }}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-text-secondary hover:text-stadium-green transition-colors mb-4 font-semibold cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Role Selection
              </button>

              <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
                <div className="text-3xl mb-2">📋</div>
                <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-1">
                  Staff Control Center Access
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary mb-5">
                  Enter your official staff access code to continue.
                </p>

                <label htmlFor="staff-code" className="block text-xs font-bold text-text-primary mb-1.5 uppercase tracking-wider">
                  Staff Access Code
                </label>
                <input
                  id="staff-code"
                  type="password"
                  value={staffCode}
                  onChange={(e) => { setStaffCode(e.target.value); setStaffError(''); }}
                  onKeyDown={(e) => handleKeyDown(e, handleStaffSubmit)}
                  placeholder="Enter access code (e.g. FANBRIDGE2026)"
                  autoFocus
                  className={`w-full text-sm border rounded-xl px-4 py-3 bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 transition-all ${
                    staffError
                      ? 'border-medical focus:ring-medical/30 focus:border-medical'
                      : 'border-border focus:ring-stadium-green/30 focus:border-stadium-green'
                  }`}
                />

                {staffError && (
                  <p className="mt-2 text-xs text-medical font-bold flex items-center gap-1.5 bg-red-50 p-2 rounded-lg border border-red-200">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    {staffError}
                  </p>
                )}

                <button
                  onClick={handleStaffSubmit}
                  disabled={!staffCode}
                  className={`
                    mt-5 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2
                    ${staffCode
                      ? 'bg-stadium-green text-white hover:bg-stadium-green-light cursor-pointer'
                      : 'bg-gray-200 text-gray-400 border border-gray-300 shadow-none cursor-not-allowed opacity-70'
                    }
                  `}
                >
                  Access Staff Dashboard →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
