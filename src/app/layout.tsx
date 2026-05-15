import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mi Boleta",
  description: "Registra y administra tus boletas, rifas y sorteos en un solo lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
