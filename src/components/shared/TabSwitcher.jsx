export default function TabSwitcher({ tabs, activeTab, onTabChange }) {
  return (
    <div className="relative flex" role="tablist">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === index}
          onClick={() => onTabChange(index)}
          className={`
            relative px-5 sm:px-8 py-3.5 text-sm sm:text-base font-semibold transition-colors duration-200
            ${activeTab === index
              ? 'text-stadium-green'
              : 'text-text-secondary hover:text-stadium-green/70'
            }
          `}
        >
          <span className="relative z-10 flex items-center gap-2">
            {index === 0 ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            {tab}
          </span>

          {/* Active indicator bar */}
          {activeTab === index && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stadium-green rounded-full tab-indicator" />
          )}
        </button>
      ))}
    </div>
  )
}
