import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ERD Designer - Visual Database Design Tool",
  description: "A powerful and intuitive Entity Relationship Diagram (ERD) designer for visual database modeling. Create, edit, and export database schemas with ease.",
  keywords: ["ERD", "Database Design", "Entity Relationship Diagram", "SQL", "Schema Design"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
