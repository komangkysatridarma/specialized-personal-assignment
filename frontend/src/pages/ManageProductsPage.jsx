import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import api from '../api'
import ConfirmModal from '../components/ConfirmModal'
import FormModal from '../components/FormModal'
import ProductCard from '../components/ProductCard'
import ProductForm from '../components/ProductForm'
import { useToast } from '../context/ToastContext'

function ManageProductsPage() {
  const { showToast } = useToast()
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [formState, setFormState] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const isCreate = formState === 'create'
  const editingProduct = formState && formState !== 'create' ? formState : null

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

  async function refreshProducts() {
    const response = await api.get('/products')
    setProducts(response.data)
    setStatus('success')
  }

  function closeForm() {
    if (submitting) {
      return
    }
    setFormState(null)
    setFormError('')
  }

  function getFormErrorMessage(error, fallback) {
    return (
      error.response?.data?.message ??
      error.response?.data?.errors?.join(', ') ??
      fallback
    )
  }

  async function handleCreate(payload) {
    setSubmitting(true)
    setFormError('')
    try {
      await api.post('/products', payload)
      closeForm()
      await refreshProducts()
      showToast('Produk berhasil ditambahkan.')
    } catch (error) {
      setFormError(getFormErrorMessage(error, 'Gagal menambahkan produk.'))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(payload) {
    setSubmitting(true)
    setFormError('')
    try {
      await api.put(`/products/${editingProduct._id}`, payload)
      closeForm()
      await refreshProducts()
      showToast('Produk berhasil diperbarui.')
    } catch (error) {
      setFormError(getFormErrorMessage(error, 'Gagal memperbarui produk.'))
    } finally {
      setSubmitting(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return
    }

    setDeleting(true)
    try {
      await api.delete(`/products/${deleteTarget._id}`)
      setProducts((prev) => prev.filter((item) => item._id !== deleteTarget._id))
      if (editingProduct?._id === deleteTarget._id) {
        closeForm()
      }
      setDeleteTarget(null)
      showToast('Produk berhasil dihapus.')
    } catch {
      showToast('Gagal menghapus produk.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading page-heading--row">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Kelola Produk</h1>
            <p className="form-hint">Halaman ini dilindungi JWT — hanya pengguna login.</p>
          </div>
          <button type="button" className="button" onClick={() => setFormState('create')}>
            Tambah produk
          </button>
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
            <ProductCard
              key={product._id}
              product={product}
              onEdit={setFormState}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
        <p className="form-hint" style={{ marginTop: '2rem' }}>
          <Link to="/products">← Kembali ke katalog publik</Link>
        </p>
      </div>

      <FormModal open={formState !== null} onClose={closeForm}>
        {isCreate && (
          <ProductForm
            key="create"
            onSubmit={handleCreate}
            onCancel={closeForm}
            submitting={submitting}
            error={formError}
          />
        )}
        {editingProduct && (
          <ProductForm
            key={editingProduct._id}
            product={editingProduct}
            onSubmit={handleUpdate}
            onCancel={closeForm}
            submitting={submitting}
            error={formError}
          />
        )}
      </FormModal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus produk?"
        message={
          deleteTarget
            ? `"${deleteTarget.name}" akan dihapus permanen dari katalog.`
            : ''
        }
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </section>
  )
}

export default ManageProductsPage
