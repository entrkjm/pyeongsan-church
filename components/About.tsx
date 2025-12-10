'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  return (
    <section
      id="about"
      className="bg-base-light"
    >
      {/* 섹션 헤더 */}
      <div className="pt-28 md:pt-32 pb-12 md:pb-10 flex items-center justify-center bg-base-light border-b border-text/10">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2
              className="text-5xl md:text-7xl font-bold text-text mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              교회 소개
            </motion.h2>
            <motion.p
              className="text-2xl md:text-3xl text-text-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              믿음, 소망, 사랑으로 함께하는 공동체
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* 담임목사 인사말 섹션 - 명확한 구분 */}
      <div className="py-8 md:py-6 flex items-center bg-white border-b border-text/10">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto pl-0 pr-4 md:px-6"
          >
            {/* 콘텐츠 그리드 - 이미지 왼쪽, 텍스트 오른쪽 */}
            <div className="grid md:grid-cols-[1.1fr_1fr] gap-y-4 md:gap-y-0 md:gap-4 lg:gap-2 items-center">
              {/* 이미지 영역 - 왼쪽 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative order-1"
              >
                <div className="relative overflow-hidden w-full max-w-[400px] md:max-w-[500px] mx-0 md:mx-0">
                  <Image
                    src="/images/profile.png"
                    alt="담임목사님"
                    width={400}
                    height={500}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </motion.div>

              {/* 텍스트 영역 - 오른쪽 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6 order-2"
              >
                <h3 className="text-headline-mobile md:text-3xl font-bold text-text">
                  담임목사 인사말
                </h3>
                <div className="space-y-4 text-body-mobile md:text-body text-text-light leading-relaxed">
                  <p>
                    평산성결교회에 오신 것을 환영합니다. 저희 교회는 기독교대한성결교회 소속으로,
                    하나님의 사랑과 은혜를 나누며 함께 성장하는 공동체입니다.
                  </p>
                  <p>
                    예배와 기도, 말씀과 교제를 통해 하나님과 이웃을 사랑하는 제자로 세워가며,
                    지역 사회에 복음을 전하는 사명을 감당하고 있습니다.
                  </p>
                  <p className="text-text font-medium">
                    "이제 믿음, 소망, 사랑, 이 세 가지는 항상 있을 것인데 그 중의 제일은 사랑이라"
                    <br />
                    <span className="text-body-mobile text-text-light">- 고린도전서 13:13</span>
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 교회 특징 카드 - 각각 명확한 구분 */}
      {[
        {
          title: '말씀 중심',
          description: '성경 말씀을 바탕으로 한 설교와 가르침',
          image: '/images/church-sermon.png',
          bgColor: 'bg-base-light',
        },
        {
          title: '공동체',
          description: '함께 모여 사랑을 나누는 교회',
          image: '/images/church-gathering.png',
          bgColor: 'bg-white',
        },
        {
          title: '사랑 실천',
          description: '이웃과 지역 사회를 섬기는 교회',
          image: '/images/church-interior-1.jpg',
          bgColor: 'bg-base-light',
        },
      ].map((item, index) => (
        <div 
          key={item.title} 
          className={`py-8 md:py-6 flex items-center ${item.bgColor} border-b border-text/10 last:border-b-0`}
        >
          <div className="section-container w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-7xl mx-auto pl-0 pr-4 md:px-6"
            >
              <div className="grid md:grid-cols-[1.5fr_1fr] gap-y-4 md:gap-y-0 md:gap-2 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="order-2 md:order-1"
                >
                  <h4 className="text-4xl md:text-5xl font-bold text-text mb-4">{item.title}</h4>
                  <p className="text-xl md:text-2xl text-text-light">{item.description}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative order-1 md:order-2"
                >
                  <div className="relative overflow-hidden w-full max-w-none md:max-w-none mx-0 md:mx-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={600}
                      height={750}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      ))}
    </section>
  );
}

