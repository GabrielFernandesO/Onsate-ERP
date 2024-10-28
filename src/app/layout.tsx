import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from 'next/font/google'; // Importa a fonte Poppins
import { NextFont } from "next/dist/compiled/@next/font";


// Configura a fonte Poppins
const poppins: NextFont = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Use "weights" no plural
  display: 'swap',
});


export const metadata: Metadata = {
  title: "Onsate ERP",
  description: "Sistema de ERP WEB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
