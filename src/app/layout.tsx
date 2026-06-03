import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solvely",
  description: "Solvely interactive examples.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full" suppressHydrationWarning>
      <body className="h-[100svh] overflow-hidden antialiased">{children}</body>
    </html>
  );
}
