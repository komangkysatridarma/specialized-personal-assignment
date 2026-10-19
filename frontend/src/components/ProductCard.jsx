import { Link } from 'react-router'

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

function ProductCard({ product, onEdit, onDelete }) {
  return (
    <article className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <div className="product-card__body">
        <div className="product-card__top">
          <span className="category">{product.category}</span>
          <span className="product-card__stock">Stok: {product.stock}</span>
        </div>
        <h2>{product.name}</h2>
        <p className="price">{rupiah.format(product.price)}</p>
        <div className="product-card__actions">
          <Link className="button button--secondary" to={`/products/${product._id}`}>
            Lihat detail
          </Link>
          {onEdit && (
            <button type="button" className="button button--secondary" onClick={() => onEdit(product)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="button button--danger"
              onClick={() => onDelete(product)}
            >
              Hapus
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProductCard
