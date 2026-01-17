import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import ProductsSection from '@/components/ProductsSection'
import ReactifsSection from '@/components/ReactifsSection'
import PartnersSection from '@/components/PartnersSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <section id="accueil">
        <Hero />
      </section>
      <Features />
      <section id="produits">
        <ProductsSection />
      </section>
      <section id="a-propos">
        <ReactifsSection />
      </section>
      <section id="partenaires">
        <PartnersSection />
      </section>
      <Footer />
    </main>
  )
}

