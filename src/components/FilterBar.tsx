import type { Severity } from "../types/inspection";

export type SeverityFilter = Severity | 'all'

interface FilterBarProps {
  value: SeverityFilter
  onChange: (next: SeverityFilter) => void
  counts: Record<SeverityFilter, number>
}

const OPTIONS: { value: SeverityFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
]

export function FilterBar({ value, onChange, counts }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Severity filter">
      {OPTIONS.map((option) => {
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${isActive
              ? 'bg-blue-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            {option.label}
            <span className="ml-2 text-xs opacity-70">
              {counts[option.value]} {counts[option.value] === 1 ? 'defect' : 'defects'}
            </span>
          </button>
        )
      })}
    </div>
  )
}