'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSelector from './LanguageSelector'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { key: 'accueil', href: '/', scrollTo: 'accueil' },
  { key: 'produits', href: '/', scrollTo: 'produits' },
  { key: 'aPropos', href: '/', scrollTo: 'a-propos' },
  { key: 'partenaires', href: '/', scrollTo: 'partenaires' },
  { key: 'contact', href: '/contact', scrollTo: null },
]

export default function Header() {
  const { t, dir } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('accueil')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const [lastScrollY, setLastScrollY] = useState(0)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50)
    
    // Détecter la direction du scroll
    if (latest > lastScrollY && latest > 100) {
      setIsScrollingDown(true)
    } else {
      setIsScrollingDown(false)
    }
    setLastScrollY(latest)

    // Détecter la section active
    if (pathname === '/') {
      const sections = ['accueil', 'produits', 'a-propos', 'partenaires']
      const headerHeight = 80
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= headerHeight + 100 && rect.bottom >= headerHeight) {
            setActiveSection(i === 0 ? 'accueil' : section)
            break
          }
        }
      }
      
      // Si on est tout en haut, active accueil
      if (latest < 100) {
        setActiveSection('accueil')
      }
    } else if (pathname === '/contact') {
      setActiveSection('contact')
    } else {
      setActiveSection('accueil')
    }
  })

  // Initialiser la section active au chargement
  useEffect(() => {
    const updateActiveSection = () => {
      if (pathname === '/' && typeof window !== 'undefined') {
        const sections = ['accueil', 'produits', 'a-propos', 'partenaires']
        const headerHeight = 80
        const scrollY = window.scrollY
        
        if (scrollY < 100) {
          setActiveSection('accueil')
          return
        }
        
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i]
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            if (rect.top <= headerHeight + 100 && rect.bottom >= headerHeight) {
              setActiveSection(i === 0 ? 'accueil' : section)
              break
            }
          }
        }
      } else if (pathname === '/contact') {
        setActiveSection('contact')
      }
    }
    
    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection)
    return () => window.removeEventListener('scroll', updateActiveSection)
  }, [pathname])

  // Gérer le scroll après navigation vers la page d'accueil
  useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1) // Enlever le #
      if (hash) {
        // Attendre que le DOM soit prêt
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            const headerOffset = 80
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            })
          }
        }, 300)
      }
    }
  }, [pathname])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: (typeof navItems)[0]) => {
    if (item.scrollTo) {
      e.preventDefault()
      
      // Si on n'est pas sur la page d'accueil, naviguer d'abord vers elle
      if (pathname !== '/') {
        if (item.scrollTo === 'accueil') {
          router.push('/')
        } else {
          router.push(`/#${item.scrollTo}`)
        }
        setIsMobileMenuOpen(false)
        return
      }
      
      // Si on est déjà sur la page d'accueil, scroller normalement
      if (item.scrollTo === 'accueil') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      } else {
        const element = document.getElementById(item.scrollTo)
        if (element) {
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }
      }
      setIsMobileMenuOpen(false)
    } else {
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ 
        y: isScrollingDown ? -100 : 0
      }}
      transition={{ 
        duration: 0.3,
        ease: 'easeInOut'
      }}
      className={`fixed top-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} ${dir === 'rtl' ? 'left-0' : 'right-0'} z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg py-3'
          : 'bg-white/95 backdrop-blur-sm py-4'
      }`}
    >
      {/* Gradient border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#004744] via-[#018276] to-[#00AAA3]"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Image
                src="/logo/logo_pharma.jpg"
                alt="Pharma Ethique Logo"
                width={120}
                height={60}
                className="h-auto w-auto object-contain"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center ${dir === 'rtl' ? 'space-x-reverse' : ''} space-x-8`}>
            {navItems.map((item, index) => (
              <motion.div
                key={item.href + item.key}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`font-medium text-sm transition-colors relative group ${
                    (item.scrollTo && activeSection === item.scrollTo) || 
                    (item.key === 'accueil' && activeSection === 'accueil') ||
                    (item.key === 'contact' && activeSection === 'contact')
                      ? 'text-primary-dark'
                      : 'text-gray-700 hover:text-primary-dark'
                  }`}
                >
                  {t(`nav.${item.key}`)}
                  <span 
                    className={`absolute bottom-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} h-0.5 bg-gradient-to-r from-[#004744] via-[#018276] to-[#00AAA3] transition-all duration-300 ${
                      (item.scrollTo && activeSection === item.scrollTo) || 
                      (item.key === 'accueil' && activeSection === 'accueil') ||
                      (item.key === 'contact' && activeSection === 'contact')
                        ? 'w-full'
                        : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>
              </motion.div>
            ))}
            <LanguageSelector />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.nav
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href + item.key}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`block font-medium py-2 transition-colors relative ${
                  (item.scrollTo && activeSection === item.scrollTo) || 
                  (item.key === 'accueil' && activeSection === 'accueil') ||
                  (item.key === 'contact' && activeSection === 'contact')
                    ? 'text-primary-dark'
                    : 'text-gray-700 hover:text-primary-dark'
                }`}
              >
                {t(`nav.${item.key}`)}
                {((item.scrollTo && activeSection === item.scrollTo) || 
                  (item.key === 'accueil' && activeSection === 'accueil') ||
                  (item.key === 'contact' && activeSection === 'contact')) && (
                  <span className={`absolute bottom-1 ${dir === 'rtl' ? 'right-0' : 'left-0'} w-8 h-0.5 bg-gradient-to-r from-[#004744] via-[#018276] to-[#00AAA3]`}></span>
                )}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <LanguageSelector />
            </div>
          </div>
        </motion.nav>
      </div>
    </motion.header>
  )
}

