import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";

export const metadata: Metadata = {
  title: "sale50.ro | Accesorii & Echipamente Premium",
  description: "Magazinul tău online pentru accesorii premium, gadgeturi și echipamente moderne cu discounturi de până la 50%.",
};

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { WishlistProvider } from "@/components/WishlistContext";
import CookieConsent from "@/components/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body>
        <CookieConsent />
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            {children}
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}

