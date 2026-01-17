'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ReactifsSection() {
  const { t, dir } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${dir === 'rtl' ? 'direction-rtl' : ''}`}>
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-6"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-primary-dark via-primary to-primary-light bg-clip-text text-transparent"
            >
              {t('reactifs.title')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-700 leading-relaxed"
            >
              {t('reactifs.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group inline-flex items-center ${dir === 'rtl' ? 'space-x-reverse' : ''} space-x-2 px-8 py-4 bg-white border-2 border-red-500 text-gray-900 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  <span>{t('reactifs.cta')}</span>
                  <ArrowRight className={`w-5 h-5 transition-transform ${dir === 'rtl' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/index/reactifs.jpg"
                alt="Réactifs médicaux de haute qualité"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/5 to-primary-light/5"></div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-light/20 to-primary-dark/20 rounded-2xl blur-2xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

