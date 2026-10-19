import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import api from '../api'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'

function ProductsPage() {
  const { isAuthenticated } = useAuth()
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const controller = new AbortController()

    api
      .get('/products', { signal: controller.signal })
      .then((response) => {
        setProducts(response.data)
        setStatus('success')
      })
      .catch((error) => {
        if (error.code !== 'ERR_CANCELED') {
          setStatus('error')
        }
      })

    return () => controller.abort()
  }, [])

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading page-heading--row">
          <div>
            <p className="eyebrow">Katalog</p>
            <h1>Daftar Produk</h1>
          </div>
          {isAuthenticated ? (
            <Link className="button" to="/kelola-produk">
              Kelola produk
            </Link>
          ) : (
            <Link className="button button--secondary" to="/login">
              Masuk untuk kelola
            </Link>
          )}
        </div>

        {status === 'loading' && <p className="status">Memuat produk...</p>}
        {status === 'error' && (
          <p className="status status--error">
            Produk gagal dimuat. Pastikan backend dan MongoDB sedang berjalan.
          </p>
        )}
        {status === 'success' && products.length === 0 && (
          <p className="status">Belum ada produk.</p>
        )}
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsPage
