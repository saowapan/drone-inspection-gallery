interface StatTileProps {
  label: string
  value: number | string
  tone?: 'default' | 'high' | 'medium' | 'low'
}

const TONE_STYLES: Record<NonNullable<StatTileProps['tone']>, string> = {
  default: 'text-white',
  high: 'text-red-400',
  medium: 'text-amber-400',
  low: 'text-emerald-400'
}

export function StatTile({ label, value, tone = 'default' }: StatTileProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={`text-2xl font-bold ${TONE_STYLES[tone]}`}>{value}</p>
    </div>
  )
}