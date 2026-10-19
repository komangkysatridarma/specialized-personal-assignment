import mongoose from 'mongoose'
import { AppError } from '../errors/AppError.js'
import Product from '../models/Product.js'

function assertValidId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('ID produk tidak valid', 400)
  }
}

export async function getAllProducts() {
  return Product.find().sort({ createdAt: -1 })
}

export async function getProductById(id) {
  assertValidId(id)

  const product = await Product.findById(id)
  if (!product) {
    throw new AppError('Produk tidak ditemukan', 404)
  }

  return product
}

export async function createProduct(data) {
  return Product.create(data)
}

export async function updateProduct(id, data) {
  assertValidId(id)

  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })

  if (!product) {
    throw new AppError('Produk tidak ditemukan', 404)
  }

  return product
}

export async function deleteProduct(id) {
  assertValidId(id)

  const product = await Product.findByIdAndDelete(id)
  if (!product) {
    throw new AppError('Produk tidak ditemukan', 404)
  }
}
