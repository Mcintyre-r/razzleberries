'use client';

import { useState, useEffect } from 'react';
import styles from './AddReleaseForm.module.css';
import { Project, PROJECT_TYPES } from '@/types/project';
import axios, { AxiosError } from 'axios';
import { convertToEmbedLink, capitalizeEachWord } from '@/utility/utils';
interface AddReleaseFormProps {
  onClose: () => void;
  onAdd: (project: Project) => void;
}

export default function AddReleaseForm({ onClose, onAdd }: AddReleaseFormProps) {
  const [isInitialScreen, setIsInitialScreen] = useState(true);
  const [marketplaceUrl, setMarketplaceUrl] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    type: [] as string[],
    releaseDate: '',
    description: '',
    thumbnail: '',
    trailer: '',
    link: '',
    tags: [] as string[],
    featured: '',
    price: '',
    averageRating: '',
    totalRatings: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [existingTags, setExistingTags] = useState<string[]>([]);

  const [typeInput, setTypeInput] = useState('');
  const [showTypeSuggestions, setShowTypeSuggestions] = useState(false);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        console.log('Loaded tags:', data.projects.map((p: Project) => p.tags).flat());
        const allTags = data.projects.reduce((tags: string[], project: Project) => {
          project.tags.forEach(tag => {
            if (!tags.includes(tag)) {
              tags.push(tag);
            }
          });
          return tags;
        }, []);
        setExistingTags(allTags.sort());
      });
  }, []);

  const filteredTags = existingTags.filter(tag => 
    tag.toLowerCase().includes(tagInput.toLowerCase()) && 
    !formData.tags.includes(tag)
  );

  const validateUrls = () => {
    const thumbnailRegex = /\.(jpg|jpeg|png|gif|webp)$/i;
    const trailerRegex = /^https:\/\/(www\.)?youtube\.com\/embed\//;
    const linkRegex = /^https:\/\/(www\.)?minecraft\.net\//;

    return (
      thumbnailRegex.test(formData.thumbnail) &&
      (!formData.trailer || trailerRegex.test(formData.trailer)) &&
      linkRegex.test(formData.link)
    );
  };

  const handleAddTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleMarketplaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const match = marketplaceUrl.match(/id=([^&]+)/);
      if (!match) {
        setError('Invalid marketplace URL. Please ensure it contains an ID.');
        return;
      }

      const id = match[1];
      const response = await axios.post('/api/minecraft-details', { id });
      
      // console.log('Fetched data:', response.data);
      let img = ""
      for(const imageObject of response.data.images){
        if(imageObject.type == "Thumbnail"){
          img = imageObject.url
        }
        console.log(imageObject)
      }
      setFormData(prevData => ({
        ...prevData,
        title: response.data.title.neutral || '',
        description: response.data.description.neutral || '',
        link: marketplaceUrl,
        releaseDate: response.data.startDate || '',
        price: response.data.displayProperties.price || '',
        averageRating: response.data.rating.averageRating || '',
        totalRatings: response.data.rating.totalRatingsCount || '',
        tags: response.data.tags.map((tag: string) => {
          if(tag.slice(0,4) == "tag."){
            const modTag = tag.slice(4).replaceAll("_"," ")
            const capitalTag = capitalizeEachWord(modTag)
            return capitalTag
          }
          else{return}
        }).filter((tag: string) => tag !== undefined) || [],
        trailer: convertToEmbedLink(response.data.displayProperties.videoUrl) || '',
        type: response.data.tags.map((tag: string) => {
          const conditions = ["Tag.","Genre.","Subgenre."]
          if(!conditions.some(el => tag.toLowerCase().includes(el.toLowerCase()))){
            const modTag = tag.replaceAll("_"," ")
            const capitalTag = capitalizeEachWord(modTag)
            return capitalTag
          }
          else{return}
        }).filter((tag: string) => tag !== undefined) || [],
        thumbnail: img
      }));

      setIsInitialScreen(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response) {
          // Server responded with error status
          setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
        } else if (err.request) {
          // Request made but no response
          setError('No response from server. Please check your connection.');
        } else {
          // Error setting up request
          setError(`Request error: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred.');
      }
      console.error('Error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrls()) {
      alert('Please check your URLs:\n- Thumbnail must be an image file\n- Trailer must be a YouTube embed URL\n- Link must be from minecraft.net');
      return;
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newProject = await response.json();
        onAdd(newProject);
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  if (isInitialScreen) {
    return (
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <h2>Add New Release</h2>
          <form onSubmit={handleMarketplaceSubmit}>
            <div className={styles.formGroup}>
              <label>Minecraft Marketplace URL</label>
              <input
                type="url"
                value={marketplaceUrl}
                onChange={e => setMarketplaceUrl(e.target.value)}
                placeholder="https://www.minecraft.net/en-us/marketplace/pdp?id=..."
                required
              />
              {error && <div className={styles.error}>{error}</div>}
            </div>
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.submitButton}>Continue</button>
              <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>Add New Release</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Type</label>
            <div className={styles.tagInput}>
              <input
                type="text"
                value={typeInput}
                onChange={e => {
                  setTypeInput(e.target.value);
                  setShowTypeSuggestions(true);
                }}
                onFocus={() => setShowTypeSuggestions(true)}
                placeholder="Add a type"
              />
              <button 
                type="button" 
                onClick={() => {
                  if (typeInput && !formData.type.includes(typeInput)) {
                    setFormData({
                      ...formData,
                      type: [...formData.type, typeInput]
                    });
                    setTypeInput('');
                  }
                }}
                className={styles.addTagButton}
              >
                Add
              </button>
            </div>
            {showTypeSuggestions && typeInput && (
              <div className={styles.tagSuggestions}>
                {PROJECT_TYPES
                  .filter(type => 
                    type.toLowerCase().includes(typeInput.toLowerCase()) && 
                    !formData.type.includes(type)
                  )
                  .map(type => (
                    <span
                      key={type}
                      className={styles.tagSuggestion}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          type: [...formData.type, type]
                        });
                        setTypeInput('');
                        setShowTypeSuggestions(false);
                      }}
                    >
                      {type}
                    </span>
                  ))}
              </div>
            )}
            <div className={styles.selectedTags}>
              {formData.type.map(type => (
                <span key={type} className={styles.tag}>
                  {type}
                  <span 
                    className={styles.removeTag}
                    onClick={() => setFormData({
                      ...formData,
                      type: formData.type.filter(t => t !== type)
                    })}
                  >
                    ×
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Release Date</label>
            <div className={styles.dateTimeGroup}>
              <input
                required
                type="datetime-local"
                value={formData.releaseDate ? new Date(formData.releaseDate).toISOString().slice(0, 16) : ''}
                onChange={e => {
                  const date = new Date(e.target.value);
                  // Set time to 17:00:00.000Z
                  date.setUTCHours(17, 0, 0, 0);
                  setFormData({
                    ...formData,
                    releaseDate: date.toISOString()
                  });
                }}
              />
              <span className={styles.timeZoneHint}>Time will be set to 17:00:00 UTC</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              required
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Thumbnail URL (must be an image file)</label>
            <input
              required
              type="url"
              value={formData.thumbnail}
              onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Trailer URL (YouTube embed URL)</label>
            <input
              type="url"
              value={formData.trailer}
              onChange={e => setFormData({ ...formData, trailer: e.target.value })}
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>Minecraft Marketplace Link</label>
            <input
              required
              type="url"
              value={formData.link}
              onChange={e => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://minecraft.net/..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>Tags</label>
            <div className={styles.tagInput}>
              <input
                type="text"
                value={tagInput}
                onChange={e => {
                  const value = e.target.value;
                  setTagInput(value);
                  setShowSuggestions(true);
                  console.log('Input:', value);
                  console.log('Filtered tags:', existingTags.filter(tag => 
                    tag.toLowerCase().includes(value.toLowerCase()) && 
                    !formData.tags.includes(tag)
                  ));
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Add a tag"
              />
              <button 
                type="button" 
                onClick={() => {
                  if (tagInput) {
                    handleAddTag(tagInput);
                    setTagInput('');
                  }
                }}
                className={styles.addTagButton}
              >
                Add
              </button>
            </div>
            {showSuggestions && tagInput && (
              <div className={styles.tagSuggestions}>
                {filteredTags.map(tag => (
                  <span
                    key={tag}
                    className={styles.tagSuggestion}
                    onClick={() => {
                      handleAddTag(tag);
                      setTagInput('');
                      setShowSuggestions(false);
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className={styles.selectedTags}>
              {formData.tags.map(tag => (
                <span key={tag} className={styles.tag}>
                  {tag}
                  <span 
                    className={styles.removeTag}
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              Featured  
              <input
                type="checkbox"
                checked={formData.featured === 'true'}
                onChange={e => setFormData({ ...formData, featured: e.target.checked ? 'true' : '' })}
              />
            </label>
          </div>

          <div className={styles.formGroup}>
            <label>Price:</label>
            <input
              type="number"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              placeholder="Enter price"
              min="0"
              step="10"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Average Rating:</label>
            <input
              type="number"
              value={formData.averageRating}
              onChange={e => setFormData({ ...formData, averageRating: e.target.value })}
              placeholder="Enter average rating"
              min="0"
              max="5"
              step="0.1"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Total Ratings:</label>
            <input
              type="number"
              value={formData.totalRatings}
              onChange={e => setFormData({ ...formData, totalRatings: e.target.value })}
              placeholder="Enter total ratings"
              min="0"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>Add Release</button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
} 