'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-[#f0f0f0] py-4 md:py-5 border-t border-text/10">
      <div className="section-container">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* 모든 정보를 한 줄에 */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-xs" style={{ color: '#1d1d1f' }}>
              <span style={{ color: '#1d1d1f' }}>평산성결교회</span>
              <span className="hidden md:inline" style={{ color: '#1d1d1f' }}>|</span>
              <span style={{ color: '#1d1d1f' }}>전남 무안군 현경면 함장로 84</span>
              <span className="hidden md:inline" style={{ color: '#1d1d1f' }}>|</span>
              <span style={{ color: '#1d1d1f' }}>기독교대한성결교회</span>
              <span className="hidden md:inline" style={{ color: '#1d1d1f' }}>|</span>
              <span style={{ color: '#1d1d1f' }}>Tel. 010-7169-0191 </span>
            </div>

            {/* 저작권 정보 */}
            <div className="mt-3">
              <p className="text-xs" style={{ color: '#1d1d1f' }}>
                © {new Date().getFullYear()} 평산성결교회. All rights reserved.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

