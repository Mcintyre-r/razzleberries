import { Project } from '@/types/project';
import axios, { AxiosError } from 'axios';
import https from 'https';

export async function getProjects(): Promise<{ projects: Project[] }> {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    // During build time, use the JSON_URL directly

    const response = await axios.get(process.env.JSON_URL || '', {
      httpsAgent: agent,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;



    // // For client-side or development, use the API route
    // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    // const url = typeof window === 'undefined' 
    //   ? `${baseUrl}/api/projects`
    //   : '/api/projects';

    // const response = await axios.get(url, {
    //   httpsAgent: agent,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // });

    // return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Failed to fetch projects:', error.message);
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred while fetching projects');
  }
}

