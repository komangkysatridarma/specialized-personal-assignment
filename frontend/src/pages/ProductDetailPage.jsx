import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import api from '../api'

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const controller = new AbortController()

    async function loadProduct() {
      try {
        const response = await api.get(`/products/${id}`, { signal: controller.signal })
        setProduct(response.data)
        setStatus('success')
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          setStatus('error')
        }
      }
    }

    loadProduct()
    return () => controller.abort()
  }, [id])

  if (status === 'loading') {
    return <p className="container status">Memuat detail produk...</p>
  }

  if (status === 'error') {
    return (
      <div className="container status status--error">
        <p>Produk tidak ditemukan atau gagal dimuat.</p>
        <Link to="/products">Kembali ke daftar produk</Link>
      </div>
    )
  }

  return (
    <section className="page-section">
      <div className="container">
        <Link className="back-link" to="/products">← Kembali ke produk</Link>
        <article className="product-detail">
          <img src={product.imageUrl} alt={product.name} />
          <div>
            <span className="category">{product.category}</span>
            <h1>{product.name}</h1>
            <p className="price price--large">{rupiah.format(product.price)}</p>
            <p className="description">{product.description}</p>
            <p>Stok tersedia: <strong>{product.stock}</strong></p>
          </div>
        </article>
      </div>
    </section>
  )
}

export default ProductDetailPage
