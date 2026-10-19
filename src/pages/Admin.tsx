import { useState, useEffect, useMemo, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import '../styles/admin.css'

export interface AdminContentItem {
  id: number
  title: string
  type: string
  status: 'Published' | 'Draft' | 'Archived'
  updated: string
  description: string
  image: string
  extra?: string
}

export interface EnquiryItem {
  id: number
  name: string
  contact: string
  phone: string
  interest: string
  salon: string
  received: string
  status: 'New' | 'In progress' | 'Closed'
}

export interface SeoSettings {
  pageTitle: string
  metaDescription: string
  canonicalUrl: string
  indexing: string
  ogImage: string
}

export interface WorkspaceSettings {
  brandName: string
  studioName: string
  defaultLanguage: string
  timezone: string
  publishingMode: string
}

const defaultContent: AdminContentItem[] = [
  {
    id: 1,
    title: 'Aéroform Flagship — Chapter 01',
    type: 'Campaign page',
    status: 'Published',
    updated: '19 Oct 2026',
    description: 'Time, shaped by the road. Cushion-cased mechanical instruments for the open road.',
    image: 'hero-wide-1600.webp',
  },
  {
    id: 2,
    title: 'The Aerodynamic Silhouette',
    type: 'Editorial story',
    status: 'Published',
    updated: '18 Oct 2026',
    description: 'Machined from stainless steel 316L, brushed in one continuous pass from lug to lug.',
    image: 'aeroform-graphite-1200.webp',
  },
  {
    id: 3,
    title: 'The Calibre MV·01 Movement',
    type: 'Editorial story',
    status: 'Published',
    updated: '16 Oct 2026',
    description: 'Proprietary automatic calibre with 72-hour reserve, 28,800 vph and hand-chamfered bridges.',
    image: 'movement-cutaway.webp',
  },
  {
    id: 4,
    title: 'Grand Tourer Chronograph Heritage',
    type: 'Editorial story',
    status: 'Published',
    updated: '14 Oct 2026',
    description: 'Dual counters, hand-cut tachymeter bezel, and oxblood accents on the running seconds.',
    image: 'aeroform-gt-1200.webp',
  },
  {
    id: 5,
    title: 'Atelier Craftsmanship Journal',
    type: 'Article',
    status: 'Draft',
    updated: '11 Oct 2026',
    description: 'Inside the Geneva workshop where every bevel, bridge and bracelet is finished by hand.',
    image: 'craft-atelier-1200.webp',
  },
  {
    id: 6,
    title: 'Personalisation & Caseback Engraving',
    type: 'Page section',
    status: 'Published',
    updated: '10 Oct 2026',
    description: 'Custom monogramming, typography choice and bespoke strap pairing service.',
    image: 'service-engraving-1200.webp',
  },
]

const defaultWatches: AdminContentItem[] = [
  {
    id: 101,
    title: 'Aéroform 40 Graphite (Ref. AF·40·GR)',
    type: 'Watch reference',
    status: 'Published',
    updated: '19 Oct 2026',
    description: '40 mm cushion case, horizontally brushed graphite dial, integrated H-link bracelet.',
    image: 'aeroform-graphite-1200.webp',
    extra: '£6,450 · Available in boutique',
  },
  {
    id: 102,
    title: 'Aéroform 40 Champagne (Ref. AF·40·CH)',
    type: 'Watch reference',
    status: 'Published',
    updated: '18 Oct 2026',
    description: 'Warm champagne sunburst dial, satin-brushed steel, champagne calfskin strap.',
    image: 'aeroform-champagne-1200.webp',
    extra: '£6,270 · Available in boutique',
  },
  {
    id: 103,
    title: 'Aéroform 38 Nocturne (Ref. AF·38·NC)',
    type: 'Watch reference',
    status: 'Published',
    updated: '17 Oct 2026',
    description: '38 mm case, ink blue lacquered dial with applied rhodium indices and ink rubber strap.',
    image: 'aeroform-nocturne-1200.webp',
    extra: '£5,850 · Limited allocation',
  },
  {
    id: 104,
    title: 'Aéroform GT Chronograph (Ref. AF·42·GT)',
    type: 'Watch reference',
    status: 'Published',
    updated: '16 Oct 2026',
    description: '42 mm twin-register chronograph with engraved tachymeter and oxblood accents.',
    image: 'aeroform-gt-1200.webp',
    extra: '£8,900 · By appointment',
  },
  {
    id: 105,
    title: 'Aéroform Skeleton Édition (Ref. AF·40·SK)',
    type: 'Watch reference',
    status: 'Draft',
    updated: '14 Oct 2026',
    description: 'Openworked dial revealing the titanium micro-rotor and escapement.',
    image: 'aeroform-skeleton-1200.webp',
    extra: '£11,200 · Preview reference',
  },
  {
    id: 106,
    title: 'Aéroform 40 Oxblood (Ref. AF·40·OX)',
    type: 'Watch reference',
    status: 'Published',
    updated: '12 Oct 2026',
    description: 'Deep oxblood sunray dial paired with vegetable-tanned oxblood calfskin strap.',
    image: 'aeroform-oxblood-1200.webp',
    extra: '£6,630 · Available in boutique',
  },
]

const defaultMedia: AdminContentItem[] = [
  {
    id: 201,
    title: 'hero-wide-1600.webp',
    type: 'Hero Banner',
    status: 'Published',
    updated: '19 Oct 2026',
    description: 'Aéroform 40 Graphite resting on warm travertine stone in raking light (1600×900)',
    image: '/assets/images/hero-wide-1600.webp',
  },
  {
    id: 202,
    title: 'editorial-collection.webp',
    type: 'Editorial Feature',
    status: 'Published',
    updated: '18 Oct 2026',
    description: 'Aéroform timepiece on architectural plinth in natural sunlight (1200×800)',
    image: '/assets/images/editorial-collection-1200.webp',
  },
  {
    id: 203,
    title: 'craft-atelier.webp',
    type: 'Craft Photography',
    status: 'Published',
    updated: '17 Oct 2026',
    description: 'Master watchmaker chamfering movement bridge at the bench (1200×800)',
    image: '/assets/images/craft-atelier-1200.webp',
  },
  {
    id: 204,
    title: 'service-engraving.webp',
    type: 'Personalisation Detail',
    status: 'Published',
    updated: '16 Oct 2026',
    description: 'Artisan engraving custom cursive monogram on steel caseback (1200×800)',
    image: '/assets/images/service-engraving-1200.webp',
  },
  {
    id: 205,
    title: 'aeroform-gt.webp',
    type: 'Product Macro',
    status: 'Published',
    updated: '15 Oct 2026',
    description: 'GT Chronograph tachymeter scale and subdial macro photography (1200×800)',
    image: '/assets/images/aeroform-gt-1200.webp',
  },
  {
    id: 206,
    title: 'hero-vertical-1200.webp',
    type: 'Campaign Lifestyle',
    status: 'Published',
    updated: '12 Oct 2026',
    description: 'Aéroform 40 Graphite on the wrist at the wheel of a grand-touring car (1200×1600)',
    image: '/assets/images/hero-vertical-1200.webp',
  },
]

const defaultEnquiries: EnquiryItem[] = [
  {
    id: 301,
    name: 'Lord Alistair Crawford',
    contact: 'a.crawford@mayfair-advisory.co.uk',
    phone: '+44 20 7946 0912',
    interest: 'Aéroform GT Chronograph — Private viewing allocation',
    salon: 'London Marylebone Salon',
    received: '19 Oct 2026',
    status: 'New',
  },
  {
    id: 302,
    name: 'Hélène de Saint-Germain',
    contact: 'h.saintgermain@atelier-sg.fr',
    phone: '+33 1 42 68 55 00',
    interest: 'Bespoke Caseback Monogram & Care Consultation',
    salon: 'Paris Atelier des Passages',
    received: '18 Oct 2026',
    status: 'In progress',
  },
  {
    id: 303,
    name: 'Kenji Takahashi',
    contact: 'takahashi.k@ginza-holdings.jp',
    phone: '+81 3 5555 0143',
    interest: 'Aéroform 40 Graphite (Ref. AF·40·GR) Boutique Appointment',
    salon: 'Tokyo Ginza Maison',
    received: '17 Oct 2026',
    status: 'In progress',
  },
  {
    id: 304,
    name: 'Claire Dupont',
    contact: 'c.dupont@geneve-finance.ch',
    phone: '+41 22 819 33 22',
    interest: 'Calibre MV·01 Technical Dossier & Atelier Visit',
    salon: 'Geneva Quai des Bergues',
    received: '15 Oct 2026',
    status: 'Closed',
  },
]

const defaultSeo: SeoSettings = {
  pageTitle: 'MAISON VÉRANE — Aéroform, mechanical instruments for the open road',
  metaDescription:
    'A luxury watchmaking house. Mechanical instruments shaped by movement, air and light. Hand-finished cushion cases and proprietary Calibre MV·01.',
  canonicalUrl: 'https://maisonverane.com/collections/aeroform',
  indexing: 'Index, follow',
  ogImage: '/assets/images/hero-wide-1600.webp',
}

const defaultSettings: WorkspaceSettings = {
  brandName: 'MAISON VÉRANE',
  studioName: 'Aéroform · Content Studio',
  defaultLanguage: 'English (UK)',
  timezone: 'Europe/Paris (CET)',
  publishingMode: 'Draft and publish',
}

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'content' | 'products' | 'media' | 'enquiries' | 'seo' | 'settings'
  >('dashboard')

  const [items, setItems] = useState<AdminContentItem[]>(() =>
    loadStorage('mv-admin-items', defaultContent),
  )
  const [watches, setWatches] = useState<AdminContentItem[]>(() =>
    loadStorage('mv-admin-watches', defaultWatches),
  )
  const [mediaList, setMediaList] = useState<AdminContentItem[]>(() =>
    loadStorage('mv-admin-media', defaultMedia),
  )
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(() =>
    loadStorage('mv-admin-enquiries', defaultEnquiries),
  )
  const [seo, setSeo] = useState<SeoSettings>(() =>
    loadStorage('mv-admin-seo', defaultSeo),
  )
  const [settings, setSettings] = useState<WorkspaceSettings>(() =>
    loadStorage('mv-admin-settings', defaultSettings),
  )

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTargetCategory, setModalTargetCategory] = useState<'content' | 'watches' | 'media'>('content')
  const [editingItem, setEditingItem] = useState<AdminContentItem | null>(null)
  const [formValues, setFormValues] = useState({
    title: '',
    type: 'Campaign page',
    status: 'Published' as 'Published' | 'Draft' | 'Archived',
    description: '',
    image: '',
    extra: '',
  })

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.clearTimeout((window as unknown as { _toastTimer?: number })._toastTimer)
    ;(window as unknown as { _toastTimer?: number })._toastTimer = window.setTimeout(() => {
      setToastMessage(null)
    }, 2800)
  }

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mv-admin-items', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem('mv-admin-watches', JSON.stringify(watches))
  }, [watches])

  useEffect(() => {
    localStorage.setItem('mv-admin-media', JSON.stringify(mediaList))
  }, [mediaList])

  useEffect(() => {
    localStorage.setItem('mv-admin-enquiries', JSON.stringify(enquiries))
  }, [enquiries])

  useEffect(() => {
    localStorage.setItem('mv-admin-seo', JSON.stringify(seo))
  }, [seo])

  useEffect(() => {
    localStorage.setItem('mv-admin-settings', JSON.stringify(settings))
  }, [settings])

  // Content Helpers
  const openModal = (
    category: 'content' | 'watches' | 'media',
    itemToEdit: AdminContentItem | null = null,
  ) => {
    setModalTargetCategory(category)
    setEditingItem(itemToEdit)
    if (itemToEdit) {
      setFormValues({
        title: itemToEdit.title,
        type: itemToEdit.type,
        status: itemToEdit.status,
        description: itemToEdit.description,
        image: itemToEdit.image,
        extra: itemToEdit.extra || '',
      })
    } else {
      const defaultType =
        category === 'content'
          ? 'Campaign page'
          : category === 'watches'
          ? 'Watch reference'
          : 'Media Asset'
      setFormValues({
        title: '',
        type: defaultType,
        status: 'Published',
        description: '',
        image: '',
        extra: '',
      })
    }
    setModalOpen(true)
  }

  const handleSaveModal = (e: FormEvent) => {
    e.preventDefault()
    if (!formValues.title.trim()) return

    const nowStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

    const payload: AdminContentItem = {
      id: editingItem ? editingItem.id : Date.now(),
      title: formValues.title.trim(),
      type: formValues.type,
      status: formValues.status,
      description: formValues.description.trim(),
      image: formValues.image.trim(),
      extra: formValues.extra.trim(),
      updated: nowStr,
    }

    if (modalTargetCategory === 'content') {
      if (editingItem) {
        setItems((prev) => prev.map((x) => (x.id === editingItem.id ? payload : x)))
        showToast('Campaign content updated.')
      } else {
        setItems((prev) => [payload, ...prev])
        showToast('New content published to prototype.')
      }
    } else if (modalTargetCategory === 'watches') {
      if (editingItem) {
        setWatches((prev) => prev.map((x) => (x.id === editingItem.id ? payload : x)))
        showToast('Watch story updated.')
      } else {
        setWatches((prev) => [payload, ...prev])
        showToast('New watch story added.')
      }
    } else {
      if (editingItem) {
        setMediaList((prev) => prev.map((x) => (x.id === editingItem.id ? payload : x)))
        showToast('Media entry updated.')
      } else {
        setMediaList((prev) => [payload, ...prev])
        showToast('Media asset recorded.')
      }
    }

    setModalOpen(false)
  }

  const toggleStatus = (id: number, category: 'content' | 'watches' | 'media') => {
    const updater = (list: AdminContentItem[]) =>
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              status: (item.status === 'Published' ? 'Draft' : 'Published') as 'Published' | 'Draft',
              updated: '19 Oct 2026',
            }
          : item,
      )

    if (category === 'content') setItems(updater)
    else if (category === 'watches') setWatches(updater)
    else setMediaList(updater)

    showToast('Content status toggled.')
  }

  const deleteItem = (id: number, category: 'content' | 'watches' | 'media', title: string) => {
    if (window.confirm(`Delete "${title}" from the atelier catalog?`)) {
      if (category === 'content') setItems((prev) => prev.filter((x) => x.id !== id))
      else if (category === 'watches') setWatches((prev) => prev.filter((x) => x.id !== id))
      else setMediaList((prev) => prev.filter((x) => x.id !== id))
      showToast('Item deleted.')
    }
  }

  const cycleEnquiryStatus = (id: number) => {
    setEnquiries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e
        const nextStatus =
          e.status === 'New' ? 'In progress' : e.status === 'In progress' ? 'Closed' : 'New'
        return { ...e, status: nextStatus }
      }),
    )
    showToast('Enquiry status updated.')
  }

  const deleteEnquiry = (id: number, name: string) => {
    if (window.confirm(`Delete enquiry from ${name}?`)) {
      setEnquiries((prev) => prev.filter((e) => e.id !== id))
      showToast('Enquiry record deleted.')
    }
  }

  const exportJson = (data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    showToast('JSON exported successfully.')
  }

  // Filtered lists
  const filteredContent = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return items.filter((x) => {
      const matchStatus = !statusFilter || x.status === statusFilter
      const matchQuery =
        !q ||
        x.title.toLowerCase().includes(q) ||
        x.type.toLowerCase().includes(q) ||
        x.description.toLowerCase().includes(q)
      return matchStatus && matchQuery
    })
  }, [items, searchQuery, statusFilter])

  const filteredWatches = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return watches.filter((x) => {
      const matchStatus = !statusFilter || x.status === statusFilter
      const matchQuery =
        !q ||
        x.title.toLowerCase().includes(q) ||
        x.description.toLowerCase().includes(q) ||
        (x.extra && x.extra.toLowerCase().includes(q))
      return matchStatus && matchQuery
    })
  }, [watches, searchQuery, statusFilter])

  const filteredMedia = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return mediaList.filter((x) => {
      const matchStatus = !statusFilter || x.status === statusFilter
      const matchQuery =
        !q ||
        x.title.toLowerCase().includes(q) ||
        x.type.toLowerCase().includes(q) ||
        x.description.toLowerCase().includes(q)
      return matchStatus && matchQuery
    })
  }, [mediaList, searchQuery, statusFilter])

  // Counts
  const totalPublished =
    items.filter((x) => x.status === 'Published').length +
    watches.filter((x) => x.status === 'Published').length
  const totalDraft =
    items.filter((x) => x.status === 'Draft').length +
    watches.filter((x) => x.status === 'Draft').length

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard'
      case 'content':
        return 'Campaign Content'
      case 'products':
        return 'Watch Stories'
      case 'media':
        return 'Media Library'
      case 'enquiries':
        return 'Contact Requests'
      case 'seo':
        return 'SEO Settings'
      case 'settings':
        return 'Settings'
      default:
        return 'Dashboard'
    }
  }

  return (
    <div className="mv-admin">
      {/* Sidebar */}
      <aside className={`mv-admin__sidebar ${mobileMenuOpen ? '' : 'mobile-hidden'}`}>
        <div className="mv-admin__sidebrand">
          <b className="mv-admin__sidebrand-title">{settings.brandName}</b>
          <span className="mv-admin__sidebrand-sub">{settings.studioName}</span>
        </div>

        <div className="mv-admin__side-label">Workspace</div>

        <button
          className={`mv-admin__side-link ${activeTab === 'dashboard' ? 'is-active' : ''}`}
          onClick={() => {
            setActiveTab('dashboard')
            setMobileMenuOpen(false)
          }}
        >
          <span className="ico">▦</span> Dashboard
        </button>

        <button
          className={`mv-admin__side-link ${activeTab === 'content' ? 'is-active' : ''}`}
          onClick={() => {
            setActiveTab('content')
            setMobileMenuOpen(false)
          }}
        >
          <span className="ico">▤</span> Campaign Content
        </button>

        <button
          className={`mv-admin__side-link ${activeTab === 'products' ? 'is-active' : ''}`}
          onClick={() => {
            setActiveTab('products')
            setMobileMenuOpen(false)
          }}
        >
          <span className="ico">◷</span> Watch Stories
        </button>

        <button
          className={`mv-admin__side-link ${activeTab === 'media' ? 'is-active' : ''}`}
          onClick={() => {
            setActiveTab('media')
            setMobileMenuOpen(false)
          }}
        >
          <span className="ico">▧</span> Media Library
        </button>

        <button
          className={`mv-admin__side-link ${activeTab === 'enquiries' ? 'is-active' : ''}`}
          onClick={() => {
            setActiveTab('enquiries')
            setMobileMenuOpen(false)
          }}
        >
          <span className="ico">✉</span> Contact Requests
        </button>

        <button
          className={`mv-admin__side-link ${activeTab === 'seo' ? 'is-active' : ''}`}
          onClick={() => {
            setActiveTab('seo')
            setMobileMenuOpen(false)
          }}
        >
          <span className="ico">⌕</span> SEO Settings
        </button>

        <div className="mv-admin__side-label">System</div>

        <button
          className={`mv-admin__side-link ${activeTab === 'settings' ? 'is-active' : ''}`}
          onClick={() => {
            setActiveTab('settings')
            setMobileMenuOpen(false)
          }}
        >
          <span className="ico">⚙</span> Settings
        </button>

        <div className="mv-admin__side-bottom">
          <Link to="/" className="mv-admin__side-link" title="Return to MAISON VÉRANE public site">
            <span className="ico">↖</span> Return to Maison
          </Link>
          <button
            type="button"
            className="mv-admin__side-link"
            onClick={() => showToast('Demo session: client-side administration mode active.')}
          >
            <span className="ico">⇥</span> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="mv-admin__main">
        {/* Top Header */}
        <header className="mv-admin__top">
          <div className="mv-admin__crumb-bar">
            <button
              className="mv-admin__menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              ☰
            </button>
            <span className="mv-admin__crumb">
              Aéroform Universe / <b>{getPageTitle()}</b>
            </span>
          </div>

          <div className="mv-admin__top-right">
            <Link to="/" className="mv-admin__view-site">
              View Website ↗
            </Link>
            <div className="mv-admin__user">
              <span>Curator</span>
              <span className="mv-admin__avatar">MV</span>
            </div>
          </div>
        </header>

        {/* Dynamic Pages */}
        <div className="mv-admin__content">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="mv-admin__heading">
                <div>
                  <h1>Good evening, Curator</h1>
                  <p>Here’s what’s happening with MAISON VÉRANE Aéroform today.</p>
                </div>
                <button className="mv-admin__btn-primary" onClick={() => openModal('content')}>
                  ＋ Add content
                </button>
              </div>

              {/* Metric Cards */}
              <div className="mv-admin__cards">
                <div className="mv-admin__metric">
                  <div className="mv-admin__metric-top">
                    Total content <span className="mv-admin__metric-icon">▤</span>
                  </div>
                  <strong>{(items.length + watches.length).toString().padStart(2, '0')}</strong>
                  <span className="mv-admin__trend">Across all chapters &amp; timepieces</span>
                </div>

                <div className="mv-admin__metric">
                  <div className="mv-admin__metric-top">
                    Published <span className="mv-admin__metric-icon">✓</span>
                  </div>
                  <strong>{totalPublished.toString().padStart(2, '0')}</strong>
                  <span className="mv-admin__trend">Live content entries</span>
                </div>

                <div className="mv-admin__metric">
                  <div className="mv-admin__metric-top">
                    Drafts <span className="mv-admin__metric-icon">✎</span>
                  </div>
                  <strong>{totalDraft.toString().padStart(2, '0')}</strong>
                  <span style={{ fontSize: 11, color: '#8493a1' }}>Awaiting atelier review</span>
                </div>

                <div className="mv-admin__metric">
                  <div className="mv-admin__metric-top">
                    Media assets <span className="mv-admin__metric-icon">▧</span>
                  </div>
                  <strong>156</strong>
                  <span className="mv-admin__trend">Avif/WebP image pipeline</span>
                </div>
              </div>

              {/* Dashboard 2-col Grid */}
              <div className="mv-admin__dashboard-grid">
                {/* Recent Content */}
                <section className="mv-admin__panel">
                  <div className="mv-admin__panel-head">
                    <h3>Recent content</h3>
                    <button className="mv-admin__btn-secondary" onClick={() => setActiveTab('content')}>
                      View all →
                    </button>
                  </div>
                  <div className="mv-admin__table-wrap">
                    <table className="mv-admin__table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Last updated</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.slice(0, 5).map((x) => (
                          <tr key={x.id}>
                            <td>
                              <b>{x.title}</b>
                              <br />
                              <span style={{ color: '#8a99a8', fontSize: 11 }}>{x.description}</span>
                            </td>
                            <td>{x.type}</td>
                            <td>
                              <span
                                className={`mv-admin__status ${
                                  x.status === 'Draft'
                                    ? 'draft'
                                    : x.status === 'Archived'
                                    ? 'archived'
                                    : ''
                                }`}
                              >
                                {x.status}
                              </span>
                            </td>
                            <td>{x.updated}</td>
                            <td>
                              <div className="mv-admin__actions">
                                <button
                                  className="mv-admin__icon-btn"
                                  onClick={() => openModal('content', x)}
                                  title="Edit"
                                >
                                  ✎
                                </button>
                                <button
                                  className="mv-admin__icon-btn"
                                  onClick={() => toggleStatus(x.id, 'content')}
                                  title="Publish/Draft"
                                >
                                  ⇄
                                </button>
                                <button
                                  className="mv-admin__icon-btn delete"
                                  onClick={() => deleteItem(x.id, 'content', x.title)}
                                  title="Delete"
                                >
                                  ×
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Quick actions */}
                <section className="mv-admin__panel">
                  <div className="mv-admin__panel-head">
                    <h3>Quick actions</h3>
                    <small>Manage atelier website</small>
                  </div>
                  <div className="mv-admin__panel-body">
                    <div className="mv-admin__quick-grid">
                      <button className="mv-admin__quick" onClick={() => openModal('content')}>
                        <span>＋</span>Add new content
                      </button>
                      <button className="mv-admin__quick" onClick={() => setActiveTab('media')}>
                        <span>▧</span>Manage media
                      </button>
                      <button className="mv-admin__quick" onClick={() => setActiveTab('seo')}>
                        <span>⌕</span>SEO settings
                      </button>
                      <button className="mv-admin__quick" onClick={() => setActiveTab('enquiries')}>
                        <span>✉</span>View requests
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              {/* Publishing Checklist */}
              <div className="mv-admin__panel">
                <div className="mv-admin__panel-head">
                  <h3>Publishing checklist</h3>
                  <small>Aéroform status</small>
                </div>
                <div
                  className="mv-admin__panel-body"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 16,
                  }}
                >
                  <div>
                    <span className="mv-admin__status">Ready</span>
                    <p style={{ fontSize: 12, color: '#4a5d6e', margin: '8px 0 0' }}>
                      Content architecture &amp; editorial chapters loaded
                    </p>
                  </div>
                  <div>
                    <span className="mv-admin__status">Active</span>
                    <p style={{ fontSize: 12, color: '#4a5d6e', margin: '8px 0 0' }}>
                      6 Aéroform timepiece references catalogued
                    </p>
                  </div>
                  <div>
                    <span className="mv-admin__status draft">Synchronized</span>
                    <p style={{ fontSize: 12, color: '#4a5d6e', margin: '8px 0 0' }}>
                      Browser local storage reactive state enabled
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CAMPAIGN CONTENT */}
          {activeTab === 'content' && (
            <div>
              <div className="mv-admin__heading">
                <div>
                  <h1>Campaign Content</h1>
                  <p>Manage MAISON VÉRANE Aéroform content and keep it up to date.</p>
                </div>
                <button className="mv-admin__btn-primary" onClick={() => openModal('content')}>
                  ＋ Add content
                </button>
              </div>

              <div className="mv-admin__notice">
                This is a front-end prototype studio. Add, edit, publish and delete actions are saved
                directly in this browser using local storage.
              </div>

              <div className="mv-admin__toolbar">
                <input
                  type="text"
                  className="mv-admin__search"
                  placeholder="Search by title, type or description…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="mv-admin__select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All statuses</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
                <button
                  className="mv-admin__btn-secondary"
                  onClick={() => exportJson(items, 'maison-verane-content.json')}
                >
                  Export JSON ↓
                </button>
              </div>

              <section className="mv-admin__panel">
                <div className="mv-admin__table-wrap">
                  {filteredContent.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#8898a6' }}>
                      No content items match your criteria.
                    </div>
                  ) : (
                    <table className="mv-admin__table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Last updated</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredContent.map((x) => (
                          <tr key={x.id}>
                            <td>
                              <b>{x.title}</b>
                              <br />
                              <span style={{ color: '#8a99a8', fontSize: 11 }}>{x.description}</span>
                            </td>
                            <td>{x.type}</td>
                            <td>
                              <span
                                className={`mv-admin__status ${
                                  x.status === 'Draft'
                                    ? 'draft'
                                    : x.status === 'Archived'
                                    ? 'archived'
                                    : ''
                                }`}
                              >
                                {x.status}
                              </span>
                            </td>
                            <td>{x.updated}</td>
                            <td>
                              <div className="mv-admin__actions">
                                <button
                                  className="mv-admin__icon-btn"
                                  onClick={() => openModal('content', x)}
                                  title="Edit"
                                >
                                  ✎
                                </button>
                                <button
                                  className="mv-admin__icon-btn"
                                  onClick={() => toggleStatus(x.id, 'content')}
                                  title="Publish/Draft"
                                >
                                  ⇄
                                </button>
                                <button
                                  className="mv-admin__icon-btn delete"
                                  onClick={() => deleteItem(x.id, 'content', x.title)}
                                  title="Delete"
                                >
                                  ×
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: WATCH STORIES */}
          {activeTab === 'products' && (
            <div>
              <div className="mv-admin__heading">
                <div>
                  <h1>Watch Stories</h1>
                  <p>Manage timepiece references, calibre stories and case specifications.</p>
                </div>
                <button className="mv-admin__btn-primary" onClick={() => openModal('watches')}>
                  ＋ Add timepiece
                </button>
              </div>

              <div className="mv-admin__toolbar">
                <input
                  type="text"
                  className="mv-admin__search"
                  placeholder="Search by reference, dial or specifications…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="mv-admin__select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All statuses</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
                <button
                  className="mv-admin__btn-secondary"
                  onClick={() => exportJson(watches, 'maison-verane-watches.json')}
                >
                  Export Watches ↓
                </button>
              </div>

              <section className="mv-admin__panel">
                <div className="mv-admin__table-wrap">
                  {filteredWatches.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#8898a6' }}>
                      No watch references found.
                    </div>
                  ) : (
                    <table className="mv-admin__table">
                      <thead>
                        <tr>
                          <th>Timepiece / Reference</th>
                          <th>Edition &amp; Pricing</th>
                          <th>Status</th>
                          <th>Updated</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWatches.map((w) => (
                          <tr key={w.id}>
                            <td>
                              <b>{w.title}</b>
                              <br />
                              <span style={{ color: '#8a99a8', fontSize: 11 }}>{w.description}</span>
                            </td>
                            <td>
                              <span style={{ fontWeight: 600, color: '#1a2c3d' }}>
                                {w.extra || 'Reference Edition'}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`mv-admin__status ${
                                  w.status === 'Draft'
                                    ? 'draft'
                                    : w.status === 'Archived'
                                    ? 'archived'
                                    : ''
                                }`}
                              >
                                {w.status}
                              </span>
                            </td>
                            <td>{w.updated}</td>
                            <td>
                              <div className="mv-admin__actions">
                                <button
                                  className="mv-admin__icon-btn"
                                  onClick={() => openModal('watches', w)}
                                  title="Edit"
                                >
                                  ✎
                                </button>
                                <button
                                  className="mv-admin__icon-btn"
                                  onClick={() => toggleStatus(w.id, 'watches')}
                                  title="Publish/Draft"
                                >
                                  ⇄
                                </button>
                                <button
                                  className="mv-admin__icon-btn delete"
                                  onClick={() => deleteItem(w.id, 'watches', w.title)}
                                  title="Delete"
                                >
                                  ×
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* TAB 4: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div>
              <div className="mv-admin__heading">
                <div>
                  <h1>Media Library</h1>
                  <p>Curated photography, movement schematics and editorial crops for Aéroform.</p>
                </div>
                <button className="mv-admin__btn-primary" onClick={() => openModal('media')}>
                  ＋ Add asset
                </button>
              </div>

              <div className="mv-admin__toolbar">
                <input
                  type="text"
                  className="mv-admin__search"
                  placeholder="Search media assets…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="mv-admin__btn-secondary"
                  onClick={() => exportJson(mediaList, 'maison-verane-media.json')}
                >
                  Export Media List ↓
                </button>
              </div>

              <section className="mv-admin__panel">
                <div className="mv-admin__table-wrap">
                  <table className="mv-admin__table">
                    <thead>
                      <tr>
                        <th>Asset Name</th>
                        <th>Category</th>
                        <th>Path / Reference</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMedia.map((m) => (
                        <tr key={m.id}>
                          <td>
                            <b>{m.title}</b>
                            <br />
                            <span style={{ color: '#8a99a8', fontSize: 11 }}>{m.description}</span>
                          </td>
                          <td>{m.type}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#385068' }}>
                            {m.image}
                          </td>
                          <td>
                            <span className="mv-admin__status">{m.status}</span>
                          </td>
                          <td>
                            <div className="mv-admin__actions">
                              <button
                                className="mv-admin__icon-btn"
                                onClick={() => openModal('media', m)}
                                title="Edit"
                              >
                                ✎
                              </button>
                              <button
                                className="mv-admin__icon-btn delete"
                                onClick={() => deleteItem(m.id, 'media', m.title)}
                                title="Delete"
                              >
                                ×
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* TAB 5: CONTACT REQUESTS & ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div>
              <div className="mv-admin__heading">
                <div>
                  <h1>Contact Requests &amp; Appointments</h1>
                  <p>Private salon viewings, bespoke engraving requests and concierge enquiries.</p>
                </div>
                <button
                  className="mv-admin__btn-secondary"
                  onClick={() => exportJson(enquiries, 'maison-verane-enquiries.json')}
                >
                  Export enquiries ↓
                </button>
              </div>

              <div className="mv-admin__notice">
                Demonstration records illustrate client appointment bookings and correspondence
                submitted through the MAISON VÉRANE site.
              </div>

              <section className="mv-admin__panel">
                <div className="mv-admin__panel-head">
                  <h3>Recent enquiries</h3>
                  <small>{enquiries.length} records</small>
                </div>
                <div className="mv-admin__table-wrap">
                  <table className="mv-admin__table">
                    <thead>
                      <tr>
                        <th>Client Name</th>
                        <th>Contact Email &amp; Phone</th>
                        <th>Interest / Purpose</th>
                        <th>Boutique Salon</th>
                        <th>Received</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.map((enq) => (
                        <tr key={enq.id}>
                          <td>
                            <b>{enq.name}</b>
                          </td>
                          <td>
                            <div>{enq.contact}</div>
                            <span style={{ fontSize: 10, color: '#8a99a8' }}>{enq.phone}</span>
                          </td>
                          <td>{enq.interest}</td>
                          <td>{enq.salon}</td>
                          <td>{enq.received}</td>
                          <td>
                            <button
                              type="button"
                              className={`mv-admin__status ${
                                enq.status === 'In progress'
                                  ? 'draft'
                                  : enq.status === 'Closed'
                                  ? 'archived'
                                  : ''
                              }`}
                              style={{ border: 'none', cursor: 'pointer' }}
                              onClick={() => cycleEnquiryStatus(enq.id)}
                              title="Click to change status"
                            >
                              {enq.status} ⇄
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="mv-admin__icon-btn delete"
                              onClick={() => deleteEnquiry(enq.id, enq.name)}
                              title="Delete enquiry"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* TAB 6: SEO SETTINGS */}
          {activeTab === 'seo' && (
            <div>
              <div className="mv-admin__heading">
                <div>
                  <h1>SEO Settings</h1>
                  <p>Set search appearance, open-graph cards and metadata for MAISON VÉRANE.</p>
                </div>
                <button
                  className="mv-admin__btn-primary"
                  onClick={() => {
                    localStorage.setItem('mv-admin-seo', JSON.stringify(seo))
                    showToast('SEO settings saved successfully.')
                  }}
                >
                  Save settings
                </button>
              </div>

              <section className="mv-admin__panel">
                <div className="mv-admin__panel-head">
                  <h3>Search appearance &amp; Metadata</h3>
                </div>
                <div className="mv-admin__panel-body">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      localStorage.setItem('mv-admin-seo', JSON.stringify(seo))
                      showToast('SEO settings saved.')
                    }}
                    className="mv-admin__form-grid"
                  >
                    <div className="mv-admin__field full">
                      <label>Page Title</label>
                      <input
                        value={seo.pageTitle}
                        onChange={(e) => setSeo({ ...seo, pageTitle: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mv-admin__field full">
                      <label>Meta Description</label>
                      <textarea
                        value={seo.metaDescription}
                        onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="mv-admin__field">
                      <label>Canonical URL</label>
                      <input
                        value={seo.canonicalUrl}
                        onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mv-admin__field">
                      <label>Search Indexing</label>
                      <select
                        value={seo.indexing}
                        onChange={(e) => setSeo({ ...seo, indexing: e.target.value })}
                      >
                        <option>Index, follow</option>
                        <option>No index, follow</option>
                        <option>No index, no follow</option>
                      </select>
                    </div>

                    <div className="mv-admin__field full">
                      <label>Social Sharing Image URL (OpenGraph)</label>
                      <input
                        value={seo.ogImage}
                        onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                        placeholder="/assets/images/hero-wide-1600.webp"
                      />
                    </div>

                    <div className="mv-admin__field full">
                      <button className="mv-admin__btn-primary" type="submit" style={{ alignSelf: 'flex-start' }}>
                        Save SEO settings
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div>
              <div className="mv-admin__heading">
                <div>
                  <h1>Settings</h1>
                  <p>Workspace, atelier branding and publishing configuration.</p>
                </div>
              </div>

              <section className="mv-admin__panel">
                <div className="mv-admin__panel-head">
                  <h3>Workspace details</h3>
                </div>
                <div className="mv-admin__panel-body">
                  <div className="mv-admin__form-grid">
                    <div className="mv-admin__field">
                      <label>Maison Brand Name</label>
                      <input
                        value={settings.brandName}
                        onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                      />
                    </div>

                    <div className="mv-admin__field">
                      <label>Studio / Workspace Name</label>
                      <input
                        value={settings.studioName}
                        onChange={(e) => setSettings({ ...settings, studioName: e.target.value })}
                      />
                    </div>

                    <div className="mv-admin__field">
                      <label>Default Language</label>
                      <select
                        value={settings.defaultLanguage}
                        onChange={(e) =>
                          setSettings({ ...settings, defaultLanguage: e.target.value })
                        }
                      >
                        <option>English (UK)</option>
                        <option>Français (FR)</option>
                        <option>日本語 (JP)</option>
                      </select>
                    </div>

                    <div className="mv-admin__field">
                      <label>Timezone</label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      >
                        <option>Europe/Paris (CET)</option>
                        <option>Europe/London (GMT)</option>
                        <option>Asia/Tokyo (JST)</option>
                        <option>Asia/Kolkata (IST)</option>
                      </select>
                    </div>

                    <div className="mv-admin__field">
                      <label>Publishing Mode</label>
                      <select
                        value={settings.publishingMode}
                        onChange={(e) =>
                          setSettings({ ...settings, publishingMode: e.target.value })
                        }
                      >
                        <option>Draft and publish</option>
                        <option>Immediate publish</option>
                      </select>
                    </div>
                  </div>

                  <div className="mv-admin__notice" style={{ marginTop: 22 }}>
                    Studio Notice: This admin portal manages content state within the MAISON VÉRANE
                    client architecture and local prototype storage.
                  </div>

                  <button
                    className="mv-admin__btn-primary"
                    onClick={() => {
                      localStorage.setItem('mv-admin-settings', JSON.stringify(settings))
                      showToast('Workspace settings saved.')
                    }}
                  >
                    Save settings
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      {/* MODAL FOR ADD / EDIT */}
      {modalOpen && (
        <div className="mv-admin__modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="mv-admin__modal" onClick={(e) => e.stopPropagation()}>
            <div className="mv-admin__modal-head">
              <h3>
                {editingItem
                  ? `Edit ${modalTargetCategory === 'watches' ? 'Watch Story' : 'Content'}`
                  : `Add new ${modalTargetCategory === 'watches' ? 'Watch Story' : 'Content'}`}
              </h3>
              <button
                className="mv-admin__modal-x"
                onClick={() => setModalOpen(false)}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            <div className="mv-admin__modal-body">
              <form onSubmit={handleSaveModal}>
                <div className="mv-admin__form-grid">
                  <div className="mv-admin__field full">
                    <label>Title *</label>
                    <input
                      required
                      value={formValues.title}
                      onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                      placeholder={
                        modalTargetCategory === 'watches'
                          ? 'Aéroform 40 Graphite (Ref. AF·40·GR)'
                          : 'Section / Chapter Title'
                      }
                    />
                  </div>

                  <div className="mv-admin__field">
                    <label>Content Type</label>
                    <select
                      value={formValues.type}
                      onChange={(e) => setFormValues({ ...formValues, type: e.target.value })}
                    >
                      {modalTargetCategory === 'watches' ? (
                        <>
                          <option value="Watch reference">Watch reference</option>
                          <option value="Chronograph">Chronograph</option>
                          <option value="Limited Edition">Limited Edition</option>
                          <option value="Special Order">Special Order</option>
                        </>
                      ) : (
                        <>
                          <option value="Campaign page">Campaign page</option>
                          <option value="Editorial story">Editorial story</option>
                          <option value="Page section">Page section</option>
                          <option value="Article">Article</option>
                          <option value="Form">Form</option>
                          <option value="Media Asset">Media Asset</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="mv-admin__field">
                    <label>Publishing Status</label>
                    <select
                      value={formValues.status}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          status: e.target.value as 'Published' | 'Draft' | 'Archived',
                        })
                      }
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  {modalTargetCategory === 'watches' && (
                    <div className="mv-admin__field full">
                      <label>Pricing &amp; Availability</label>
                      <input
                        value={formValues.extra}
                        onChange={(e) => setFormValues({ ...formValues, extra: e.target.value })}
                        placeholder="e.g. £6,450 · Available in boutique"
                      />
                    </div>
                  )}

                  <div className="mv-admin__field full">
                    <label>Short Description</label>
                    <textarea
                      value={formValues.description}
                      onChange={(e) =>
                        setFormValues({ ...formValues, description: e.target.value })
                      }
                      placeholder="Brief summary of the chapter or piece…"
                      rows={3}
                    />
                  </div>

                  <div className="mv-admin__field full">
                    <label>Media Reference / Image filename</label>
                    <input
                      value={formValues.image}
                      onChange={(e) => setFormValues({ ...formValues, image: e.target.value })}
                      placeholder="e.g. hero-wide-1600.webp or /assets/images/..."
                    />
                  </div>
                </div>

                <div className="mv-admin__form-actions">
                  <button
                    type="button"
                    className="mv-admin__btn-secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="mv-admin__btn-primary">
                    Save content
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="mv-admin__toast" role="status" aria-live="polite">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
