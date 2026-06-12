import { useEffect, useMemo, useState } from 'react';
import { AppShell } from './components/AppShell.jsx';
import { Toast } from './components/Toast.jsx';
import { initialDebts, initialProducts, initialTransactions } from './data/dummyData.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { DebtsPage } from './pages/DebtsPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { PosPage } from './pages/PosPage.jsx';
import { ProductsPage } from './pages/ProductsPage.jsx';
import { ReportsPage } from './pages/ReportsPage.jsx';
import { SessionsPage } from './pages/SessionsPage.jsx';
import { TransactionsPage } from './pages/TransactionsPage.jsx';
import {
  getDebtRemaining,
  getNowTimestamp,
  getTodayDate,
  makeDebtId,
  makeProductId,
  makeTransactionId,
} from './utils/formatters.js';

const pageAccess = {
  dashboard: ['Admin'],
  pos: ['Admin', 'Kasir'],
  products: ['Admin'],
  debts: ['Admin', 'Kasir'],
  sessions: ['Admin'],
  reports: ['Admin'],
  transactions: ['Admin', 'Kasir'],
};

export default function App() {
  const [role, setRole] = useLocalStorage('warung-role', null);
  const [activePage, setActivePage] = useLocalStorage('warung-page', 'dashboard');
  const [products, setProducts] = useLocalStorage('warung-products-v2', initialProducts);
  const [debts, setDebts] = useLocalStorage('warung-debts', initialDebts);
  const [transactions, setTransactions] = useLocalStorage('warung-transactions', initialTransactions);
  const [shift, setShift] = useLocalStorage('warung-shift', null);
  const [sessions, setSessions] = useLocalStorage('warung-sessions', []);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timeoutId = window.setTimeout(() => setToastMessage(''), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const showToast = (message) => {
    setToastMessage(message);
  };

  const safeActivePage = useMemo(() => {
    if (!role) return activePage;
    return pageAccess[activePage]?.includes(role) ? activePage : role === 'Admin' ? 'dashboard' : 'pos';
  }, [activePage, role]);

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setActivePage(selectedRole === 'Admin' ? 'dashboard' : 'pos');
    showToast(`Login berhasil sebagai ${selectedRole}`);
  };

  const handleLogout = () => {
    setRole(null);
    setActivePage('dashboard');
  };

  const handleNavigate = (page) => {
    if (!role || !pageAccess[page]?.includes(role)) return;
    setActivePage(page);
  };

  // === CRUD Produk ===

  const handleAddProduct = (productData) => {
    const newProduct = {
      id: makeProductId(products.length),
      ...productData,
    };
    setProducts((current) => [...current, newProduct]);
    showToast(`${productData.name} berhasil ditambahkan`);
  };

  const handleUpdateProduct = (productId, productData) => {
    setProducts((current) =>
      current.map((p) => (p.id === productId ? { ...p, ...productData } : p)),
    );
    showToast('Produk berhasil diperbarui');
  };

  const handleDeleteProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    setProducts((current) => current.filter((p) => p.id !== productId));
    showToast(`${product?.name ?? 'Produk'} berhasil dihapus`);
  };

  // === Transaksi ===

  const handleCheckout = ({ cart, customerName, customerPhone, paymentMethod, total }) => {
    const transaction = {
      id: makeTransactionId(transactions.length),
      cashier: role ?? 'Kasir',
      customer: customerName,
      date: getNowTimestamp(),
      method: paymentMethod,
      total,
      items: cart.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.sellPrice,
      })),
    };

    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id);
        if (!cartItem) return product;
        return { ...product, stock: Math.max(0, product.stock - cartItem.qty) };
      }),
    );

    setTransactions((currentTransactions) => [transaction, ...currentTransactions]);

    if (paymentMethod === 'Utang') {
      const debt = {
        id: makeDebtId(debts.length),
        customer: customerName,
        amount: total,
        originalAmount: total,
        remainingAmount: total,
        phone: customerPhone,
        date: getTodayDate(),
        status: 'Belum Lunas',
        note: cart.map((item) => item.name).join(', '),
        payments: [],
      };
      setDebts((currentDebts) => [debt, ...currentDebts]);
    }

    showToast('Transaksi berhasil disimpan');

    return transaction;
  };

  // === Pembayaran Utang ===

  const handlePayDebt = (debtId, paymentAmount) => {
    setDebts((currentDebts) =>
      currentDebts.map((debt) => {
        if (debt.id !== debtId) return debt;

        const remaining = getDebtRemaining(debt);
        const paidNow = Math.min(paymentAmount, remaining);
        const nextRemaining = Math.max(0, remaining - paidNow);

        return {
          ...debt,
          remainingAmount: nextRemaining,
          status: nextRemaining === 0 ? 'Lunas' : 'Belum Lunas',
          payments: [
            ...(debt.payments ?? []),
            {
              date: getTodayDate(),
              amount: paidNow,
            },
          ],
        };
      }),
    );
    showToast('Pembayaran berhasil dicatat');
  };

  if (!role) {
    return (
      <>
        <Toast message={toastMessage} />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  const pages = {
    dashboard: (
      <DashboardPage
        debts={debts}
        onNavigate={handleNavigate}
        products={products}
        transactions={transactions}
      />
    ),
    pos: (
      <PosPage
        onCheckout={handleCheckout}
        onEndShift={() => {
          const endTime = getNowTimestamp();
          setSessions((prev) => [{ startTime: shift.startTime, endTime }, ...prev]);
          setShift(null);
          showToast('Sesi kasir telah ditutup');
        }}
        onStartShift={() => setShift({ startTime: getNowTimestamp() })}
        onToast={showToast}
        products={products}
        shift={shift}
      />
    ),
    products: (
      <ProductsPage
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onToast={showToast}
        onUpdateProduct={handleUpdateProduct}
        products={products}
      />
    ),
    debts: <DebtsPage debts={debts} onPayDebt={handlePayDebt} />,
    reports: <ReportsPage transactions={transactions} />,
    sessions: <SessionsPage sessions={sessions} />,
    transactions: <TransactionsPage debts={debts} transactions={transactions} />,
  };

  return (
    <>
      <Toast message={toastMessage} />
      <AppShell
        activePage={safeActivePage}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        role={role}
      >
        {pages[safeActivePage]}
      </AppShell>
    </>
  );
}
