'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './SearchBar.module.css';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  projects: Array<{ title: string; tags: string[] }>;
  onSearch: (term: string) => void;
}

export default function SearchBar({ projects, onSearch }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const getSuggestions = (value: string) => {
    if (!value) return [];
    
    const searchTerm = value.toLowerCase();
    const allSuggestions = new Set<string>();

    // Only include project titles
    projects.forEach(project => {
      if (project.title.toLowerCase().includes(searchTerm)) {
        allSuggestions.add(project.title);
      }
    });

    return Array.from(allSuggestions).slice(0, 5);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSuggestions(getSuggestions(value));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search projects..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          <FaSearch />
        </button>
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={styles.suggestionItem}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 