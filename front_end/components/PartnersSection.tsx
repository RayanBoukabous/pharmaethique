'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Loader2, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getPartenairesActifs, type Partenaire, getLocalMediaUrl } from '@/lib/api'

export default function PartnersSection() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [partners, setPartners] = useState<Partenaire[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPartners() {
      try {
        setLoading(true)
        setError(null)
        const data = await getPartenairesActifs()
        setPartners(data)
      } catch (err) {
        console.error('Erreur lors du chargement des partenaires:', err)
        setError('Impossible de charger les partenaires')
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {/* Title */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('partners.title')}
            </h2>
            <div className="flex justify-center">
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: '80px' } : { width: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-1 bg-red-500 rounded-full"
              />
            </div>
          </motion.div>

          {/* Info text */}
          <motion.p
            variants={itemVariants}
            className="text-center text-gray-600 mb-8 text-sm"
          >
            {t('partners.info')}
          </motion.p>

          {/* Partners Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <p className="text-gray-600 text-sm">
                Veuillez vérifier que le backend est accessible sur http://105.96.71.28:9001
              </p>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">Aucun partenaire disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-7xl mx-auto">
              {/* First Row - 3 partners on desktop, responsive on mobile */}
              {partners.slice(0, 3).map((partner) => {
                const cardContent = (
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group relative flex flex-col items-center justify-center p-8 bg-white rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                      isHomePage
                        ? 'border border-gray-200 hover:border-primary hover:shadow-lg'
                        : 'border-2 border-gray-200 hover:border-primary hover:shadow-2xl'
                    }`}
                  >
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-primary-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10 flex flex-col items-center space-y-3 sm:space-y-4 w-full">
                      <div className="relative w-full h-20 sm:h-24 flex items-center justify-center">
                        {partner.logo_url ? (
                          <Image
                            src={getLocalMediaUrl(partner.logo_url) || partner.logo_url}
                            alt={partner.nom}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized={getLocalMediaUrl(partner.logo_url)?.startsWith('http://105.96.71.28:9001') || partner.logo_url.startsWith('http://105.96.71.28:9001')}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-xs sm:text-sm">Pas de logo</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Click indicator - different for home page */}
                      {isHomePage ? (
                        partner.url_site_web ? (
                          <div className="flex items-center justify-center space-x-2 text-primary text-xs sm:text-sm font-medium">
                            <span className="opacity-60 group-hover:opacity-100 transition-opacity">{t('common.visitWebsite')}</span>
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-60 group-hover:opacity-100 transition-all" />
                          </div>
                        ) : null
                      ) : (
                        <div className="flex items-center justify-center space-x-2 text-primary text-xs sm:text-sm font-medium">
                          <span className="opacity-60 group-hover:opacity-100 transition-opacity">{t('common.viewFamilies')}</span>
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )

                // On home page, use external link if url_site_web exists, otherwise use internal link
                if (isHomePage && partner.url_site_web) {
                  return (
                    <a
                      key={partner.id}
                      href={partner.url_site_web}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cardContent}
                    </a>
                  )
                }

                // Otherwise use internal link
                return (
                  <Link
                    key={partner.id}
                    href={`/partenaires/${partner.id}`}
                    passHref
                  >
                    {cardContent}
                  </Link>
                )
              })}

              {/* Second Row - 2 partners + empty space (only on desktop) */}
              {partners.slice(3, 5).map((partner) => {
                const cardContent = (
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-white rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                      isHomePage
                        ? 'border border-gray-200 hover:border-primary hover:shadow-lg'
                        : 'border-2 border-gray-200 hover:border-primary hover:shadow-2xl'
                    }`}
                  >
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-primary-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10 flex flex-col items-center space-y-3 sm:space-y-4 w-full">
                      <div className="relative w-full h-20 sm:h-24 flex items-center justify-center">
                        {partner.logo_url ? (
                          <Image
                            src={getLocalMediaUrl(partner.logo_url) || partner.logo_url}
                            alt={partner.nom}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized={getLocalMediaUrl(partner.logo_url)?.startsWith('http://105.96.71.28:9001') || partner.logo_url.startsWith('http://105.96.71.28:9001')}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-xs sm:text-sm">Pas de logo</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Click indicator - different for home page */}
                      {isHomePage ? (
                        partner.url_site_web ? (
                          <div className="flex items-center justify-center space-x-2 text-primary text-xs sm:text-sm font-medium">
                            <span className="opacity-60 group-hover:opacity-100 transition-opacity">{t('common.visitWebsite')}</span>
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-60 group-hover:opacity-100 transition-all" />
                          </div>
                        ) : null
                      ) : (
                        <div className="flex items-center justify-center space-x-2 text-primary text-xs sm:text-sm font-medium">
                          <span className="opacity-60 group-hover:opacity-100 transition-opacity">{t('common.viewFamilies')}</span>
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )

                // On home page, use external link if url_site_web exists, otherwise use internal link
                if (isHomePage && partner.url_site_web) {
                  return (
                    <a
                      key={partner.id}
                      href={partner.url_site_web}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cardContent}
                    </a>
                  )
                }

                // Otherwise use internal link
                return (
                  <Link
                    key={partner.id}
                    href={`/partenaires/${partner.id}`}
                    passHref
                  >
                    {cardContent}
                  </Link>
                )
              })}
              
              {/* Empty space for 6th partner if less than 5 partners (hidden on mobile) */}
              {partners.length < 5 && partners.length >= 3 && (
                <motion.div
                  variants={itemVariants}
                  className="hidden lg:block p-8 bg-transparent rounded-xl border-2 border-transparent"
                />
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

