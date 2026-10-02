import React from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../components/CartDrawer';
import AuthModal from '../components/AuthModal';
import FloatingContactButtons from '../components/FloatingContactButtons';
import CustomerTrustSection from '../components/CustomerTrustSection';

export default function MainLayout({
  children,
  cartCount,
  onOpenCart,
  user,
  onLogout,
  onOpenAuth,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  isCartOpen,
  onCloseCart,
  isAuthOpen,
  onCloseAuth,
  onLoginSuccess
}) {
  return (
    <div className="layout-app-root">
      {/* ── Multi-Row PC Gaming Header ── */}
      <Header
        cartCount={cartCount}
        onOpenCart={onOpenCart}
        user={user}
        onLogout={onLogout}
        onOpenAuth={onOpenAuth}
      />

      {/* ── Main View Content ── */}
      <main className="layout-main-content">
        {children}
      </main>

      {/* ── Shared 4 Trust Pillars & 100% Satisfaction Guarantee Accordion ── */}
      <CustomerTrustSection />

      {/* ── Sleek Dark Footer ── */}
      <Footer />

      {/* ── Floating Contact Action Buttons (Messenger & Zalo) ── */}
      <FloatingContactButtons />

      {/* ── Global Auth Modal Overlay ── */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={onCloseAuth}
        onLoginSuccess={onLoginSuccess}
      />
    </div>
  );
}
