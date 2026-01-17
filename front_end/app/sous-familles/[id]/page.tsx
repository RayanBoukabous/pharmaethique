'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getSousFamilleById, type SousFamille, type ProduitFournisseur, type Catalogue } from '@/lib/api'
import { FileText, Download } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function SousFamilleDetail({ params }: { params: { id: string } }) {
  const { language, t } = useLanguage()
  const searchParams = useSearchParams()
  const [sousFamille, setSousFamille] = useState<SousFamille | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  useEffect(() => {
    async function fetchSousFamille() {
      try {
        setLoading(true)
        setError(null)
        const data = await getSousFamilleById(Number(params.id))
        if (data) {
          setSousFamille(data)
        } else {
          setError(t('common.notFound'))
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la sous-famille:', err)
        setError('Impossible de charger la sous-famille')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSousFamille()
    }
  }, [params.id])

  // Fonction pour obtenir le titre selon la langue
  const getTitre = (sousFamille: SousFamille) => {
    if (language === 'ar' && sousFamille.titre_ar) return sousFamille.titre_ar
    if (language === 'en' && sousFamille.titre_en) return sousFamille.titre_en
    return sousFamille.titre_fr
  }

  const handleImageError = (produitId: number) => {
    setImageErrors(prev => ({ ...prev, [produitId]: true }))
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

  if (error || !sousFamille) {
    const partenaireIdFromUrl = searchParams.get('partenaire')
    const partenaireId = partenaireIdFromUrl || sousFamille?.partenaire_id?.toString() || null
    const backUrl = partenaireId ? `/partenaires/${partenaireId}` : '/'
    return (
      <main className="min-h-screen">
        <Header />
        <div className="text-center py-40">
          <p className="text-red-500 mb-4">{error || t('common.notFound')}</p>
          <Link
            href={backUrl}
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {t('common.backToPartners')}
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const titre = getTitre(sousFamille)
  const produits = sousFamille.produits_fournisseur || []
  
  // Récupérer l'ID du partenaire depuis l'URL ou depuis les données de la sous-famille
  const partenaireId = searchParams.get('partenaire') || sousFamille.partenaire_id?.toString() || null
  const backUrl = partenaireId ? `/partenaires/${partenaireId}` : '/'

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
              href={backUrl}
              className="inline-flex items-center space-x-2 text-sm sm:text-base text-primary hover:text-primary-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t('common.backToPartners')}</span>
            </Link>
          </motion.div>

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

          {/* Produits fournisseur */}
          {produits.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full"
            >
              <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-primary-dark mb-6 sm:mb-8">
                {t('common.products')}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {produits.map((produit, index) => {
                  const imageError = imageErrors[produit.id] || false
                  
                  return (
                    <motion.div
                      key={produit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        {produit.image_url && !imageError ? (
                          <Image
                            src={produit.image_url}
                            alt={produit.nom}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            unoptimized={produit.image_url.startsWith('http://105.96.71.28:9001')}
                            onError={() => handleImageError(produit.id)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 text-sm">{t('common.noImage')}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Contenu */}
                      <div className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary-dark mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                          {produit.nom}
                        </h3>
                        
                        {/* Catalogues */}
                        {produit.catalogues && produit.catalogues.length > 0 && (
                          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 font-medium">{t('common.catalogues')} :</p>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {produit.catalogues.map((catalogue) => (
                                <a
                                  key={catalogue.id}
                                  href={catalogue.fichier_pdf_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-primary-light/10 hover:bg-primary-light/20 text-primary-dark rounded-lg transition-all group/catalog text-xs sm:text-sm"
                                >
                                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="font-medium break-words">
                                    {catalogue.nom || `Catalogue ${catalogue.id}`}
                                  </span>
                                  <Download className="w-3 h-3 opacity-0 group-hover/catalog:opacity-100 transition-opacity" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center"
            >
              <p className="text-gray-600 text-lg">
                {t('common.noProducts')}
              </p>
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
      </section>
      <Footer />
    </main>
  )
}

