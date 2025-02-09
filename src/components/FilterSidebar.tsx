import { useState } from 'react';
import styles from './FilterSidebar.module.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import SearchBar from './SearchBar';

type SortField = 'releaseDate' | 'title' | 'price' | 'averageRating';
type SortDirection = 'asc' | 'desc';

interface FilterSidebarProps {
  projects: Array<{ title: string; tags: string[] }>;
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  types: string[];
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
}

export default function FilterSidebar({
  projects,
  tags,
  selectedTags,
  onTagToggle,
  types,
  selectedTypes,
  onTypeToggle,
  onSearchChange,
  sortBy,
  sortDirection,
  onSortChange
}: FilterSidebarProps) {
  const [isTagsExpanded, setIsTagsExpanded] = useState(true);
  const [isTypesExpanded, setIsTypesExpanded] = useState(true);

  return (
    <div className={styles.sidebar}>
      <div className={styles.section}>
        <h3>Search</h3>
        <SearchBar 
          projects={projects}
          onSearch={onSearchChange}
        />
      </div>

      <div className={styles.sortContainer}>
        <select 
          value={`${sortBy}-${sortDirection}`} 
          onChange={(e) => {
            const [field, direction] = e.target.value.split('-');
            onSortChange(field as SortField, direction as SortDirection);
          }}
          className={styles.sortSelect}
        >
          <option value="releaseDate-desc">Newest First</option>
          <option value="releaseDate-asc">Oldest First</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="averageRating-desc">Rating (High to Low)</option>
          <option value="averageRating-asc">Rating (Low to High)</option>
        </select>
      </div>

      <div className={styles.filtersContainer}>
        <div className={styles.filterSection}>
          <button 
            className={styles.filterHeader}
            onClick={() => setIsTypesExpanded(!isTypesExpanded)}
          >
            <h3 className={styles.title}>Filter by Type</h3>
            {isTypesExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {isTypesExpanded && (
            <div className={styles.filterList}>
              {types.map(type => (
                <label key={type} className={styles.filterLabel}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => onTypeToggle(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className={styles.filterSection}>
          <button 
            className={styles.filterHeader}
            onClick={() => setIsTagsExpanded(!isTagsExpanded)}
          >
            <h3 className={styles.title}>Filter by Tags</h3>
            {isTagsExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {isTagsExpanded && (
            <div className={styles.filterList}>
              {tags.map(tag => (
                <label key={tag} className={styles.filterLabel}>
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => onTagToggle(tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 