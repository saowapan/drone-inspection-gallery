// src/App.tsx
import { useMemo, useState } from 'react'
import { useInspection } from './hooks/useInspection'
import { DefectCard } from './components/DefectCard'
import { FilterBar, type SeverityFilter } from './components/FilterBar'
import { CaptureModal } from './components/CaptureModal'
import type { Capture } from './types/inspection'
import { StatTile } from './components/StatTile'
import { countDefectsBySeverity } from './lib/defectStats'

function App() {
  const { data, loading, error } = useInspection('/mockInspection.json')
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all')
  const [selectedCapture, setSelectedCapture] = useState<Capture | null>(null)

  const filteredCaptures = useMemo(() => {
    if (!data) return []
    if (severityFilter === 'all') return data.captures

    return data.captures
      .map((capture) => ({
        ...capture,
        defects: capture.defects.filter((d) => d.severity === severityFilter),
      }))
      .filter((capture) => capture.defects.length > 0)
  }, [data, severityFilter])

  const counts = useMemo(() => countDefectsBySeverity(data), [data])


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading inspection data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-red-400 flex items-center justify-center">
        <p className="text-xl">Error: {error}</p>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-800 px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{data.buildingName}</h1>
          <p className="text-slate-400 mt-1">
            Inspection {data.inspectionId} · {data.facade} façade ·{' '}
            {new Date(data.inspectionDate).toLocaleDateString()} · {data.droneModel}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile label="Captures" value={data.captures.length} />
          <StatTile label="High Severity" value={counts.high} tone="high" />
          <StatTile label="Medium Severity" value={counts.medium} tone="medium" />
          <StatTile label="Low Severity" value={counts.low} tone="low" />
        </div>
      </header>

      <main className="px-8 py-6">
        <div className="mb-6">
          <FilterBar
            value={severityFilter}
            onChange={setSeverityFilter}
            counts={counts}
          />
        </div>

        {filteredCaptures.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            No captures match this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCaptures.map((capture) => (
              <DefectCard
                key={capture.id}
                capture={capture}
                onClick={() => setSelectedCapture(capture)}
              />
            ))}
          </div>
        )}
      </main>

      <CaptureModal
        capture={selectedCapture}
        onClose={() => setSelectedCapture(null)}
      />
    </div>
  )
}

export default App