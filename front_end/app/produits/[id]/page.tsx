'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Loader2, ChevronRight, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProduitById, type Produit } from '@/lib/api'
import Link from 'next/link'

interface ProduitWithPartners extends Produit {
  partenaires: Array<{
    id: number
    nom: string
    logo: string
    logo_url: string
    url_site_web: string
  }>
}

export default function ProduitDetail({ params }: { params: { id: string } }) {
  const { language, t } = useLanguage()
  const [produit, setProduit] = useState<ProduitWithPartners | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduit() {
      try {
        setLoading(true)
        setError(null)
        const data = await getProduitById(Number(params.id))
        if (data) {
          setProduit(data as ProduitWithPartners)
        } else {
          setError(t('common.notFound'))
        }
      } catch (err) {
        console.error('Erreur lors du chargement du produit:', err)
        setError('Impossible de charger le produit')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduit()
    }
  }, [params.id])

  // Fonction pour obtenir le titre selon la langue
  const getTitre = (produit: Produit) => {
    if (language === 'ar' && produit.titre_ar) return produit.titre_ar
    if (language === 'en' && produit.titre_en) return produit.titre_en
    return produit.titre_fr
  }

  // Fonction pour obtenir la description selon la langue
  const getDescription = (produit: Produit) => {
    if (language === 'ar' && produit.description_ar) return produit.description_ar
    if (language === 'en' && produit.description_en) return produit.description_en
    return produit.description_fr
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

  if (error || !produit) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="text-center py-40">
          <p className="text-red-500 mb-4">{error || t('common.notFound')}</p>
          <Link
            href="/#produits"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {t('common.backToProducts')}
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const titre = getTitre(produit)
  const description = getDescription(produit)

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
              href="/#produits"
              className="inline-flex items-center space-x-2 text-sm sm:text-base text-primary hover:text-primary-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t('common.backToProducts')}</span>
            </Link>
          </motion.div>

          {/* Contenu principal */}
          <div className="w-full">
            {/* Titre */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 sm:mb-12"
            >
              <h1 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-dark mb-3 sm:mb-4">
                {titre}
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 mb-8 sm:mb-12"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-primary-dark mb-4 sm:mb-6">
                {t('common.description')}
              </h2>
              <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>
            </motion.div>

            {/* Partenaires associés */}
            {produit.partenaires && produit.partenaires.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-primary-light/10 to-primary-dark/10 rounded-2xl p-6 sm:p-8 md:p-12"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-primary-dark mb-6 sm:mb-8">
                  {t('common.associatedPartners')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {produit.partenaires.map((partenaire, index) => (
                    <Link
                      key={partenaire.id}
                      href={`/partenaires/${partenaire.id}`}
                      passHref
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-4 sm:p-6 text-center group cursor-pointer"
                      >
                      {partenaire.logo_url ? (
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                          <Image
                            src={partenaire.logo_url}
                            alt={partenaire.nom}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform duration-300"
                            sizes="96px"
                            unoptimized={partenaire.logo_url.startsWith('http://localhost:8001')}
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-sm">{t('common.noLogo')}</span>
                        </div>
                      )}
                        <h3 className="text-base sm:text-lg font-bold text-primary-dark mb-2 group-hover:text-primary transition-colors">
                          {partenaire.nom}
                        </h3>
                        <div className="flex items-center justify-center space-x-2 text-primary text-xs sm:text-sm opacity-60 group-hover:opacity-100 transition-opacity">
                          <span>{t('common.viewFamilies')}</span>
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
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

