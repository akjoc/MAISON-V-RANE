import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { StoreProvider } from './context/StoreContext'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/pages.css'
import { syncMotion } from './lib/motionPrefs'

syncMotion()

/**
 * GitHub Pages serves the site from a subpath, so the router has to know it.
 * `BASE_URL` is '/' in development and '/MAISON-V-RANE/' in the Pages build;
 * react-router wants the basename without a trailing slash (or none at all).
 */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
