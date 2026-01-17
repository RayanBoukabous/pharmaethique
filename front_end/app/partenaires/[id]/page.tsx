'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Loader2, ArrowLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getPartenaireById, type Partenaire, type Famille, type SousFamille, getLocalMediaUrl } from '@/lib/api'
import Link from 'next/link'

interface PartenaireWithFamilles extends Partenaire {
  familles: Famille[]
}

export default function PartenaireDetail({ params }: { params: { id: string } }) {
  const { language, t } = useLanguage()
  const [partenaire, setPartenaire] = useState<PartenaireWithFamilles | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPartenaire() {
      try {
        setLoading(true)
        setError(null)
        const data = await getPartenaireById(Number(params.id))
        if (data) {
          setPartenaire(data as PartenaireWithFamilles)
        } else {
          setError(t('common.notFound'))
        }
      } catch (err) {
        console.error('Erreur lors du chargement du partenaire:', err)
        setError('Impossible de charger le partenaire')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPartenaire()
    }
  }, [params.id])

  // Fonction pour obtenir le titre selon la langue
  const getTitre = (famille: Famille | SousFamille) => {
    if (language === 'ar' && famille.titre_ar) return famille.titre_ar
    if (language === 'en' && famille.titre_en) return famille.titre_en
    return famille.titre_fr
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex justify-center items-center py-40">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !partenaire) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="text-center py-40">
          <p className="text-red-500 mb-4">{error || t('common.notFound')}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {t('common.backToHome')}
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bouton retour */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 sm:mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-sm sm:text-base text-primary hover:text-primary-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t('common.backToHome')}</span>
            </Link>
          </motion.div>

          {/* Contenu principal */}
          <div className="w-full">
            {/* En-tête avec logo et nom */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 sm:mb-12"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8 mb-6 sm:mb-8">
                {partenaire.logo_url ? (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center bg-white rounded-2xl shadow-lg p-3 sm:p-4 flex-shrink-0">
                    <Image
                      src={getLocalMediaUrl(partenaire.logo_url) || partenaire.logo_url}
                      alt={partenaire.nom}
                      fill
                      className="object-contain"
                      unoptimized={getLocalMediaUrl(partenaire.logo_url)?.startsWith('http://105.96.71.28:9001') || partenaire.logo_url.startsWith('http://105.96.71.28:9001')}
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm text-gray-400">{t('common.noLogo')}</span>
                  </div>
                )}
                <div className="text-center sm:text-left flex-1">
                  <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-dark mb-3 sm:mb-4">
                    {partenaire.nom}
                  </h1>
                  {partenaire.url_site_web && (
                    <a
                      href={partenaire.url_site_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base md:text-lg text-primary hover:text-primary-dark transition-colors break-words"
                    >
                      {t('common.visitWebsite')} →
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Familles */}
            {partenaire.familles && partenaire.familles.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6 sm:space-y-8"
              >
                <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-primary-dark mb-6 sm:mb-8">
                  {t('common.productFamilies')}
                </h2>
                
                {partenaire.familles.map((famille, familleIndex) => {
                  const titreFamille = getTitre(famille)
                  const sousFamilles = famille.sous_familles || []
                  
                  return (
                    <motion.div
                      key={famille.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + familleIndex * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12"
                    >
                      {/* Titre de la famille */}
                      <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-primary-dark mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-primary-light">
                        {titreFamille}
                      </h3>
                      
                      {/* Sous-familles */}
                      {sousFamilles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
                          {sousFamilles.map((sousFamille, sousFamilleIndex) => {
                            const titreSousFamille = getTitre(sousFamille)
                            return (
                              <Link
                                key={sousFamille.id}
                                href={`/sous-familles/${sousFamille.id}?partenaire=${partenaire.id}`}
                              >
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.4, delay: 0.4 + familleIndex * 0.1 + sousFamilleIndex * 0.05 }}
                                  className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gradient-to-r from-primary-light/5 to-primary-dark/5 rounded-lg hover:from-primary-light/10 hover:to-primary-dark/10 transition-all group cursor-pointer"
                                >
                                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                  <span className="text-sm sm:text-base text-gray-700 font-medium group-hover:text-primary-dark transition-colors">
                                    {titreSousFamille}
                                  </span>
                                </motion.div>
                              </Link>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic mt-4">{t('common.noSubFamilies')}</p>
                      )}
                    </motion.div>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center"
              >
                <p className="text-gray-600 text-lg">{t('common.noFamilies')}</p>
              </motion.div>
            )}

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <Link
                href="/contact"
                className="inline-block px-8 py-4 bg-gradient-to-r from-primary-dark to-primary text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300"
              >
                {t('common.contactUs')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

