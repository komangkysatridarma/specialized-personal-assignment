import jwt from 'jsonwebtoken'
import { AppError } from '../errors/AppError.js'
import User from '../models/User.js'

export function authenticate(request, _response, next) {
  const header = request.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Token autentikasi tidak ditemukan', 401))
  }

  const token = header.slice(7)
  const secret = process.env.JWT_SECRET

  if (!secret) {
    return next(new AppError('Konfigurasi JWT belum diset', 500))
  }

  try {
    const payload = jwt.verify(token, secret)
    request.user = { id: payload.sub, email: payload.email }
    next()
  } catch {
    next(new AppError('Token tidak valid atau sudah kedaluwarsa', 401))
  }
}

export async function loadUser(request, _response, next) {
  try {
    const user = await User.findById(request.user.id).select('name email')
    if (!user) {
      return next(new AppError('Pengguna tidak ditemukan', 401))
    }
    request.user = user
    next()
  } catch (error) {
    next(error)
  }
}
