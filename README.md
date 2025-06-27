# Toko KyuRyu - Sistem Point of Sale (POS)

## Deskripsi Website

Toko KyuRyu adalah sistem Point of Sale (POS) yang komprehensif yang dirancang untuk mempermudah operasi ritel. Sistem ini menampilkan dashboard admin berbasis React yang modern dan responsif untuk mengelola transaksi penjualan, transaksi penerimaan, inventaris produk, data pelanggan, manajemen pengguna, dan laporan terperinci. API backend dibangun dengan Node.js dan Express.js, terhubung ke database MySQL untuk penyimpanan dan pengelolaan data yang andal.

## Source Code

Source code proyek ini dapat diakses melalui repositori GitHub: [https://github.com/Flmori/pos.git]

## Teknologi yang Digunakan dan Plugin

### Frontend

- **React 18** - Perpustakaan UI untuk membangun antarmuka pengguna
- **Material UI (MUI)** - Komponen React untuk pengembangan web yang lebih cepat dan mudah
  - @mui/material, @mui/icons-material, @mui/lab, @mui/utils
- **Redux Toolkit & React-Redux** - Manajemen state
- **React Router v6** - Routing dan navigasi
- **Vite** - Alat build dan server pengembangan
- **Emotion** - Perpustakaan styling CSS-in-JS
- **ApexCharts & react-apexcharts** - Grafik dan chart interaktif
- **Formik & Yup** - Penanganan dan validasi form
- **Axios** - Klien HTTP untuk permintaan API
- **Framer Motion** - Animasi
- **React Perfect Scrollbar** - Scrollbar kustom
- **File Saver, html2canvas, jsPDF** - Ekspor dan penyimpanan laporan sebagai file

### Backend

- **Node.js** - Lingkungan runtime JavaScript
- **Express.js** - Framework web untuk membangun RESTful API
- **MySQL** - Sistem manajemen basis data relasional
- **Sequelize** - ORM untuk interaksi database MySQL
- **bcryptjs** - Hashing password
- **cors** - Middleware Cross-Origin Resource Sharing
- **dotenv** - Manajemen variabel lingkungan
- **nodemon** (dev) - Auto-restart server saat pengembangan

## Kebutuhan Teknologi

- Node.js (versi 16 atau lebih tinggi direkomendasikan)
- Server MySQL terpasang dan berjalan
- Yarn atau npm sebagai package manager

## Instruksi Instalasi

### Setup Backend

1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Konfigurasikan koneksi database MySQL di `backend/config/config.json` atau variabel lingkungan.
4. Jalankan migrasi dan seeder database jika diperlukan.
5. Jalankan server backend:
   ```bash
   npm run dev
   ```
   atau
   ```bash
   npm start
   ```

### Setup Frontend

1. Masuk ke direktori frontend:
   ```bash
   cd react-admin-template
   ```
2. Install dependencies:
   ```bash
   yarn
   ```
   atau
   ```bash
   npm install
   ```
3. Jalankan server pengembangan:
   ```bash
   yarn start
   ```
   atau
   ```bash
   npm run start
   ```
4. Buka browser dan akses `http://localhost:3000` (atau port yang ditampilkan di terminal).

## Fitur

- Manajemen Transaksi Penjualan
- Manajemen Transaksi Penerimaan
- Manajemen Inventaris Produk
- Manajemen Pelanggan
- Manajemen Pengguna dan Kontrol Akses Berbasis Peran
- Laporan dan Analitik Terperinci
  - Laporan Penjualan
  - Laporan Stok
  - Laporan Pelanggan
  - Laporan Transaksi Penerimaan
- Ekspor laporan ke format PDF dan Excel
- Antarmuka responsif dan ramah pengguna dengan Material UI
- Validasi form dan penanganan error
- Autentikasi dan manajemen password yang aman

---

Proyek ini menyediakan solusi full-stack untuk kebutuhan POS ritel, menggabungkan API backend yang kuat dengan dashboard frontend yang elegan dan fungsional.

## Lisensi

Perangkat lunak ini (Proyek Point Of Sales Toko KyuRyu) dilisensikan di bawah
Bintang Putra Nagari [https://www.instagram.com/bin_mori/].
Penggunaan, modifikasi, dan distribusi proyek ini tunduk pada
persyaratan yang diuraikan dalam file `LICENSE.txt` yang disertakan.

Bagian dari kode frontend proyek ini didasarkan pada template React yang awalnya
berlisensi MIT. Pemberitahuan hak cipta dan izin dari template asli
tercantum dalam `react-admin-template\LICENSE`.
