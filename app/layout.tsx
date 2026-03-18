
import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const soriaFont = localFont({
  src: "../public/soria-font.ttf",
  variable: "--font-soria",
});

const vercettiFont = localFont({
  src: "../public/Vercetti-Regular.woff",
  variable: "--font-vercetti",
});

export const metadata: Metadata = {
  title: "Nitesh Singh Bhadoria",
  description: "An Electrical Engineering student specializing in IoT, embedded development, and machine learning.",
  keywords: "Nitesh Singh Bhadoria, Electrical Engineer, IoT Developer, Machine Learning, Python, Web Development, Portfolio",
  authors: [{ name: "Nitesh Singh Bhadoria" }],
  creator: "Nitesh Singh Bhadoria",
  publisher: "Nitesh Singh Bhadoria",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Nitesh Singh Bhadoria - Electrical Engineer & IoT Developer",
    description: "Electrical Engineering student specializing in IoT, embedded development, and machine learning.",
    url: "https://github.com/NITESH000009",
    siteName: "Nitesh Singh Bhadoria's Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nitesh Singh Bhadoria - Electrical Engineer & IoT Developer",
    description: "Electrical Engineering student specializing in IoT, embedded development, and machine learning.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overscroll-y-none">
      <body
        className={`${soriaFont.variable} ${vercettiFont.variable} font-sans antialiased`}
      >
        {children}
      </body>

    </html>
  );
}
