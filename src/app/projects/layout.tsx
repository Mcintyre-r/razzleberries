import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Projects | Minecraft Marketplace Content',
  description: 'Explore our collection of high-quality Minecraft content including worlds, add-ons, maps, and skin packs. Over 260 unique creations available.',
  openGraph: {
    title: 'Minecraft Content by Razzleberries AB',
    description: 'Discover our extensive collection of Minecraft content.',
    images: [
      {
        url: '/projects-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Razzleberries Projects'
      }
    ]
  }
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 