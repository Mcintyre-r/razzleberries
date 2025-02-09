import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { projects } = await request.json();
    const filePath = path.join(process.cwd(), 'src/data/projects.json');
    
    await fs.writeFile(
      filePath, 
      JSON.stringify({ projects }, null, 2)
    );
    
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to import projects:  '+error },
      { status: 500 }
    );
  }
} 