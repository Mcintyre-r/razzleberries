import Image from 'next/image';
import styles from './ProjectCard.module.css';
import { FaStar, FaStarHalf } from 'react-icons/fa';

interface ProjectCardProps {
  project: {
    title: string;
    description: string;
    thumbnail: string;
    tags: string[];
    price?: string;
    averageRating?: string;
    type: string;
  };
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    if (!numRating) return null;

    const stars = [];
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className={styles.star} />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" className={styles.star} />);
    }

    // Add empty stars to make total of 5
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className={styles.emptyStar} />);
    }

    return <div className={styles.rating}>{stars}</div>;
  };

  const hasTags = project.tags && project.tags.length > 0;
  const displayTags = hasTags ? project.tags.slice(0, 4) : [];
  const remainingTags = hasTags ? project.tags.length - 4 : 0;

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.thumbnailWrapper}>
        <Image
          src={project.thumbnail}
          alt={project.title}
          className={styles.thumbnail}
          width={300}
          height={150}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{project.title}</h3>
          <div className={styles.type}>{project.type}</div>
        </div>
        <div className={styles.priceRatingContainer}>
          {project.price && (
            <div className={styles.price}>
              <Image 
                src="/minecoin.png" 
                alt="Minecoin" 
                width={16} 
                height={16} 
              />
              <span>{project.price}</span>
            </div>
          )}
          {project.averageRating && renderStars(project.averageRating)}
        </div>
        {hasTags ? (
          <div className={styles.tags}>
            {displayTags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
            {remainingTags > 0 && (
              <span className={`${styles.tag} ${styles.moreTag}`}>
                ...{remainingTags} more tag{remainingTags === 1 ? '' : 's'}
              </span>
            )}
          </div>
        ) : (
          <p className={styles.description}>
            {project.description.split('$$')[0]}
          </p>
        )}
      </div>
    </div>
  );
} 