export const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

export const formatShortDate = (value) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

export const formatCompactCurrency = (value) => {
  if (value >= 1000000) return `Rp ${Math.round(value / 1000000)}jt`;
  if (value >= 1000) return `Rp ${Math.round(value / 1000)}rb`;
  return formatCurrency(value);
};

/**
 * Hitung selisih hari dari hari ini ke tanggal target.
 * Menggunakan tanggal real (bukan hardcoded).
 */
export const getDaysUntil = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateString}T00:00:00`);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

export const getExpiryStatus = (dateString) => {
  const days = getDaysUntil(dateString);

  if (days <= 14) {
    return { label: 'Segera cek', tone: 'danger' };
  }

  if (days <= 45) {
    return { label: 'Hampir expired', tone: 'warning' };
  }

  return { label: 'Aman', tone: 'success' };
};

export const makeTransactionId = (count) => `TRX-${String(1008 + count).padStart(4, '0')}`;

export const makeDebtId = (count) => `UTG-${String(5 + count).padStart(3, '0')}`;

export const makeProductId = (count) => `PRD-${String(13 + count).padStart(3, '0')}`;

export const getDebtOriginal = (debt) => debt.originalAmount ?? debt.amount;

export const getDebtRemaining = (debt) => {
  if (typeof debt.remainingAmount === 'number') return debt.remainingAmount;
  return debt.status === 'Lunas' ? 0 : debt.amount;
};

export const getDebtPaid = (debt) => Math.max(0, getDebtOriginal(debt) - getDebtRemaining(debt));

export const getStockTone = (stock) => {
  if (stock <= 4) return 'danger';
  if (stock <= 8) return 'warning';
  return 'success';
};

/**
 * Menghasilkan timestamp real saat ini dalam format 'YYYY-MM-DD HH:mm'.
 */
export const getNowTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

/**
 * Menghasilkan tanggal hari ini dalam format 'YYYY-MM-DD'.
 */
export const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format tanggal lengkap dalam bahasa Indonesia untuk header dashboard.
 * Contoh: "Selasa, 10 Juni 2026"
 */
export const formatFullDate = (date = new Date()) =>
  new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
