import type { Capture } from "../types/inspection";

interface DefectCardProps {
  capture: Capture
  onClick?: () => void
}

export function DefectCard({ capture, onClick }: DefectCardProps) {
  const defectCount = capture.defects.length
  const highSeverityCount = capture.defects.filter(
    (d) => d.severity === 'high'
  ).length

  return (
    <button
      onClick={onClick}
      className="group text-left bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition cursor-pointer"
    >
      <div className="aspect-video bg-slate-700 overflow-hidden">
        <img
          src={capture.imageUrl}
          alt={`Capture ${capture.id}`}
          className="w-full h-full object-cover group-hover:scale-105 transition"
          loading="lazy" // tailwindcss class for <img> preformance
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">{capture.id}</span>
          <span className="text-xs text-slate-500">
            {capture.altitudeM}m altitude
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {defectCount} {defectCount === 1 ? 'defect' : 'defects'}
          </span>
          {highSeverityCount > 0 && (
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
              {highSeverityCount} high
            </span>
          )}
        </div>
      </div>
    </button>
  )
}