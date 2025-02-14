import { Suspense } from 'react';
import { getProjects } from './actions';
import { Project } from '@/types/project';
import ClientPage from './client-page';

export default async function Home() {
  const projects = await getProjects();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientPage initialProjects={projects} />
    </Suspense>
  );
}
