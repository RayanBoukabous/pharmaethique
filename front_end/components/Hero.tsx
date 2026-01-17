'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Hero() {
  const { t, dir } = useLanguage()
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 items-center ${dir === 'rtl' ? 'direction-rtl' : ''}`}>
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`lg:col-span-3 ${dir === 'rtl' ? 'order-2 lg:order-2' : 'order-2 lg:order-1'}`}
          >
            <div className="relative">
              <div className="relative z-10">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/index/tube.jpg"
                    alt="Laboratoire - Réactifs et équipements"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/10 to-primary-light/10"></div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-light/20 to-primary-dark/20 rounded-2xl blur-2xl -z-10"></div>
            </div>
          </motion.div>

          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className={`lg:col-span-2 ${dir === 'rtl' ? 'order-1 lg:order-1' : 'order-1 lg:order-2'} space-y-4 sm:space-y-6`}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-dark leading-tight"
            >
              {t('hero.title')}{' '}
              <span className="text-primary">{t('hero.titleHighlight')}</span> {t('hero.titleEnd')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed"
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group inline-flex items-center justify-center ${dir === 'rtl' ? 'space-x-reverse' : ''} space-x-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-white border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto`}
                >
                  <span>{t('hero.cta')}</span>
                  <ArrowRight className={`w-5 h-5 transition-transform ${dir === 'rtl' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-dark/10 rounded-full blur-3xl -z-10"></div>
    </section>
  )
}

