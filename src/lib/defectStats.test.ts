import { describe, it, expect } from 'vitest'
import { countDefectsBySeverity } from './defectStats'
import type { Inspection } from '../types/inspection'

describe('countDefectsBySeverity', () => {
  it('returns zeros when inspection is null', () => {
    const result = countDefectsBySeverity(null)
    expect(result).toEqual({ all: 0, high: 0, medium: 0, low: 0 })
  })

  it('returns zeros when inspection has no captures', () => {
    const inspection: Inspection = {
      inspectionId: 'INS-1',
      buildingName: 'Empty',
      inspectionDate: '2025-01-01',
      droneModel: 'Test',
      facade: 'north',
      imageWidth: 1000,
      imageHeight: 1000,
      captures: [],
    }
    expect(countDefectsBySeverity(inspection)).toEqual({
      all: 0,
      high: 0,
      medium: 0,
      low: 0,
    })
  })

  it('counts defects across multiple captures by severity', () => {
    const inspection: Inspection = {
      inspectionId: 'INS-1',
      buildingName: 'Test',
      inspectionDate: '2025-01-01',
      droneModel: 'Test',
      facade: 'north',
      imageWidth: 1000,
      imageHeight: 1000,
      captures: [
        {
          id: 'c1',
          imageUrl: '',
          altitudeM: 30,
          capturedAt: '2025-01-01T00:00:00Z',
          defects: [
            { id: 'd1', type: 'crack', severity: 'high', confidence: 0.9, bbox: { x: 0, y: 0, w: 0.1, h: 0.1 } },
            { id: 'd2', type: 'rust', severity: 'medium', confidence: 0.8, bbox: { x: 0, y: 0, w: 0.1, h: 0.1 } },
          ],
        },
        {
          id: 'c2',
          imageUrl: '',
          altitudeM: 30,
          capturedAt: '2025-01-01T00:00:00Z',
          defects: [
            { id: 'd3', type: 'crack', severity: 'high', confidence: 0.9, bbox: { x: 0, y: 0, w: 0.1, h: 0.1 } },
            { id: 'd4', type: 'leak', severity: 'low', confidence: 0.7, bbox: { x: 0, y: 0, w: 0.1, h: 0.1 } },
          ],
        },
      ],
    }

    expect(countDefectsBySeverity(inspection)).toEqual({
      all: 4,
      high: 2,
      medium: 1,
      low: 1,
    })
  })
})