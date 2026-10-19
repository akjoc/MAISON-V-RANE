import { Link } from 'react-router-dom'
import type { NavItem } from '../../types'
import { Media } from '../primitives/Media'
import { Icon } from '../primitives/Icon'

interface MegaMenuProps {
  id: string
  item: NavItem
  open: boolean
  onClose: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

/** Accessible desktop mega menu panel. Hidden from focus order when closed. */
export function MegaMenu({ id, item, open, onClose, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  if (!item.groups) return null
  return (
    <div
      className={`mega ${open ? 'is-open' : ''}`}
      id={id}
      inert={!open ? true : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container container--wide">
        <div className="mega__inner">
          <div className="mega__groups">
            {item.groups.map((group) => (
              <div key={group.title} className="mega__group">
                <p className="mega__group-title">{group.title}</p>
                <ul className="mega__list">
                  {group.links.map((link) => (
                    <li key={link.to + link.label}>
                      <Link className="mega__link" to={link.to} onClick={onClose}>
                        <span>
                          {link.label}
                          {link.description && (
                            <span className="mega__link-desc">{link.description}</span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {item.feature && (
            <Link className="mega__feature" to={item.feature.to} onClick={onClose}>
              <div className="mega__feature-media">
                <Media
                  imageKey={item.feature.imageKey}
                  alt={item.feature.alt}
                  orientation="square"
                  sizes="(min-width: 1280px) 300px, 220px"
                />
              </div>
              <div className="mega__feature-copy">
                <span className="eyebrow eyebrow--plain">{item.feature.eyebrow}</span>
                <span className="mega__feature-title">{item.feature.title}</span>
                <span className="mega__feature-text">{item.feature.copy}</span>
                <span className="text-link">
                  {item.feature.cta} <Icon name="arrow-right" size={14} />
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
