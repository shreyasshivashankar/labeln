'use client';

import AuthProvider from './AuthProvider';
import CartProvider from './CartProvider';
import CartDrawer from './CartDrawer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </AuthProvider>
  );
}
