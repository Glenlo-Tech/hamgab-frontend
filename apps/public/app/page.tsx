import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Footer } from "@/components/landing/footer"
import dynamic from "next/dynamic"

const FeaturedProperties = dynamic(() =>
  import("@/components/landing/featured-properties").then((mod) => mod.FeaturedProperties)
)
const HowItWorks = dynamic(() =>
  import("@/components/landing/how-it-works").then((mod) => mod.HowItWorks)
)
const Stats = dynamic(() => import("@/components/landing/stats").then((mod) => mod.Stats))
const Testimonials = dynamic(() =>
  import("@/components/landing/testimonials").then((mod) => mod.Testimonials)
)
const CTA = dynamic(() => import("@/components/landing/cta").then((mod) => mod.CTA))

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen">
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
