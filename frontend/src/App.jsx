import { NavLink, Route, Routes } from 'react-router'
import AnalyticsRouteTracker from './components/AnalyticsRouteTracker'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ManageProductsPage from './pages/ManageProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductsPage from './pages/ProductsPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <>
      <AnalyticsRouteTracker />
      <header className="site-header">
        <div className="container nav">
          <NavLink className="brand" to="/">
            TokoKita
          </NavLink>
          <nav aria-label="Navigasi utama">
            <NavLink to="/">Beranda</NavLink>
            <NavLink to="/products">Produk</NavLink>
            {isAuthenticated && <NavLink to="/kelola-produk">Kelola</NavLink>}
            {isAuthenticated ? (
              <>
                <span className="nav-user" title={user.email}>
                  {user.name}
                </span>
                <button type="button" className="nav-button" onClick={logout}>
                  Keluar
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Masuk</NavLink>
                <NavLink to="/register">Daftar</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/kelola-produk"
            element={
              <ProtectedRoute>
                <ManageProductsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<p className="container status">Halaman tidak ditemukan.</p>} />
        </Routes>
      </main>

      <footer>
        <div className="container">© 2026 TokoKita</div>
      </footer>
    </>
  )
}

export default App
