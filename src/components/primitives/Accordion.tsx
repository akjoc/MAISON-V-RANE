import { useId, useState, type ReactNode } from 'react'
import { Icon } from './Icon'

export interface AccordionItem {
  id: string
  title: string
  meta?: string
  content: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  /** Allow several panels open at once. */
  multiple?: boolean
  defaultOpen?: string[]
  className?: string
}

export function Accordion({ items, multiple = false, defaultOpen = [], className = '' }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen)
  const baseId = useId()

  const toggle = (id: string) => {
    setOpen((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      return multiple ? [...prev, id] : [id]
    })
  }

  return (
    <div className={`accordion ${className}`.trim()}>
      {items.map((item) => {
        const isOpen = open.includes(item.id)
        const panelId = `${baseId}-${item.id}-panel`
        const btnId = `${baseId}-${item.id}-btn`
        return (
          <div className="accordion__item" key={item.id}>
            <h3>
              <button
                type="button"
                className="accordion__trigger"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span className="title">
                  {item.title}
                  {item.meta && <span className="count">{item.meta}</span>}
                </span>
                <span className="accordion__icon" aria-hidden="true" />
              </button>
            </h3>
            <div
              className={`accordion__panel ${isOpen ? 'is-open' : ''}`}
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
            >
              <div>
                <div className="accordion__content">{item.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function AccordionHint() {
  return (
    <span className="micro" aria-hidden="true">
      <Icon name="plus" size={11} /> <span>Open</span>
    </span>
  )
}
