'use client';

import { useState, useMemo } from 'react';
import styles from './page.module.css';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';
import FilterSidebar from '@/components/FilterSidebar';
import projects from '@/data/projects.json';
import { FaFilter } from 'react-icons/fa';
import SearchBar from '@/components/SearchBar';

type SortField = 'releaseDate' | 'title' | 'price' | 'averageRating';
type SortDirection = 'asc' | 'desc';

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortField>('releaseDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Get unique tags and types from all addons
  const allTags = Array.from(
    new Set(projects.projects.flatMap(projects => projects.tags))
  ).sort();

  const allTypes = Array.from(
    new Set(projects.projects.map(projects => projects.type))
  ).sort();

  // Sort and filter addons
  const filteredProjects = projects.projects
    .filter(projects => {
      const matchesSearch = projects.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => projects.tags.includes(tag));
      const matchesTypes = selectedTypes.length === 0 ||
        selectedTypes.includes(projects.type);
      return matchesSearch && matchesTags && matchesTypes;
    })
    .sort((a, b) => {
      if (sortBy === 'releaseDate') {
        const dateA = new Date(a.releaseDate);
        const dateB = new Date(b.releaseDate);
        return sortDirection === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
      }
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

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

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

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