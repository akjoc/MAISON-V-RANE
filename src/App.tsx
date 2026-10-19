import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { UIProvider } from './context/UIContext'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'

const CollectionAeroform = lazy(() => import('./pages/CollectionAeroform'))
const Watches = lazy(() => import('./pages/Watches'))
const WatchDetail = lazy(() => import('./pages/WatchDetail'))
const Craftsmanship = lazy(() => import('./pages/Craftsmanship'))
const Watchmaking = lazy(() => import('./pages/Watchmaking'))
const Services = lazy(() => import('./pages/Services'))
const Personalisation = lazy(() => import('./pages/Personalisation'))
const CareRepair = lazy(() => import('./pages/CareRepair'))
const Appointments = lazy(() => import('./pages/Appointments'))
const Boutiques = lazy(() => import('./pages/Boutiques'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Account = lazy(() => import('./pages/Account'))
const Info = lazy(() => import('./pages/Info'))
const Legal = lazy(() => import('./pages/Legal'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Admin = lazy(() => import('./pages/Admin'))

function RouteFallback() {
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }} role="status" aria-live="polite">
      <span className="micro">Loading the maison…</span>
    </div>
  )
}

export function App() {
  return (
    <UIProvider>
      <Routes>
        <Route
          path="admin"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Admin />
            </Suspense>
          }
        />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="collections/aeroform"
            element={
              <Suspense fallback={<RouteFallback />}>
                <CollectionAeroform />
              </Suspense>
            }
          />
          <Route
            path="watches"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Watches />
              </Suspense>
            }
          />
          <Route
            path="watches/:slug"
            element={
              <Suspense fallback={<RouteFallback />}>
                <WatchDetail />
              </Suspense>
            }
          />
          <Route
            path="craftsmanship"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Craftsmanship />
              </Suspense>
            }
          />
          <Route
            path="watchmaking"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Watchmaking />
              </Suspense>
            }
          />
          <Route
            path="services"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Services />
              </Suspense>
            }
          />
          <Route
            path="services/personalisation"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Personalisation />
              </Suspense>
            }
          />
          <Route
            path="services/care-repair"
            element={
              <Suspense fallback={<RouteFallback />}>
                <CareRepair />
              </Suspense>
            }
          />
          <Route
            path="appointments"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Appointments />
              </Suspense>
            }
          />
          <Route
            path="boutiques"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Boutiques />
              </Suspense>
            }
          />
          <Route
            path="search"
            element={
              <Suspense fallback={<RouteFallback />}>
                <SearchPage />
              </Suspense>
            }
          />
          <Route
            path="wishlist"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Wishlist />
              </Suspense>
            }
          />
          <Route
            path="cart"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Cart />
              </Suspense>
            }
          />
          <Route
            path="checkout"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Checkout />
              </Suspense>
            }
          />
          <Route
            path="account"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Account />
              </Suspense>
            }
          />
          <Route
            path="client-care"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Info page="client-care" />
              </Suspense>
            }
          />
          <Route
            path="faq"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Info page="faq" />
              </Suspense>
            }
          />
          <Route
            path="contact"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Info page="contact" />
              </Suspense>
            }
          />
          <Route
            path="shipping-returns"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Info page="shipping-returns" />
              </Suspense>
            }
          />
          <Route
            path="about"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Info page="about" />
              </Suspense>
            }
          />
          <Route
            path="legal/:section"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Legal />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<RouteFallback />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </UIProvider>
  )
}
