import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { trackEvent } from '../analytics'

function RegisterPage() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/kelola-produk" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await register(name, email, password)
      trackEvent('sign_up', { method: 'email' })
      navigate('/kelola-produk', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Registrasi gagal. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page-section auth-page">
      <div className="container auth-card">
        <p className="eyebrow">Akun baru</p>
        <h1>Daftar</h1>
        <p className="auth-card__lead">Buat akun untuk menambah dan mengubah produk.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Nama
            <input
              type="text"
              autoComplete="name"
              required
              maxLength={80}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            Password (min. 6 karakter)
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="button" disabled={submitting}>
            {submitting ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="auth-card__footer">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage
