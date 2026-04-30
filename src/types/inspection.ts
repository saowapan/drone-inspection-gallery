export type DefectType = 'crack' | 'rust' | 'leak' | 'spalling' | 'discoloration'

export type Severity = 'low' | 'medium' | 'high'

export interface BoundingBox {
  x: number  // normalized 0-1, top-left corner
  y: number  // normalized 0-1, top-left corner
  w: number  // normalized 0-1, width
  h: number  // normalized 0-1, height
}

export interface Defect {
  id: string
  type: DefectType
  severity: Severity
  confidence: number // 0-1
  bbox: BoundingBox
  notes?: string
}

export interface Capture {
  id: string
  imageUrl: string
  altitudeM: number
  capturedAt: string // ISO date string
  defects: Defect[]
}

export interface Inspection {
  inspectionId: string
  buildingName: string
  inspectionDate: string
  droneModel: string
  facade: 'north' | 'south' | 'east' | 'west'
  imageWidth: number
  imageHeight: number
  captures: Capture[]
}