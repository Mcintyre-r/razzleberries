import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Project } from '@/types/project';
import axios from 'axios';
const dataFilePath = path.join(process.cwd(), 'src/data/projects.json');

export async function GET() {
  if (!process.env.JSON_URL || !process.env.JSON_KEY) {
    return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
  }

  try {
    const response = await axios.get(process.env.JSON_URL, {
      headers: {
        'X-SILO-KEY': process.env.JSON_KEY,
        'Content-Type': 'application/json'
      }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load projects: '+error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const project = await request.json();
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    data.projects = data.projects.map((p: Project) => 
      p.id === project.id ? project : p
    );

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project: '+error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newProject = await request.json();
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    const maxId = Math.max(...data.projects.map((p: Project) => p.id));
    newProject.id = maxId + 1;
    
    data.projects.push(newProject);
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json(newProject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add project: '+error }, { status: 500 });
  }
} 