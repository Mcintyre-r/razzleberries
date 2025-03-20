'use client';

import { useState, useEffect } from "react";
import styles from './page.module.css';
import Modal from '@/components/Modal';
import FeaturedContent from '@/components/FeaturedContent';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import ProjectModal from '@/components/ProjectModal';
import Image from 'next/image';
import { Project } from '@/types/project';

interface ClientPageProps {
  initialProjects: {
    projects: Project[];
  };
}

export default function ClientPage({ initialProjects }: ClientPageProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects] = useState(initialProjects);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20 && !hasScrolled) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  const latestReleases = [...projects.projects]
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 3);

  return (
    <main className={`${styles.main} ${hasScrolled ? styles.collapsed : ''}`}>
      <section className={styles.hero} aria-label="Introduction">
        {hasScrolled && (
          <div className={styles.videoBackground}>
            <div className={styles.videoOverlay}></div>
            <iframe
              className={styles.backgroundVideo}
              src="https://www.youtube.com/embed/lQkqCbD5xjA?autoplay=1&mute=1&controls=0&loop=1&playlist=lQkqCbD5xjA"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            WHO ARE THE BERRIES?
            <div className={styles.titleBar} aria-hidden="true"></div>
          </h1>
          <div className={styles.heroButtons}>
            <button 
              className={styles.primaryButton}
              onClick={() => setIsModalOpen(true)}
            >
              LEARN MORE
            </button>
            <Link 
              href="/projects"
              className={styles.buyButton}
            >
              CHECK US OUT
            </Link>
          </div>
        </div>
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <div className={styles.modalTextContent}>
            <p>
              Razzleberries is a founding partner and industry leader on the Minecraft Marketplace. We are a community of talented programmers, builders, and artists that have collectively acquired over a quarter billion mod downloads, 2.3 million Marketplace sales, and countless builds, textures and models.
            </p>
            <p>
              We have earned well over 115 thousand 5-star reviews spanning more than 260 pieces of unique and innovative content while maintaining an average rating of nearly 4.4 stars.
            </p>
            <p>
              Over many years, our team has left its mark on Minecraft in ways no other team has. Whether it be through official collaborations with Mojang and Microsoft, additions to and development of Minecraft itself, or large scale advertising and showcasing campaigns – Razzleberries continues to provide a track record of creativity and innovation on a truly professional scale.
            </p>
          </div>
          <Image 
            src="/RB_Berry_White.png" 
            alt="RazzAB Berry White" 
            className={styles.modalImage}
            width={100}
            height={100}
          />
        </div>
      </Modal>

      <section className={styles.featuredSection} aria-label="Featured Content">
        <h2 className={styles.sectionTitle}>FEATURED CONTENT</h2>
        <FeaturedContent />
      </section>

      <section className={styles.newsSection} aria-label="Latest Releases">
        <h2 className={styles.sectionTitle}>LATEST RELEASES</h2>
        <div className={styles.latestReleasesGrid}>
          {latestReleases.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
        <div className={styles.moreReleasesContainer}>
          <Link href="/projects" className={styles.moreReleasesButton}>
            Check out more releases
          </Link>
        </div>
      </section>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </main>
  );
} 
