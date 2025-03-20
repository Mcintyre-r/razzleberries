'use client';

import { useState, useMemo, useEffect } from 'react';
import styles from './page.module.css';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';
import FilterSidebar from '@/components/FilterSidebar';
import { getProjects } from '../actions';
import { FaFilter } from 'react-icons/fa';
import { Project } from '@/types/project';

// Configure the page for dynamic rendering
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

type SortField = 'releaseDate' | 'title' | 'price' | 'averageRating';
type SortDirection = 'asc' | 'desc';

interface ProjectsData {
  projects: Project[];
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortField>('releaseDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [projects, setProjects] = useState<ProjectsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to fetch projects');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Get unique tags and types from all projects
  const allTags = useMemo(() => {
    if (!projects) return [];
    return Array.from(
      new Set(projects.projects.flatMap(project => project.tags))
    ).sort();
  }, [projects]);

  const allTypes = useMemo(() => {
    if (!projects) return [];
    return Array.from(
      new Set(
        projects.projects.flatMap(project => 
          Array.isArray(project.type) ? project.type : [project.type]
        )
      )
    ).sort();
  }, [projects]);

  // Sort and filter projects
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.projects
      .filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.every(tag => project.tags.includes(tag));
        const matchesTypes = selectedTypes.length === 0 ||
          (Array.isArray(project.type)
            ? selectedTypes.some(type => project.type.includes(type))
            : selectedTypes.includes(project.type));
        return matchesSearch && matchesTags && matchesTypes;
      });
  }, [projects, searchTerm, selectedTags, selectedTypes]);

  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      switch (sortBy) {
        case 'releaseDate':
          const dateA = new Date(a.releaseDate);
          const dateB = new Date(b.releaseDate);
          return sortDirection === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
        
        case 'title':
          return sortDirection === 'desc' 
            ? b.title.localeCompare(a.title) 
            : a.title.localeCompare(b.title);
        
        case 'price':
          const priceA = Number(a.price) || 0;
          const priceB = Number(b.price) || 0;
          return sortDirection === 'desc' ? priceB - priceA : priceA - priceB;
        
        case 'averageRating':
          const ratingA = Number(a.averageRating) || 0;
          const ratingB = Number(b.averageRating) || 0;
          return sortDirection === 'desc' ? ratingB - ratingA : ratingA - ratingB;
        
        default:
          return 0;
      }
    });
  }, [filteredProjects, sortBy, sortDirection]);

  const handleResetFilters = () => {
    setSelectedTags([]);
    setSelectedTypes([]);
    setSearchTerm('');
    setSortBy('releaseDate');
    setSortDirection('desc');
  };

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (error || !projects) {
    return <div className={styles.container}>Error: {error || 'Failed to load projects'}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.mobileFilterToggle}>
        <button 
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className={styles.filterButton}
        >
          <FaFilter /> Filters
        </button>
      </div>

      <div className={`${styles.content} ${isFilterVisible ? styles.filterVisible : ''}`}>
        <div className={styles.filterSidebar}>
          <FilterSidebar
            projects={projects.projects}
            tags={allTags}
            selectedTags={selectedTags}
            onTagToggle={(tag) => {
              setSelectedTags(prev =>
                prev.includes(tag)
                  ? prev.filter(t => t !== tag)
                  : [...prev, tag]
              );
            }}
            types={allTypes}
            selectedTypes={selectedTypes}
            onTypeToggle={(type) => {
              setSelectedTypes(prev =>
                prev.includes(type)
                  ? prev.filter(t => t !== type)
                  : [...prev, type]
              );
            }}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={(field, direction) => {
              setSortBy(field);
              setSortDirection(direction);
            }}
            onResetFilters={handleResetFilters}
          />
        </div>
        
        <div>
          <div className={styles.projectGridHeader}>
            <h1 className={styles.projectGridTitle}>Razzleberries Releases</h1>
            <div className={styles.projectGridDivider} />
          </div>
          
          <div className={styles.projectGrid}>
            {sortedProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
} 