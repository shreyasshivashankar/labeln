import type { Metadata } from "next";
import "./globals.css";
import Providers from "./components/Providers";

export const metadata: Metadata = {
  title: "Label N",
  description: "South Asian clothing brand",
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
