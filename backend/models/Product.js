import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama produk wajib diisi'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Deskripsi produk wajib diisi'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Harga produk wajib diisi'],
      min: [0, 'Harga tidak boleh negatif'],
    },
    category: {
      type: String,
      required: [true, 'Kategori produk wajib diisi'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stok produk wajib diisi'],
      min: [0, 'Stok tidak boleh negatif'],
      default: 0,
    },
    imageUrl: {
      type: String,
      required: [true, 'URL gambar wajib diisi'],
      trim: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Product', productSchema)
