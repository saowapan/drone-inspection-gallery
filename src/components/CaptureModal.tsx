import { useEffect } from 'react'
import type { Capture } from '../types/inspection'
import { BoundingBoxOverlay } from './BoundingBoxOverlay'

interface CaptureModalProps {
  capture: Capture | null
  onClose: () => void
}

export function CaptureModal({ capture, onClose }: CaptureModalProps) {
  useEffect(() => { // useEffect because we are insteract with document (browser api outside React)
    if (!capture) return // do nothing if modal closed


    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden' // lock scrool -->  (DOM mutation outside React)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [capture, onClose])

  if (!capture) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose} // black backdrop
      role="dialog"
      aria-modal="true"
      aria-label={`Capture ${capture.id}`}
    >
      <div
        className="relative max-w-5xl w-full bg-slate-900 rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()} // model content
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="relative">
          <img
            src={capture.imageUrl}
            alt={`Capture ${capture.id}`}
            className="w-full h-auto block"
          />
          <BoundingBoxOverlay defects={capture.defects} />
        </div>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">{capture.id}</h2>
            <span className="text-sm text-slate-400">
              {capture.altitudeM}m altitude ·{' '}
              {new Date(capture.capturedAt).toLocaleString()}
            </span>
          </div>
          <div className="space-y-2">
            {capture.defects.map((defect) => (
              <div
                key={defect.id}
                className="flex items-start gap-3 text-sm bg-slate-800/50 rounded p-3"
              >
                <span
                  className={`mt-0.5 inline-block w-2 h-2 rounded-full ${defect.severity === 'high'
                    ? 'bg-red-500'
                    : defect.severity === 'medium'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                    }`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium capitalize">{defect.type}</span>
                    <span className="text-xs text-slate-500">
                      {defect.severity} · {Math.round(defect.confidence * 100)}% confidence
                    </span>
                  </div>
                  {defect.notes && (
                    <p className="text-slate-400 text-xs">{defect.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}