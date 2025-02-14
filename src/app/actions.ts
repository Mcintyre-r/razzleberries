import { Project } from '@/types/project';
import axios, { AxiosError } from 'axios';
import https from 'https';

export async function getProjects(): Promise<{ projects: Project[] }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await axios.get(`${baseUrl}/api/projects`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while fetching projects');
  }
}

