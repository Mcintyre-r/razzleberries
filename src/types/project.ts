export interface Project {
  id: string;
  title: string;
  type: string;
  genre: string;
  releaseDate: string;
  description: string;
  thumbnail: string;
  trailer: string;
  link: string;
  tags: string[];
  featured: string;
  price: string;
  averageRating: string;
  totalRatings: string;
}

export const PROJECT_TYPES = [
  'Map',
  'Add-on',
  'Dynamic World',
  'Skin-Pack'
] as const; 