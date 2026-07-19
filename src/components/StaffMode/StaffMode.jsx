import { useState, useCallback, useEffect } from 'react'
import IncidentForm from './IncidentForm.jsx'
import Dashboard from './Dashboard.jsx'
import { triageIncident, generateSituationSummary, resolveLocationFromData } from '../../services/aiService.js'

let nextId = 104

const SEEDED_INCIDENTS = [
  {
    id: 101,
    category: 'medical',
    priority: 'high',
    location: resolveLocationFromData('Section 118'),
    matchedLocation: resolveLocationFromData('Section 118'),
    summary: 'Medical alert near Section 118 — fan feeling unwell, First Aid Station North notified.',
    originalText: 'Fan feeling unwell near Section 118',
    timestamp: Date.now() - 450000,
  },
  {
    id: 102,
    category: 'crowd',
    priority: 'medium',
    location: resolveLocationFromData('Gate D'),
    matchedLocation: resolveLocationFromData('Gate D'),
    summary: 'Crowd density buildup at Gate D - East — turns gates adjusting flow.',
    originalText: 'Large crowd bottleneck forming at Gate D',
    timestamp: Date.now() - 240000,
  },
  {
    id: 103,
    category: 'facilities',
    priority: 'low',
    location: resolveLocationFromData('Gate F'),
    matchedLocation: resolveLocationFromData('Gate F'),
    summary: 'Spilled drinks causing slippery floor near Gate F concession stand — cleanup team requested.',
    originalText: 'Spilled drinks causing slippery floor near Gate F concession',
    timestamp: Date.now() - 120000,
  },
]

export default function StaffMode() {
  const [incidents, setIncidents] = useState(SEEDED_INCIDENTS)
  const [situationSummary, setSituationSummary] = useState(
    '3 active incidents currently monitored: 1 high priority medical near Section 118, 1 medium priority crowd control at Gate D - East, and 1 facility maintenance task near Gate F - South.'
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)

  const updateSummary = useCallback(async (updatedIncidents) => {
    setIsSummaryLoading(true)
    try {
      const summary = await generateSituationSummary(updatedIncidents)
      setSituationSummary(summary)
    } catch (err) {
      console.error('Summary generation error:', err)
      setSituationSummary(`${updatedIncidents.length} active incident(s) monitored.`)
    } finally {
      setIsSummaryLoading(false)
    }
  }, [])

  // Generate fresh AI summary on mount if needed
  useEffect(() => {
    updateSummary(SEEDED_INCIDENTS)
  }, [updateSummary])

  const handleSubmit = useCallback(async (text) => {
    setIsSubmitting(true)
    try {
      const triage = await triageIncident(text)
      const newIncident = {
        id: nextId++,
        ...triage,
        originalText: text,
        timestamp: Date.now(),
      }
      const updated = [newIncident, ...incidents]
      setIncidents(updated)

      // Regenerate situation summary live
      await updateSummary(updated)
    } catch (err) {
      console.error('Incident submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }, [incidents, updateSummary])

  const handleResolve = useCallback(async (id) => {
    const updated = incidents.filter(inc => inc.id !== id)
    setIncidents(updated)
    await updateSummary(updated)
  }, [incidents, updateSummary])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
      {/* ─── Left Column: Incident Submission Form ─── */}
      <div className="lg:col-span-2">
        <IncidentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>

      {/* ─── Right Column: Dashboard Control Center ─── */}
      <div className="lg:col-span-3">
        <Dashboard
          incidents={incidents}
          situationSummary={situationSummary}
          isSummaryLoading={isSummaryLoading}
          onResolve={handleResolve}
        />
      </div>
    </div>
  )
}
