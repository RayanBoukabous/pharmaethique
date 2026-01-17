'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-primary-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{t('footer.company')}</h3>
            <p className="text-primary-light text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
              {t('footer.description')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex items-start space-x-2">
                <Phone className="w-4 h-4 text-primary-light mt-1 flex-shrink-0" />
                <div className="text-primary-light">
                  <p>023.60.70.33 / 29 / 56</p>
                  <p>023.60.70.33 / 56</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="w-4 h-4 text-primary-light mt-1 flex-shrink-0" />
                <a
                  href="mailto:sarl.pharmaethique@gmail.com"
                  className="text-primary-light hover:text-white transition-colors"
                >
                  sarl.pharmaethique@gmail.com
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-primary-light mt-1 flex-shrink-0" />
                <div className="text-primary-light">
                  <p>Résidence J8, Appreval Lot C N° 169</p>
                  <p>16055 Kouba Alger</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('footer.links')}</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/"
                  className="text-primary-light hover:text-white transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/a-propos"
                  className="text-primary-light hover:text-white transition-colors"
                >
                  À Propos
                </Link>
              </li>
              <li>
                <Link
                  href="/#produits"
                  className="text-primary-light hover:text-white transition-colors"
                >
                  Produits & Équipements
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-primary-light hover:text-white transition-colors"
                >
                  Contactez-nous
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-primary mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-primary-light"
        >
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
        </motion.div>
      </div>
    </footer>
  )
}

