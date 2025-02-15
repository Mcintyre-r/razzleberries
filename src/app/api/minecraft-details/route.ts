import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    console.log('Fetching details for ID:', id);
    
    try {
      const response = await axios.get(
        `https://www.minecraft.net/bin/minecraft/productmanagement.productdetails.json?id=${id}`,
        {
          headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Origin': 'https://www.minecraft.net',
            'Referer': 'https://www.minecraft.net/',
          }
        }
      );
      console.log('Response:', response.data);
      return NextResponse.json(response.data);
    } catch (axiosError: any) {
      console.error('Axios error:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });
      return NextResponse.json(
        { error: `Failed to fetch: ${axiosError.message}` },
        { status: axiosError.response?.status || 500 }
      );
    }
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
} 