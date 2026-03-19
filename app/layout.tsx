import type { Metadata } from "next";
import "./globals.css";
import Providers from "./components/Providers";
import { SEO } from "@/lib/constants";

export const metadata: Metadata = {
  title: SEO.siteTitle,
  description: SEO.siteDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
