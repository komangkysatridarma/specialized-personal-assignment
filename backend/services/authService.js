import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppError } from '../errors/AppError.js'
import User from '../models/User.js'

const SALT_ROUNDS = 10

function signToken(user) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new AppError('Konfigurasi JWT belum diset', 500)
  }

  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d'

  return jwt.sign({ email: user.email }, secret, {
    subject: String(user._id),
    expiresIn,
  })
}

export async function registerUser({ name, email, password }) {
  if (!password || password.length < 6) {
    throw new AppError('Password minimal 6 karakter', 400)
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    throw new AppError('Email sudah terdaftar', 409)
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await User.create({ name, email, passwordHash })

  return {
    token: signToken(user),
    user: { id: user._id, name: user.name, email: user.email },
  }
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash')
  if (!user) {
    throw new AppError('Email atau password salah', 401)
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    throw new AppError('Email atau password salah', 401)
  }

  return {
    token: signToken(user),
    user: { id: user._id, name: user.name, email: user.email },
  }
}

export async function getProfile(userId) {
  const user = await User.findById(userId).select('name email')
  if (!user) {
    throw new AppError('Pengguna tidak ditemukan', 404)
  }
  return { id: user._id, name: user.name, email: user.email }
}
