import { Link } from 'react-router'

function HomePage() {
  return (
    <section className="hero">
      <div className="container hero__content">
        <p className="eyebrow">Belanja sederhana</p>
        <h1>Produk pilihan untuk kebutuhan sehari-hari.</h1>
        <p>
          Temukan produk dengan harga yang jelas dan informasi yang mudah dibaca.
        </p>
        <Link className="button" to="/products">Lihat produk</Link>
      </div>
    </section>
  )
}

export default HomePage
