# Panduan Deployment TokoKita

Dokumen ini melengkapi tugas Lab 2 (deployment + monitoring). Salin isi ke Word/PDF dan tambahkan screenshot aplikasi serta dashboard Google Analytics.

## 1. Menjalankan aplikasi secara lokal

### Prasyarat

- Node.js 20+
- MongoDB (lokal atau [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) gratis)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET
npm install
npm run seed
npm run dev
```

API: `http://localhost:5000` — health check: `GET /api/health`

### Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

Buka `http://localhost:5173`

### Autentikasi (JWT)

- Registrasi: `/register` → token disimpan di `localStorage` (`tokokita_token`)
- Login: `/login`
- Route terproteksi: `/kelola-produk` (CRUD produk)
- Backend: `POST/PUT/DELETE /api/products` memerlukan header `Authorization: Bearer <token>`

---

## 2. Deploy backend ke Render (disarankan)

Heroku tier gratis sudah tidak tersedia; Render Web Service gratis cocok untuk Express + MongoDB Atlas.

### Langkah 1 — MongoDB Atlas

1. Buat cluster gratis di MongoDB Atlas.
2. Database Access → buat user + password.
3. Network Access → allow `0.0.0.0/0` (untuk demo; production persempit IP).
4. Connect → **Drivers** → salin connection string, ganti `<password>`.

### Langkah 2 — Repository GitHub (satu repo / monorepo)

Gunakan **satu repository** dengan struktur:

```text
TokoKita/          ← root repo GitHub
├── backend/
├── frontend/
├── docs/
└── package.json
```

Render set **Root Directory** = `backend`, Vercel set **Root Directory** = `frontend`. Tidak perlu repo terpisah kecuali dosen meminta.

1. `git init` di folder `TokoKita`, commit, push ke GitHub (`.env` tidak ikut — lihat `.gitignore`).

### Langkah 3 — Web Service di Render

1. [render.com](https://render.com) → **New** → **Web Service**.
2. Connect repo GitHub.
3. Pengaturan:
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Environment Variables**:

   | Key | Contoh |
   |-----|--------|
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/tokokita` |
   | `JWT_SECRET` | string acak panjang (min. 32 karakter) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | URL frontend Vercel (bisa diisi nanti, lalu redeploy) |

5. Deploy → catat URL, mis. `https://tokokita-api.onrender.com`
6. Tes: `https://tokokita-api.onrender.com/api/health`

### Langkah 4 — Seed data (opsional)

Di Render Shell atau lokal dengan `MONGODB_URI` production:

```bash
cd backend
npm run seed
```

---

## 3. Deploy frontend ke Vercel

### Via dashboard

1. [vercel.com](https://vercel.com) → **Add New Project** → import repo GitHub.
2. **Root Directory**: `frontend`
3. **Framework Preset**: Vite
4. **Environment Variables** (Production):

   | Key | Value |
   |-----|--------|
   | `VITE_API_URL` | `https://tokokita-api.onrender.com/api` |
   | `VITE_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` (dari Google Analytics) |

5. Deploy → salin URL, mis. `https://tokokita.vercel.app`

### Via CLI

```bash
npm i -g vercel
cd frontend
vercel login
vercel --prod
```

Set env di Vercel Dashboard → Settings → Environment Variables, lalu redeploy.

### Update CORS backend

Set `CLIENT_URL` di Render ke URL Vercel (tanpa slash di akhir):

```
CLIENT_URL=https://tokokita.vercel.app
```

Jika perlu preview + production:

```
CLIENT_URL=https://tokokita.vercel.app,https://tokokita-xxx.vercel.app
```

Redeploy backend setelah mengubah env.

---

## 4. Google Analytics (monitoring)

1. [analytics.google.com](https://analytics.google.com) → buat **Property** (GA4).
2. **Admin** → **Data Streams** → **Web** → masukkan URL Vercel.
3. Salin **Measurement ID** (`G-...`) → set `VITE_GA_MEASUREMENT_ID` di Vercel → redeploy frontend.
4. Buka situs production, navigasi beberapa halaman.
5. Di GA4: **Reports** → **Realtime** — verifikasi aktivitas (screenshot untuk laporan).

Event kustom: `login`, `sign_up`, plus `page_view` per route (React Router).

---

## 5. Checklist keluaran tugas

- [ ] Login & registrasi berfungsi; JWT di localStorage
- [ ] `/kelola-produk` redirect ke login jika belum auth
- [ ] Link deployment frontend + backend di dokumentasi Word/PDF
- [ ] Screenshot: beranda, katalog, login, kelola produk, GA Realtime
- [ ] Jika deploy gagal: lampirkan `.rar` atau link storage + penjelasan

## 6. Link deployment (isi setelah deploy)

| Komponen | URL |
|----------|-----|
| Frontend (Vercel) | _isi di sini_ |
| Backend (Render) | _isi di sini_ |
| Google Analytics Property | _isi di sini_ |
