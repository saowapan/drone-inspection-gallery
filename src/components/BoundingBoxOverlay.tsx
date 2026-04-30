import type { Defect } from "../types/inspection";

interface BoundingBoxOverlayProps {
  defects: Defect[]
}

const SEVERITY_COLORS: Record<Defect['severity'], string> = {
  high: 'border-red-500 bg-red-500/10',
  medium: 'border-amber-500 bg-amber-500/10',
  low: 'border-emerald-500 bg-emerald-500/10',
}

const SEVERITY_LABEL_COLORS: Record<Defect['severity'], string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
}

export function BoundingBoxOverlay({ defects }: BoundingBoxOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {defects.map((defect) => (
        <div
          key={defect.id}
          className={`absolute border-2 rounded ${SEVERITY_COLORS[defect.severity]}`}
          style={{
            left: `${defect.bbox.x * 100}%`,
            top: `${defect.bbox.y * 100}%`,
            width: `${defect.bbox.w * 100}%`,
            height: `${defect.bbox.h * 100}%`,
          }}
        >
          <span
            className={`absolute -top-6 left-0 text-xs text-white px-2 py-0.5 rounded whitespace-nowrap ${SEVERITY_LABEL_COLORS[defect.severity]}`}
          >
            {defect.type} · {Math.round(defect.confidence * 100)}%
          </span>
        </div>
      ))}
    </div>
  )
}