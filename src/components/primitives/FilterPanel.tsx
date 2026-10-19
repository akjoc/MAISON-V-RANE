import { Icon } from './Icon'

export interface FacetOption {
  value: string
  label: string
  count: number
}

export interface Facet {
  id: string
  title: string
  options: FacetOption[]
}

interface FilterPanelProps {
  facets: Facet[]
  selected: Record<string, string[]>
  onToggle: (facetId: string, value: string) => void
  onClearFacet: (facetId: string) => void
}

export function FilterPanel({ facets, selected, onToggle, onClearFacet }: FilterPanelProps) {
  return (
    <div className="filters">
      {facets.map((facet) => {
        const active = selected[facet.id] ?? []
        return (
          <fieldset className="filters__group" key={facet.id}>
            <legend className="filters__legend">
              <span>{facet.title}</span>
              {active.length > 0 && (
                <button type="button" className="micro filters__clear" onClick={() => onClearFacet(facet.id)}>
                  Clear
                </button>
              )}
            </legend>
            <div className="filters__options">
              {facet.options.map((option) => {
                const checked = active.includes(option.value)
                const disabled = option.count === 0 && !checked
                return (
                  <label key={option.value} className={`filter-option ${disabled ? 'is-disabled' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => onToggle(facet.id, option.value)}
                    />
                    <span className="filter-option__box" aria-hidden="true">
                      {checked && <Icon name="check" size={11} />}
                    </span>
                    <span className="filter-option__label">{option.label}</span>
                    <span className="filter-option__count">{option.count}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        )
      })}
    </div>
  )
}
