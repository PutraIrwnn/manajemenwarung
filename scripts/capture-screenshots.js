import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? 'http://127.0.0.1:5173';
const OUT_DIR = path.resolve('docs/screenshots');
const VIEWPORT = { width: 1440, height: 900 };

const expectedFiles = [
  '01-login.png',
  '02-beranda-admin.png',
  '03-kasir-kosong.png',
  '04-kasir-transaksi-tunai.png',
  '05-struk-transaksi.png',
  '06-barang-stok.png',
  '07-catatan-utang.png',
  '08-modal-cicilan-utang.png',
  '09-laporan-penjualan.png',
  '10-transaksi-terakhir.png',
  '11-dashboard-kasir.png',
  '12-menu-kasir.png',
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function isServerReady() {
  try {
    const response = await fetch(BASE_URL);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (await isServerReady()) return;
    await sleep(500);
  }
  throw new Error(`Dev server tidak merespons di ${BASE_URL}`);
}

async function ensureServer() {
  if (await isServerReady()) return null;

  const child = spawn(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['run', 'dev', '--', '--port', '5173'],
    {
      cwd: process.cwd(),
      env: { ...process.env, BROWSER: 'none' },
      shell: false,
      stdio: 'inherit',
    },
  );

  await waitForServer();
  return child;
}

async function stable(page) {
  await page.waitForLoadState('domcontentloaded');
  await sleep(500);
}

async function screenshot(page, fileName) {
  await stable(page);
  await page.screenshot({
    path: path.join(OUT_DIR, fileName),
    fullPage: false,
  });
  console.log(`saved ${fileName}`);
}

async function login(page, role = 'Admin') {
  await page.goto(BASE_URL);
  await stable(page);
  await page.getByRole('button', { name: new RegExp(`^${role}`) }).click();
  await page.getByRole('button', { name: 'Masuk' }).click();
  await stable(page);
}

async function go(page, name) {
  await page.getByRole('button', { name, exact: true }).click();
  await stable(page);
}

async function addProduct(page, name) {
  await page.getByRole('button', { name: new RegExp(name) }).click();
  await sleep(250);
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const ownedServer = await ensureServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: VIEWPORT });

  try {
    await page.goto(BASE_URL);
    await screenshot(page, '01-login.png');

    await login(page, 'Admin');
    await page.getByText('Selamat datang, Uti').waitFor();
    await screenshot(page, '02-beranda-admin.png');

    await go(page, 'Kasir / Mulai Jualan');
    await page.getByText('Belum ada barang dipilih').waitFor();
    await screenshot(page, '03-kasir-kosong.png');

    await addProduct(page, 'Indomie Goreng');
    await addProduct(page, 'Aqua 600 ml');
    await addProduct(page, 'Kopi Kapal Api Sachet');
    await page.getByRole('button', { name: 'Tunai' }).click();
    await screenshot(page, '04-kasir-transaksi-tunai.png');

    await page.getByRole('button', { name: 'Simpan Transaksi' }).click();
    await page.getByText('WARUNG UTI AZZAM', { exact: true }).waitFor();
    await screenshot(page, '05-struk-transaksi.png');
    await page.getByRole('button', { name: 'Tutup', exact: true }).click();
    await stable(page);

    await go(page, 'Barang & Stok');
    await page.getByText('Barang Mendekati Kadaluarsa').waitFor();
    await screenshot(page, '06-barang-stok.png');

    await go(page, 'Catatan Utang');
    await page.getByText('Catat pelanggan yang belum melunasi pembayaran.').waitFor();
    await screenshot(page, '07-catatan-utang.png');

    await page.getByRole('button', { name: 'Bayar Cicilan' }).first().click();
    await page.getByPlaceholder('Contoh: 20000').fill('20000');
    await page.getByText('Sisa utang saat ini').waitFor();
    await screenshot(page, '08-modal-cicilan-utang.png');
    await page.getByRole('button', { name: 'Tutup', exact: true }).click();
    await stable(page);

    await go(page, 'Laporan Penjualan');
    await page.getByText('Laporan ini membantu melihat hasil penjualan hari ini.').waitFor();
    await screenshot(page, '09-laporan-penjualan.png');

    await go(page, 'Transaksi Terakhir');
    await page.getByText('Daftar Transaksi').waitFor();
    await screenshot(page, '10-transaksi-terakhir.png');

    await login(page, 'Kasir');
    await page.getByRole('heading', { name: 'Kasir / Mulai Jualan' }).waitFor();
    await screenshot(page, '11-dashboard-kasir.png');

    await page.getByRole('button', { name: 'Catatan Utang' }).waitFor();
    await screenshot(page, '12-menu-kasir.png');

    const savedFiles = await fs.readdir(OUT_DIR);
    const missing = expectedFiles.filter((fileName) => !savedFiles.includes(fileName));
    if (missing.length > 0) {
      throw new Error(`Screenshot belum lengkap: ${missing.join(', ')}`);
    }

    console.log(`\nSelesai. ${expectedFiles.length} screenshot tersimpan di ${OUT_DIR}`);
  } finally {
    await browser.close();
    if (ownedServer) ownedServer.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
