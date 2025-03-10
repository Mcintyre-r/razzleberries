import './globals.css';
import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Razzleberries AB | Official Minecraft Marketplace Partner',
    template: '%s | Razzleberries AB'
  },
  description: 'Razzleberries AB is a founding partner and industry leader on the Minecraft Marketplace, creating high-quality content with over 3 million sales.',
  keywords: ['Minecraft', 'Marketplace', 'Razzleberries', 'Gaming', 'Add-ons', 'Maps', 'Skins', 'Content Creator'],
  authors: [{ name: 'Razzleberries AB' }],
  creator: 'Razzleberries AB',
  publisher: 'Razzleberries AB',
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://razzleberri.es',
    siteName: 'Razzleberries AB',
    title: 'Razzleberries AB | Official Minecraft Marketplace Partner',
    description: 'Leading Minecraft Marketplace content creator with over 3 million sales.',
    images: [
      {
        url: '/RB_Berry_White.png', // You'll need to create this image
        width: 1200,
        height: 630,
        alt: 'Razzleberries AB'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@RazzleberriesAB',
    creator: '@RazzleberriesAB',
    images: '/og-image.jpg'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className} style={{ background: 'white' }}>
        <NavBar />
        <main style={{ marginTop: '70px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
