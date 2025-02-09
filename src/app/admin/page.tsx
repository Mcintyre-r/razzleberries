'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import AdminTable from '@/components/AdminTable';
import AddReleaseForm from '@/components/AddReleaseForm';
import AdminLogin from '@/components/AdminLogin';
import { Project } from '@/types/project';
import AdminDropdown from '@/components/AdminDropdown';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

interface AdminDropdownProps {
  onAddClick: () => void;
  onExportClick: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    onlyFeatured: false,
    trailerFilter: 'all' as 'all' | 'with' | 'without',
    dateRange: {
      start: '',
      end: ''
    },
    priceRange: {
      min: '',
      max: ''
    },
    ratingRange: {
      min: '',
      max: ''
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/projects')
        .then(res => res.json())
        .then(data => setProjects(data.projects));
    }
  }, [isAuthenticated]);

  const handleExportCSV = () => {
    const headers = ['id', 'title', 'type', 'releaseDate', 'description', 'thumbnail', 'trailer', 'link', 'tags', 'featured'];
    const csvContent = [
      headers.join(','),
      ...projects.map(project => [
        `"${project.id}"`,
        `"${project.title}"`,
        `"${project.type}"`,
        `"${project.releaseDate}"`,
        `"${project.description.replace(/"/g, '""')}"`,
        `"${project.thumbnail}"`,
        `"${project.trailer}"`,
        `"${project.link}"`,
        `"${Array.isArray(project.tags) ? project.tags.join(';') : ''}"`,
        `"${project.featured}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'projects.csv';
    link.click();
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid
      return date.toISOString(); // Store full ISO datetime
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        
        // Function to convert YouTube URL to embed URL
        const convertToEmbedUrl = (url: string) => {
          if (!url) return '';
          
          const patterns = [
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
            /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/
          ];

          for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
              return `https://www.youtube.com/embed/${match[1]}`;
            }
          }
          
          return url;
        };

        // Function to format description
        const formatDescription = (description: string) => {
          return description.replace(/\${2,}/g, '\n');
        };

        // Split into rows and filter empty rows
        const rows = text.split('\n')
          .filter(row => row.trim().length > 0)
          .map(row => {
            // Match fields, preserving empty cells between commas
            const matches = row.match(/(?:^|,)("(?:[^"]*"")*[^"]*"|[^,]*)/g);
            if (!matches) return [];
            return matches.map(field => {
              // Remove leading comma and quotes, handle empty strings
              field = field.replace(/^,/, '');
              field = field.replace(/^"|"$/g, '');
              field = field.replace(/""/g, '"');
              return field.trim();
            });
          });

        const headers = rows[0];
        
        const newProjects = rows.slice(1)
          .map(row => {
            const project: any = {
              trailer: '', // Default empty trailer
              featured: '', // Default empty featured
              tags: [] // Default empty tags array
            };

            // Map each header to its corresponding value, preserving column positions
            headers.forEach((header, index) => {
              if (header === 'tags') {
                const tagString = row[index] || '';
                project.tags = tagString ? tagString.split(';').map(tag => tag.trim()).filter(Boolean) : [];
              } else if (header === 'trailer') {
                // Convert trailer URL to embed URL if present
                project.trailer = convertToEmbedUrl(row[index]);
              } else if (header === 'description') {
                // Format description with line breaks
                project.description = formatDescription(row[index] || '');
              } else if (header === 'releaseDate') {
                // Format the date
                project.releaseDate = formatDate(row[index] || '');
              } else if (header) {
                project[header] = row[index] || '';
              }
            });
            
            return project;
          })
          .filter(project => {
            // Filter out invalid projects - require at least title and id
            return project.title && project.id;
          });

        if (newProjects.length === 0) {
          alert('No valid projects found in CSV file');
          return;
        }

        try {
          const response = await fetch('/api/projects/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projects: newProjects }),
          });

          if (response.ok) {
            const data = await response.json();
            setProjects(data.projects);
            alert('Projects imported successfully');
          } else {
            throw new Error('Failed to import projects');
          }
        } catch (error) {
          console.error('Error importing projects:', error);
          alert('Failed to import projects. Please check the console for details.');
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Failed to parse CSV file. Please ensure it is properly formatted.');
      }
    };

    reader.onerror = () => {
      alert('Error reading file');
    };

    reader.readAsText(file);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1>Admin Dashboard</h1>
        
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by ID, title, type, or tag..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <button 
            className={styles.filterButton}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </button>
        </div>

        <AdminDropdown
          onAddClick={() => setShowAddForm(true)}
          onExportClick={handleExportCSV}
          onFileSelect={handleFileSelect}
        />
      </div>

      {showFilters && (
        <div className={styles.filterPanel}>
          <div className={styles.filterGroup}>
            <label>
              <input
                type="checkbox"
                checked={filters.onlyFeatured}
                onChange={(e) => setFilters({ ...filters, onlyFeatured: e.target.checked })}
              />
              Show only featured
            </label>
          </div>

          <div className={styles.filterGroup}>
            <label>Trailer:</label>
            <select
              value={filters.trailerFilter}
              onChange={(e) => setFilters({ 
                ...filters, 
                trailerFilter: e.target.value as 'all' | 'with' | 'without' 
              })}
            >
              <option value="all">All</option>
              <option value="with">With trailer</option>
              <option value="without">Without trailer</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Date range:</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, start: e.target.value }
              })}
            />
            <span>to</span>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, end: e.target.value }
              })}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Price Range:</label>
            <div className={styles.rangeInputs}>
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange.min}
                onChange={(e) => setFilters({
                  ...filters,
                  priceRange: { ...filters.priceRange, min: e.target.value }
                })}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange.max}
                onChange={(e) => setFilters({
                  ...filters,
                  priceRange: { ...filters.priceRange, max: e.target.value }
                })}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Rating Range:</label>
            <div className={styles.rangeInputs}>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Min"
                value={filters.ratingRange.min}
                onChange={(e) => setFilters({
                  ...filters,
                  ratingRange: { ...filters.ratingRange, min: e.target.value }
                })}
              />
              <span>to</span>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Max"
                value={filters.ratingRange.max}
                onChange={(e) => setFilters({
                  ...filters,
                  ratingRange: { ...filters.ratingRange, max: e.target.value }
                })}
              />
            </div>
          </div>

          <button 
            className={styles.resetButton}
            onClick={() => setFilters({
              search: '',
              onlyFeatured: false,
              trailerFilter: 'all',
              dateRange: { start: '', end: '' },
              priceRange: { min: '', max: '' },
              ratingRange: { min: '', max: '' }
            })}
          >
            <FaTimes /> Reset Filters
          </button>
        </div>
      )}

      <AdminTable 
        projects={projects} 
        onUpdate={setProjects}
        filters={filters}
      />
      
      {showAddForm && (
        <AddReleaseForm
          onClose={() => setShowAddForm(false)}
          onAdd={(newProject) => {
            setProjects([...projects, newProject]);
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
} 