import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    const response = await axios.get(
      `https://www.minecraft.net/bin/minecraft/productmanagement.productdetails.json?id=${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary authentication headers here
        }
      }
    );
    
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Minecraft details' },
      { status: 500 }
    );
  }
} 