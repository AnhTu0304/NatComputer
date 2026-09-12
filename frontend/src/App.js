import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AddToCartSuccessModal from './components/AddToCartSuccessModal';
import AuthRequireNoticeModal from './components/AuthRequireNoticeModal';
import LoadingFallback from './components/LoadingFallback';

/* Lazy loaded route components (Vercel: bundle-dynamic-imports) */
const HomePage = lazy(() => import('./pages/HomePage'));
const AiPage = lazy(() => import('./pages/AiPage'));
const BuildPage = lazy(() => import('./pages/BuildPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const HotSalePage = lazy(() => import('./pages/HotSalePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthNoticeOpen, setIsAuthNoticeOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nat_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('nat_user', JSON.stringify(userData));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateUser = (updatedData) => {
    setUser(updatedData);
    try {
      localStorage.setItem('nat_user', JSON.stringify(updatedData));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('nat_user');
    } catch (e) {
      console.error(e);
    }
  };

  /* Derived state computed during render (Vercel: rerender-derived-state-no-effect) */
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  /* Cart operations using functional setState (Vercel: rerender-functional-setstate) */
  const handleAddToCart = (product) => {
    if (!user) {
      setIsAuthNoticeOpen(true);
      return false;
    }

    setCartItems(prev => {
      const qtyToAdd = product.quantity || 1;
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: (i.quantity || 1) + qtyToAdd } : i);
      }
      return [...prev, { ...product, quantity: qtyToAdd }];
    });
    setIsSuccessModalOpen(true);
    setTimeout(() => {
      setIsSuccessModalOpen(false);
    }, 1500);
    return true;
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) { setCartItems(prev => prev.filter(i => i.id !== productId)); return; }
    setCartItems(prev => prev.map(i => i.id === productId ? { ...i, quantity: newQty } : i));
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev.filter(i => i.id !== productId));
  };

  return (
    <Routes>
      {/* 🚀 Standalone Admin Dashboard Route (TailAdmin Style) */}
      <Route
        path="/admin"
        element={
          <Suspense fallback={<LoadingFallback message="Đang tải hệ thống quản trị TailAdmin..." />}>
            <AdminPage user={user} onLogout={handleLogout} />
          </Suspense>
        }
      />

      {/* 🌐 Consumer Storefront Routes Wrapped in MainLayout */}
      <Route
        path="/*"
        element={
          <MainLayout
            cartCount={cartCount}
            onOpenCart={() => setIsCartOpen(true)}
            user={user}
            onLogout={handleLogout}
            onOpenAuth={() => setIsAuthOpen(true)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={() => setCartItems([])}
            isCartOpen={isCartOpen}
            onCloseCart={() => setIsCartOpen(false)}
            isAuthOpen={isAuthOpen}
            onCloseAuth={() => setIsAuthOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          >
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
                <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/register" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/profile" element={<ProfilePage user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />} />
                <Route path="/account" element={<ProfilePage user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />} />
                <Route path="/hotsale" element={<HotSalePage onAddToCart={handleAddToCart} />} />
                <Route path="/category/hot-deals" element={<HotSalePage onAddToCart={handleAddToCart} />} />
                <Route path="/category/:catId" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/category" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/gaming" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/pc-gaming" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/workstation" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/pc-workstation" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/pc-amd" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/pc-amd-gaming" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/pc-mini" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/office" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/pc-office" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/pc-ai" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/components" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/linh-kien" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/monitors" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/man-hinh" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/gaming-gear" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/gear" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/pc-combo" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/speakers" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/software" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/network" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/virtualization" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route path="/search" element={<CategoryPage onAddToCart={handleAddToCart} />} />
                <Route
                  path="/cart"
                  element={
                    <CartPage
                      cartItems={cartItems}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemoveItem={handleRemoveItem}
                      onClearCart={() => setCartItems([])}
                      onAddToCart={handleAddToCart}
                    />
                  }
                />
                <Route path="/product/:id" element={<ProductDetailPage onAddToCart={handleAddToCart} />} />
                <Route path="/product" element={<ProductDetailPage onAddToCart={handleAddToCart} />} />
                <Route path="/ai" element={<AiPage onAddToCart={handleAddToCart} />} />
                <Route path="/build" element={<BuildPage onAddToCart={handleAddToCart} />} />
                <Route
                  path="/checkout"
                  element={
                    <CheckoutPage
                      user={user}
                      cartItems={cartItems}
                      onClearCart={() => setCartItems([])}
                      onAddToCart={handleAddToCart}
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <AddToCartSuccessModal
              isOpen={isSuccessModalOpen}
              onClose={() => setIsSuccessModalOpen(false)}
            />
            <AuthRequireNoticeModal
              isOpen={isAuthNoticeOpen}
              onClose={() => setIsAuthNoticeOpen(false)}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;