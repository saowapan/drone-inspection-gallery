// src/lib/defectStats.ts
import type { Inspection, Severity } from '../types/inspection'

export type SeverityCounts = Record<'all' | Severity, number>

export function countDefectsBySeverity(inspection: Inspection | null): SeverityCounts {
  const result: SeverityCounts = { all: 0, high: 0, medium: 0, low: 0 }

  if (!inspection) return result

  for (const capture of inspection.captures) {
    for (const defect of capture.defects) {
      result.all += 1
      result[defect.severity] += 1
    }
  }

  return result
}