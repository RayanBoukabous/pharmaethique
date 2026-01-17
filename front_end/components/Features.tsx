'use client'

import { motion } from 'framer-motion'
import { FlaskConical, Microscope, Shield, Users } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const features = [
  {
    icon: FlaskConical,
    key: 'reactifs',
  },
  {
    icon: Microscope,
    key: 'equipements',
  },
  {
    icon: Shield,
    key: 'certification',
  },
  {
    icon: Users,
    key: 'accompagnement',
  },
]

export default function Features() {
  const { t } = useLanguage()
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-primary-dark mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-primary-dark rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary-dark mb-2">
                {t(`features.${feature.key}.title`)}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t(`features.${feature.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

