import { useState } from 'react'

const CATEGORIES = ['Aksesori', 'Rumah Tangga', 'Elektronik', 'Alat Tulis', 'Fashion', 'Olahraga']

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
}

function randomImageUrl(seedBase) {
  const seed = `${seedBase}-${Date.now()}`
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`
}

function toFormState(product) {
  if (!product) {
    return emptyForm
  }

  return {
    name: product.name,
    description: product.description,
    price: String(product.price),
    category: product.category,
    stock: String(product.stock),
  }
}

function ProductForm({ product, onSubmit, onCancel, submitting, error }) {
  const isEdit = Boolean(product)
  const [form, setForm] = useState(() => toFormState(product))

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handlePriceChange(event) {
    const digits = event.target.value.replace(/\D/g, '')
    setForm((prev) => ({ ...prev, price: digits }))
  }

  const priceLabel = form.price ? rupiah.format(Number(form.price)) : ''

  function handleSubmit(event) {
    event.preventDefault()
    const name = form.name.trim()
    const payload = {
      name,
      description: form.description.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
    }

    if (isEdit) {
      onSubmit({ ...payload, imageUrl: product.imageUrl })
    } else {
      onSubmit({ ...payload, imageUrl: randomImageUrl(name || 'produk') })
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Edit produk' : 'Tambah produk'}</h2>
      {error && <p className="form-error">{error}</p>}
      <label>
        Nama
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Deskripsi
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} required />
      </label>
      <div className="product-form__row">
        <label>
          Harga
          <input
            name="price"
            type="text"
            inputMode="numeric"
            placeholder="Contoh: 185000"
            value={priceLabel}
            onChange={handlePriceChange}
            required
          />
        </label>
        <label>
          Stok
          <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
        </label>
      </div>
      <label>
        Kategori
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Pilih kategori</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
      {!isEdit && (
        <p className="form-hint">Gambar produk akan diisi otomatis (acak dari Picsum).</p>
      )}
      <div className="product-form__actions">
        <button type="button" className="button button--secondary" onClick={onCancel} disabled={submitting}>
          Batal
        </button>
        <button type="submit" className="button" disabled={submitting || !form.price}>
          {submitting ? 'Menyimpan...' : isEdit ? 'Simpan perubahan' : 'Simpan produk'}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
