import "~/styles/globals.css";

import { Inter } from "next/font/google";
import Image from "next/image";

import image from "~/assets/icon-512x-512-any.png";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <nav className="container z-50 mb-7 flex h-16 items-center border-b bg-background">
          <div className="mr-8 hidden items-center md:flex">
            <Image src={image} alt="Logo" className="mr-2 h-6 w-6" />
            <span className="text-lg font-bold tracking-tight">
              Weather.io&apos;s Blog
            </span>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
