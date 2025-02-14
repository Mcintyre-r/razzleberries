import styles from './ProjectModal.module.css';
import Image from 'next/image';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import { Project } from '@/types/project';

interface ProjectModalProps { 
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className={styles.star} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" className={styles.star} />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className={styles.emptyStar} />);
    }

    return stars;
  };
  const contentTypes = (project: Project) => {
    if (Array.isArray(project.type)) {
      return project.type.join(' • ');
    }
    return project.type;
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <div className={styles.header}>
          <h2 className={styles.title}>{project.title}</h2>
          {project.averageRating && (
            <div className={styles.ratingContainer}>
              {renderStars(Number(project.averageRating))}
              <span className={styles.totalRatings}>({project.totalRatings})</span>
            </div>
          )}
        </div>
        
        <div className={styles.content}>
          
          <div className={styles.mainContent}>
            <div className={styles.mediaContainer}>
              {project.trailer ? (
                <iframe
                  src={project.trailer}
                  title="Trailer"
                  allowFullScreen
                  className={styles.video}
                />
              ) : (
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className={styles.thumbnail}
                  priority
                />
              )}
            </div>
            
            <div className={styles.projectInfo}>
              <span className={styles.type}>{contentTypes(project)}</span>
            </div>

            <p className={styles.description}>
              {project.description.split(/\\r\\n|\\n/).map((line, index) => (
                line ? <span key={index}>{line}<br/></span> : <br key={index}/>
              ))}
            </p>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.leftColumn}>
              <div className={styles.tags}>
                {project.tags
                  .filter(tag => tag && tag.trim() !== '')
                  .map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
              </div>
            </div>
          <a 
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.purchaseButton}
            style={{ textDecoration: 'none' }}
          >
            <span>Purchase</span>
            <div className={styles.priceContainer}>
              <Image 
                src="/minecoin.png" 
                alt="Minecoin" 
                width={20} 
                height={20} 
              />
              <span>{project.price}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
} 