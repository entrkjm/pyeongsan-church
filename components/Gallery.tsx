'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Gallery() {
  // 갤러리 이미지 목록 (나중에 동적으로 관리 가능)
  const galleryImages = [
    {
      src: '/images/church-event-1.jpg',
      alt: '교회 행사',
    },
    {
      src: '/images/church-event-2.jpg',
      alt: '교회 행사',
    },
    {
      src: '/images/church-gathering.png',
      alt: '교회 모임',
    },
    {
      src: '/images/church-sermon.png',
      alt: '설교 시간',
    },
    {
      src: '/images/church-interior-1.jpg',
      alt: '교회 내부',
    },
    {
      src: '/images/church-interior-2.jpg',
      alt: '교회 내부',
    },
  ];

  return (
    <section
      id="gallery"
      className="bg-white py-16 md:py-20 border-t border-text/10"
    >
      <div className="section-container">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-text mb-6">
            갤러리
          </h2>
          <p className="text-2xl md:text-3xl text-text-light">
            함께하는 교회의 모습
          </p>
        </motion.div>

        {/* 이미지 갤러리 그리드 */}
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  y: -4,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                className="relative overflow-hidden border-b border-text/10 cursor-pointer group"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

