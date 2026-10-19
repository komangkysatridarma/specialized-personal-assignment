import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { trackEvent } from '../analytics'

function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from ?? '/kelola-produk'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await login(email, password)
      trackEvent('login', { method: 'email' })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gagal masuk. Periksa email dan password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page-section auth-page">
      <div className="container auth-card">
        <p className="eyebrow">Akun</p>
        <h1>Masuk</h1>
        <p className="auth-card__lead">Kelola katalog produk setelah login.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
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
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="button" disabled={submitting}>
            {submitting ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="auth-card__footer">
          Belum punya akun? <Link to="/register">Daftar</Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage
