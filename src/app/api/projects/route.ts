import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/projects.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load projects: '+error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const project = await request.json();
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    data.projects = data.projects.map((p: any) => 
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
    
    const maxId = Math.max(...data.projects.map((p: any) => p.id));
    newProject.id = maxId + 1;
    
    data.projects.push(newProject);
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json(newProject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add project: '+error }, { status: 500 });
  }
} 