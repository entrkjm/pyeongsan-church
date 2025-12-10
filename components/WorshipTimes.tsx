'use client';

import { motion } from 'framer-motion';

export default function WorshipTimes() {
  const worshipTimes = [
    {
      title: '주일예배',
      time: '오전 11:00',
      description: '주일 오전 예배',
      highlight: true,
    },
    {
      title: '수요예배',
      time: '저녁 7:00 (겨울) / 8:00 (여름)',
      description: '수요일 저녁 예배',
      highlight: false,
    },
    {
      title: '새벽예배',
      time: '새벽 5:00',
      description: '매일 새벽 예배',
      highlight: false,
    },
  ];

  return (
    <section
      id="worship"
      className="bg-[#f0f0f0] py-16 md:py-20 border-t border-text/10"
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
            예배 안내
          </h2>
          <p className="text-2xl md:text-3xl text-text-light">
            함께 모여 예배드리는 시간
          </p>
        </motion.div>

        {/* 예배 시간 목록 - 카드 레이아웃 (사각형) */}
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="space-y-6 md:space-y-8">
            {worshipTimes.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  y: -4,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                className={`
                  p-8 md:p-12 border-b border-text/10
                  ${item.highlight 
                    ? 'bg-base-light hover:bg-white/80' 
                    : 'bg-white hover:bg-base-light/60'
                  }
                  text-center cursor-default
                  shadow-sm hover:shadow-lg
                  transition-all duration-200
                `}
              >
                <div className="space-y-4 md:space-y-6">
                  <h3 className={`font-bold text-text ${
                    item.highlight 
                      ? 'text-4xl md:text-5xl' 
                      : 'text-3xl md:text-4xl'
                  }`}>
                    {item.title}
                  </h3>
                  <div className="space-y-2 md:space-y-3">
                    <p className={`
                      font-bold text-text inline-block px-6 md:px-8 py-3 md:py-4
                      ${item.highlight 
                        ? 'text-5xl md:text-6xl bg-white/60' 
                        : 'text-4xl md:text-5xl bg-base-light/60'
                      }
                      transition-all duration-300
                    `}>
                      {item.time}
                    </p>
                    <p className={`text-text-light ${
                      item.highlight 
                        ? 'text-2xl md:text-3xl' 
                        : 'text-xl md:text-2xl'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

