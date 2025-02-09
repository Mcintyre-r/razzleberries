import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://razzleberries.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://razzleberries.com/projects',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }
  ];
} 