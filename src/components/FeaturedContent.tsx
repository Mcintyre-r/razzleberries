'use client';

import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import styles from './FeaturedContent.module.css';
import Image from 'next/image';
import Link from 'next/link';
import projectsData from '../data/projects.json';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function FeaturedContent() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const swiperRef = useRef<SwiperType>(null);

  const featuredProjects = projectsData.projects.filter(project => project.featured);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (swiperRef.current) {
      swiperRef.current.autoplay.start();
    }
  };

  return (
    <div className={`${styles.carouselContainer} ${styles.swiperButtons}`}>
      <Swiper
        modules={[Navigation, Pagination, EffectFade, Autoplay]}
        effect="fade"
        speed={100}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        slidesPerView={1.5}
        centeredSlides={true}
        spaceBetween={30}
        autoplay={{
          delay: 30000,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        className={styles.featuredSwiper}
      >
        {featuredProjects.map((project, index) => (
          <SwiperSlide 
            key={project.id}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.slideContent}>
              <div className={styles.slideBadge}>
                {project.title}
              </div>
              {activeIndex === index ? (
                <iframe
                  className={styles.slideVideo}
                  src={`${project.trailer}?autoplay=1&mute=1&controls=0&loop=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className={styles.slideBanner}
                />
              )}
              <div className={`${styles.slideOverlay} ${isHovered ? styles.visible : ''}`}>
                <h3 className={styles.slideTitle}>{project.title}</h3>
                <p className={styles.slideDescription}>{project.description}</p>
                <div className={styles.buttonGroup}>
                  <Link
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.purchaseButton}
                  >
                    <span>Purchase</span>
                    <Image 
                      src="/minecoin.png" 
                      alt="Minecoin" 
                      width={24} 
                      height={24}
                      className={styles.minecoinIcon}
                    />
                  </Link>
                  {project.trailer && (
                    <Link
                      href={project.trailer}
                      className={styles.trailerButton}
                      target="_blank"
                    >
                      Watch Trailer
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 