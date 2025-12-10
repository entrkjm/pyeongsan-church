'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-base"
    >
      {/* 배경 이미지 - 교회 행사 사진 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/church-event-1.jpg"
          alt="무안 평산교회 공동체"
          fill
          className="object-cover"
          priority
          quality={95}
        />
        {/* 오버레이 - 텍스트 가독성 향상 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10" />
        {/* 밝은 오버레이로 텍스트 영역 강조 */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent z-10" />
      </div>

      {/* 콘텐츠 - 애플 스타일: 왼쪽 정렬, 큰 타이포그래피 */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="section-container w-full">
          <div className="max-w-5xl px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8 md:space-y-10"
            >
              {/* 메인 헤드라인 - 매우 큰 타이포그래피, 흰색으로 변경 */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-[-0.02em] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                <span className="block">당신을</span>
                <span className="block mt-2 md:mt-3">환영합니다</span>
              </h1>
              
              {/* 서브텍스트 - 흰색, 명확한 계층 구조 */}
              <div className="space-y-3 pt-6">
                <p className="text-2xl md:text-3xl lg:text-4xl text-white/95 font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                  믿음, 소망, 사랑의 공동체
                </p>
                <p className="text-2xl md:text-3xl lg:text-4xl text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                  무안 평산교회입니다
                </p>
              </div>

              {/* 버튼 영역 - 간결하고 모던하게 */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <motion.a
                  href="#worship"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-text text-body font-semibold 
                             transition-all duration-200 hover:bg-white/95 active:scale-[0.97] shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  예배 시간 안내
                </motion.a>
                <motion.a
                  href="#about"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-md text-white border-2 border-white/50 text-body font-semibold 
                             transition-all duration-200 hover:bg-white/20 hover:border-white/70 active:scale-[0.97]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  교회 소개
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, repeat: Infinity, duration: 2 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-text/30 rounded-full flex justify-center p-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-1 h-3 bg-text/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
