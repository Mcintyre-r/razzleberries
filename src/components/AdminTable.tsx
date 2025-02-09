'use client';

import { useState } from 'react';
import styles from './AdminTable.module.css';
import { Project, PROJECT_TYPES } from '@/types/project';
import { FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import EditReleaseForm from '@/components/EditReleaseForm';

interface AdminTableProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
  filters: {
    search: string;
    onlyFeatured: boolean;
    trailerFilter: 'all' | 'with' | 'without';
    dateRange: {
      start: string;
      end: string;
    };
    priceRange: {
      min: string;
      max: string;
    };
    ratingRange: {
      min: string;
      max: string;
    };
  };
}

type SortField = 'id' | 'title' | 'type' | 'genre' | 'releaseDate' | 'price' | 'averageRating' | 'totalRatings' | 'featured';
type SortDirection = 'asc' | 'desc' | null;

interface DeleteConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal = ({ onClose, onConfirm }: DeleteConfirmationModalProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'hello') {
      onConfirm();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>Confirm Delete</h2>
        <p>This action cannot be undone. Please enter password to confirm.</p>
        <form onSubmit={handleSubmit} className={styles.deleteForm}>
          <input
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Enter password"
            className={error ? styles.error : ''}
          />
          {error && <span className={styles.errorMessage}>Incorrect password</span>}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.deleteButton}>Delete</button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TrailerCell = ({ url }: { url: string }) => {
  if (!url) {
    return <td className={styles.emptyCell}>No trailer</td>;
  }
  return (
    <td>
      <a href={url} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
        View
      </a>
    </td>
  );
};

const FeaturedCell = ({ value }: { value: string }) => {
  return <td>{value === 'true' ? 'Yes' : 'No'}</td>;
};

// Add a display date formatter function
const formatDisplayDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toISOString().split('T')[0]; // Display as YYYY-MM-DD
  } catch {
    return dateString;
  }
};

