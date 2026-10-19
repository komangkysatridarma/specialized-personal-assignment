import 'dotenv/config'
import mongoose from 'mongoose'
import Product from './models/Product.js'

const products = [
  {
    name: 'Tas Kanvas',
    description: 'Tas kanvas ringan dengan ruang yang cukup untuk kebutuhan harian.',
    price: 185000,
    category: 'Aksesori',
    stock: 12,
    imageUrl: 'https://picsum.photos/seed/tas-kanvas/800/600',
  },
  {
    name: 'Botol Minum',
    description: 'Botol minum stainless steel berkapasitas 750 ml.',
    price: 120000,
    category: 'Rumah Tangga',
    stock: 20,
    imageUrl: 'https://picsum.photos/seed/botol-minum/800/600',
  },
  {
    name: 'Lampu Meja',
    description: 'Lampu meja minimalis dengan cahaya hangat untuk ruang kerja.',
    price: 245000,
    category: 'Elektronik',
    stock: 8,
    imageUrl: 'https://picsum.photos/seed/lampu-meja/800/600',
  },
  {
    name: 'Buku Catatan',
    description: 'Buku catatan hardcover dengan 160 halaman bergaris.',
    price: 65000,
    category: 'Alat Tulis',
    stock: 30,
    imageUrl: 'https://picsum.photos/seed/buku-catatan/800/600',
  },
]

async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/tokokita'

  try {
    await mongoose.connect(mongoUri)
    await Product.deleteMany({})
    await Product.insertMany(products)
    console.log(`${products.length} produk berhasil ditambahkan`)
  } catch (error) {
    console.error('Gagal mengisi data awal:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedDatabase()
