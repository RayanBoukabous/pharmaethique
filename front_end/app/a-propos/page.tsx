'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function APropos() {
  const { t } = useLanguage()
  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-dark mb-4 sm:mb-6">
              {t('aPropos.title')}
            </h1>
            <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none space-y-4 sm:space-y-6 text-gray-700">
              <p className="text-base sm:text-lg md:text-xl leading-relaxed">
                {t('aPropos.intro')}
              </p>
              <p className="text-sm sm:text-base">
                {t('aPropos.foundation')}
              </p>
              <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-primary-dark mt-6 sm:mt-8 mb-3 sm:mb-4">
                {t('aPropos.missionTitle')}
              </h2>
              <p className="text-sm sm:text-base">
                {t('aPropos.mission')}
              </p>
              <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-primary-dark mt-6 sm:mt-8 mb-3 sm:mb-4">
                {t('aPropos.valuesTitle')}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
                <li>{t('aPropos.values.excellence')}</li>
                <li>{t('aPropos.values.ethique')}</li>
                <li>{t('aPropos.values.innovation')}</li>
                <li>{t('aPropos.values.service')}</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