export default function AdminTable({ projects, onUpdate, filters }: AdminTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Project | null>(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Project;
    direction: 'ascending' | 'descending';
  } | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => {
        if (prev === 'asc') return 'desc';
        if (prev === 'desc') return null;
        return 'asc';
      });
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort />;
    if (sortDirection === 'asc') return <FaSortUp />;
    if (sortDirection === 'desc') return <FaSortDown />;
    return <FaSort />;
  };

  const filteredProjects = projects.filter(project => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        project.id.toLowerCase().includes(searchTerm) ||
        project.title.toLowerCase().includes(searchTerm) ||
        project.type.toLowerCase().includes(searchTerm) ||
        (project.genre || '').toLowerCase().includes(searchTerm) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }

    // Price range filter
    if (filters.priceRange.min && parseFloat(project.price) < parseFloat(filters.priceRange.min)) {
      return false;
    }
    if (filters.priceRange.max && parseFloat(project.price) > parseFloat(filters.priceRange.max)) {
      return false;
    }

    // Rating range filter
    if (filters.ratingRange.min && parseFloat(project.averageRating) < parseFloat(filters.ratingRange.min)) {
      return false;
    }
    if (filters.ratingRange.max && parseFloat(project.averageRating) > parseFloat(filters.ratingRange.max)) {
      return false;
    }

    // Featured filter
    if (filters.onlyFeatured && !project.featured) {
      return false;
    }

    // Trailer filter
    if (filters.trailerFilter === 'with' && !project.trailer) {
      return false;
    }
    if (filters.trailerFilter === 'without' && project.trailer) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      const projectDate = new Date(project.releaseDate);
      if (filters.dateRange.start && projectDate < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange.end && projectDate > new Date(filters.dateRange.end)) {
        return false;
      }
    }

    return true;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    return sortConfig.direction === 'ascending' 
      ? aValue > bValue ? 1 : -1
      : aValue < bValue ? 1 : -1;
  });

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleSave = async (updatedProject: Project) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });

      if (response.ok) {
        const updatedProjects = projects.map(p => 
          p.id === updatedProject.id ? updatedProject : p
        );
        onUpdate(updatedProjects);
        setEditingProject(null);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDescriptionClick = (description: string) => {
    setSelectedDescription(description);
    setShowDescriptionModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedProjects = projects.filter(p => p.id !== id);
        onUpdate(updatedProjects);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')} className={styles.sortableHeader}>
              ID {getSortIcon('id')}
            </th>
            <th onClick={() => handleSort('title')} className={styles.sortableHeader}>
              Title {getSortIcon('title')}
            </th>
            <th onClick={() => handleSort('type')} className={styles.sortableHeader}>
              Type {getSortIcon('type')}
            </th>
            <th onClick={() => handleSort('genre')} className={styles.sortableHeader}>
              Genre {getSortIcon('genre')}
            </th>
            <th onClick={() => handleSort('releaseDate')} className={styles.sortableHeader}>
              Release Date {getSortIcon('releaseDate')}
            </th>
            <th>Description</th>
            <th onClick={() => handleSort('price')} className={styles.sortableHeader}>
              Price {getSortIcon('price')}
            </th>
            <th onClick={() => handleSort('averageRating')} className={styles.sortableHeader}>
              Rating {getSortIcon('averageRating')}
            </th>
            <th onClick={() => handleSort('totalRatings')} className={styles.sortableHeader}>
              Total Ratings {getSortIcon('totalRatings')}
            </th>
            <th>Thumbnail</th>
            <th>Trailer</th>
            <th>Link</th>
            <th>Tags</th>
            <th onClick={() => handleSort('featured')} className={styles.sortableHeader}>
              Featured {getSortIcon('featured')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedProjects.map(project => (
            <tr key={project.id}>
              {editingId === project.id ? (
                // Editing mode
                <>
                  <td>{project.id}</td>
                  <td>
                    <input
                      value={editingData?.title}
                      onChange={e => setEditingData({
                        ...editingData!,
                        title: e.target.value
                      })}
                    />
                  </td>
                  <td>
                    <select
                      value={editingData?.type}
                      onChange={e => setEditingData({
                        ...editingData!,
                        type: e.target.value as Project['type']
                      })}
                    >
                      {PROJECT_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingData?.genre || ''}
                      onChange={e => setEditingData({
                        ...editingData!,
                        genre: e.target.value
                      })}
                      placeholder="Genre"
                    />
                  </td>
                  <td>
                    <input
                      type="datetime-local"
                      value={editingData?.releaseDate ? new Date(editingData.releaseDate).toISOString().slice(0, 16) : ''}
                      onChange={e => setEditingData({
                        ...editingData!,
                        releaseDate: new Date(e.target.value).toISOString()
                      })}
                    />
                  </td>
                  <td>
                    <textarea
                      value={editingData?.description}
                      onChange={e => setEditingData({
                        ...editingData!,
                        description: e.target.value
                      })}
                    />
                  </td>
                  <td>
                    {project.price ? `${project.price}` : '-'}
                  </td>
                  <td>
                    {project.averageRating ? `${project.averageRating}` : '-'}
                  </td>
                  <td>
                    {project.totalRatings ? `${project.totalRatings}` : '-'}
                  </td>
                  <td>
                    <input
                      type="url"
                      value={editingData?.thumbnail}
                      onChange={e => setEditingData({
                        ...editingData!,
                        thumbnail: e.target.value
                      })}
                      placeholder="Image URL"
                    />
                  </td>
                  <td>
                    <input
                      type="url"
                      value={editingData?.trailer}
                      onChange={e => setEditingData({
                        ...editingData!,
                        trailer: e.target.value
                      })}
                      placeholder="YouTube embed URL"
                    />
                  </td>
                  <td>
                    <input
                      type="url"
                      value={editingData?.link}
                      onChange={e => setEditingData({
                        ...editingData!,
                        link: e.target.value
                      })}
                      placeholder="Marketplace URL"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingData?.tags.join(', ')}
                      onChange={e => setEditingData({
                        ...editingData!,
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      })}
                      placeholder="Comma-separated tags"
                    />
                  </td>
                  <td>
                    <select
                      value={editingData?.featured}
                      onChange={e => setEditingData({
                        ...editingData!,
                        featured: e.target.value
                      })}
                    >
                      <option value="">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => setEditingId(null)} className={styles.cancelButton}>Cancel</button>
                  </td>
                </>
              ) : (
                // View mode
                <>
                  <td>{project.id}</td>
                  <td>{project.title}</td>
                  <td>{project.type}</td>
                  <td>{project.genre || '-'}</td>
                  <td>{formatDisplayDate(project.releaseDate)}</td>
                  <td>
                    <a 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDescriptionClick(project.description);
                      }} 
                      className={styles.viewLink}
                    >
                      View
                    </a>
                  </td>
                  <td>
                    {project.price ? `${project.price}` : '-'}
                  </td>
                  <td>
                    {project.averageRating ? `${project.averageRating}` : '-'}
                  </td>
                  <td>
                    {project.totalRatings ? `${project.totalRatings}` : '-'}
                  </td>
                  <td>
                    <a href={project.thumbnail} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
                      View
                    </a>
                  </td>
                  <TrailerCell url={project.trailer} />
                  <td>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
                      View
                    </a>
                  </td>
                  <td>{project.tags.join(', ')}</td>
                  <FeaturedCell value={project.featured} />
                  <td>
                    <button 
                      onClick={() => handleEdit(project)} 
                      className={styles.iconButton}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => setDeleteId(project.id)} 
                      className={`${styles.iconButton} ${styles.deleteIcon}`}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {showDescriptionModal && (
        <div 
          className={styles.modal}
          onClick={() => setShowDescriptionModal(false)}
        >
          <div 
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            <button 
              className={styles.closeButton}
              onClick={() => setShowDescriptionModal(false)}
            >
              ×
            </button>
            <div className={styles.modalText}>
              {selectedDescription}
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <DeleteConfirmationModal
          onClose={() => setDeleteId(null)}
          onConfirm={() => handleDelete(deleteId)}
        />
      )}

      {editingProject && (
        <EditReleaseForm
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
} 