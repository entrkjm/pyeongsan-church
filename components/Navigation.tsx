'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: '홈', href: '#home' },
    { name: '교회 소개', href: '#about' },
    { name: '예배 안내', href: '#worship' },
    { name: '오시는 길', href: '#location' },
    { name: '설교/갤러리', href: '#gallery' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#fafafa]/95 backdrop-blur-xl shadow-sm' 
          : 'bg-[#fafafa]/90 backdrop-blur-lg'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* 로고 */}
          <motion.a
            href="#home"
            className="flex items-center gap-2 text-xl md:text-2xl font-semibold text-text transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image
                src="/images/logo_img.png"
                alt="무안 평산교회 로고"
                fill
                className="object-contain"
              />
            </div>
            무안 평산교회
          </motion.a>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-body text-text/80 hover:text-text transition-colors"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="메뉴"
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
              <motion.span
                className="w-full h-0.5 rounded bg-text/80"
                animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : {}}
              />
              <motion.span
                className="w-full h-0.5 rounded bg-text/80"
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.span
                className="w-full h-0.5 rounded bg-text/80"
                animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : {}}
              />
            </div>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-text/10"
          >
            <div className="section-container py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-body text-text/80 hover:text-text transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

