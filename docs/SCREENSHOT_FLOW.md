# Screenshot Flow Prototype

Dokumentasi screenshot untuk prototype web **Sistem Informasi Manajemen Warung Uti Azzam**.

| File | Halaman | Penjelasan fungsi halaman |
|---|---|---|
| `01-login.png` | Login | Form masuk dummy dengan username, password, dan pilihan role Admin/Kasir. |
| `02-beranda-admin.png` | Beranda Admin | Ringkasan penjualan, stok, utang, shortcut aksi utama, dan akses cepat transaksi. |
| `03-kasir-kosong.png` | Kasir kosong | Tampilan awal kasir sebelum barang dipilih, dengan keranjang kosong. |
| `04-kasir-transaksi-tunai.png` | Kasir transaksi tunai | Simulasi barang masuk keranjang dan metode pembayaran Tunai. |
| `05-struk-transaksi.png` | Struk transaksi | Modal struk setelah transaksi berhasil disimpan. |
| `06-barang-stok.png` | Barang & Stok | Daftar barang, harga, stok, status restok, dan informasi kadaluarsa. |
| `07-catatan-utang.png` | Catatan Utang | Daftar pelanggan yang memiliki utang, sisa utang, status, dan riwayat pembayaran. |
| `08-modal-cicilan-utang.png` | Modal cicilan utang | Form pembayaran sebagian utang dengan informasi total, sisa, dan progress. |
| `09-laporan-penjualan.png` | Laporan Penjualan | Grafik dan ringkasan penjualan harian/bulanan. |
| `10-transaksi-terakhir.png` | Transaksi Terakhir | Riwayat transaksi terakhir dari kasir. |
| `11-dashboard-kasir.png` | Dashboard Kasir | Tampilan awal setelah login sebagai Kasir dengan fitur yang lebih sederhana. |
| `12-menu-kasir.png` | Sidebar Kasir | Drawer/menu Kasir yang hanya berisi Kasir, Catatan Utang, dan Transaksi Terakhir. |

## Cara Menjalankan Ulang

```powershell
npm.cmd run screenshots
```

Script akan membuka aplikasi dengan viewport desktop `1440x900`, menjalankan flow utama, lalu menyimpan file PNG ke folder `docs/screenshots`.
