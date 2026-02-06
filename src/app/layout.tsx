import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/shared/header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carpinter-IA | Disena tu Placard a Medida",
  description:
    "Crea y personaliza tu placard ideal con inteligencia artificial. Ingresa tus medidas y visualiza en 3D.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} antialiased font-sans`}
        style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
