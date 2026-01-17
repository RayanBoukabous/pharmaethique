'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProduitsActifs, type Produit, getLocalMediaUrl } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function ProductsSection() {
  const { t, language } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [products, setProducts] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)
        const data = await getProduitsActifs()
        setProducts(data)
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err)
        setError('Impossible de charger les produits')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  // Fonction pour obtenir le titre selon la langue
  const getTitre = (product: Produit) => {
    if (language === 'ar' && product.titre_ar) return product.titre_ar
    if (language === 'en' && product.titre_en) return product.titre_en
    return product.titre_fr
  }

  // Fonction pour obtenir la description selon la langue
  const getDescription = (product: Produit) => {
    if (language === 'ar' && product.description_ar) return product.description_ar
    if (language === 'en' && product.description_en) return product.description_en
    return product.description_fr
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {/* Title Section */}
          <motion.div
            variants={cardVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('products.title')}
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

          {/* Cards Grid */}
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
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">Aucun produit disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {products.map((product, index) => {
                const imageError = imageErrors[product.id] || false
                const titre = getTitre(product)
                const description = getDescription(product)
                
                return (
                  <motion.div
                    key={product.id}
                    variants={cardVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/produits/${product.id}`}>
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        {product.image_couverture_url && !imageError ? (
                          <Image
                            src={getLocalMediaUrl(product.image_couverture_url) || product.image_couverture_url}
                            alt={titre}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={() => handleImageError(product.id)}
                            unoptimized={getLocalMediaUrl(product.image_couverture_url)?.startsWith('http://105.96.71.28:9001') || product.image_couverture_url.startsWith('http://105.96.71.28:9001')}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-light/10 to-primary-dark/10">
                            <div className="text-center p-4">
                              <div className="w-16 h-16 bg-primary-light/30 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                <div className="w-8 h-8 bg-primary rounded"></div>
                              </div>
                              <p className="text-xs text-gray-500">Image à ajouter</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-primary-dark mb-2 group-hover:text-primary transition-colors">
                          {titre}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {description}
                        </p>
                      </div>
                    </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Call to Action */}
          <motion.div
            variants={cardVariants}
            className="text-center mt-12"
          >
            <motion.a
              href="/#produits"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-gradient-to-r from-primary-dark to-primary text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300"
            >
              {t('products.cta')}
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

