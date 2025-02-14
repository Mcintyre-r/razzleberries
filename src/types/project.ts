export interface Project {
  id: string;
  title: string;
  type: string[];
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
  'Adventure World',
  'Add-on',
  'Skinpack',
  'Persona',
  'Mini-Game World',
  'Survival Spawn World',
  'Resourcepack'
] as const; 