'use client';

import { motion } from 'framer-motion';

export default function Location() {
  return (
    <section
      id="location"
      className="bg-base-light py-16 md:py-20 border-t border-text/10"
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
            오시는 길
          </h2>
          <p className="text-2xl md:text-3xl text-text-light">
            함께 모여 예배드리는 곳
          </p>
        </motion.div>

        {/* 주소 및 안내 정보 */}
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 md:p-12 border-b border-text/10 text-center space-y-6 md:space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-bold text-text">
                주소
              </h3>
              <p className="text-xl md:text-2xl text-text-light leading-relaxed">
                전남 무안군 현경면 함장로 84
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-bold text-text">
                교통 안내
              </h3>
              <div className="space-y-3 text-lg md:text-xl text-text-light">
                <p>• 주차 공간이 마련되어 있습니다</p>
                <p>• 대중교통 이용 시 안내가 필요하시면 연락 주세요</p>
              </div>
            </div>

            {/* 지도 영역 - 구글 지도 */}
            <div className="mt-8 md:mt-12">
              <div className="w-full h-[300px] md:h-[400px] overflow-hidden border border-text/10">
                <iframe
                  src="https://www.google.com/maps?q=전남+무안군+현경면+함장로+84&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

