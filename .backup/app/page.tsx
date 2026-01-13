import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { FeaturedProperties } from "@/components/landing/featured-properties"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Stats } from "@/components/landing/stats"
import { Testimonials } from "@/components/landing/testimonials"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedProperties />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  )
}
