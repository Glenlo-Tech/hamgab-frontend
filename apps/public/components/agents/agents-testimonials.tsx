"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/motion-wrapper"

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Senior Property Agent",
    location: "Biyem-Assi, Yaoundé",
    image: "/professional-woman-headshot-real-estate-agent.jpg",
    quote:
      "HAMGAB transformed my business. The quality of leads and the commission structure are unmatched. I've doubled my income in just 8 months.",
    rating: 5,
    earnings: "62K XAF/month",
  },
  {
    name: "Michael Chen",
    role: "Luxury Property Specialist",
    location: "Bonaberi, Douala",
    image: "/professional-asian-man-headshot-business.jpg",
    quote:
      "The verified listings feature alone saves me hours every week. No more wasted time on fake properties. The platform is a game-changer.",
    rating: 5,
    earnings: "78K XAF/month",
  },
  {
    name: "Emily Rodriguez",
    role: "Residential Agent",
    location: "Brick, Yaoundé",
    image: "/professional-latina-woman-headshot-friendly.jpg",
    quote:
      "As a new agent, HAMGAB gave me the tools and support I needed to compete with established agents. The training resources are invaluable.",
    rating: 5,
    earnings: "35K XAF/month",
  },
  {
    name: "Aminata Diallo",
    role: "Property Consultant",
    location: "Douala, Cameroon",
    image: "/professional-headshot-person.png",
    quote:
      "HAMGAB m'a permis de développer mon portefeuille de clients de manière significative. La plateforme est intuitive et les propriétaires sont vérifiés.",
    rating: 5,
    earnings: "45K XAF/month",
  },
  {
    name: "Jean-Baptiste Nkeng",
    role: "Real Estate Specialist",
    location: "Yaoundé, Cameroon",
    image: "/professional-asian-man-headshot-portrait.jpg",
    quote:
      "Working with HAMGAB has been a game-changer. The commission structure is fair, and I've seen a 40% increase in my monthly earnings since joining.",
    rating: 5,
    earnings: "58K XAF/month",
  },
  {
    name: "Fatou Mbarga",
    role: "Luxury Property Agent",
    location: "Buea, Cameroon",
    image: "/professional-woman-headshot.png",
    quote:
      "The platform's verification system gives me confidence in every listing. My clients trust me more because they know I'm working with verified properties.",
    rating: 5,
    earnings: "52K XAF/month",
  },
  {
    name: "Samuel Tchouassi",
    role: "Commercial Property Agent",
    location: "Limbe, Cameroon",
    image: "/professional-latina-woman-headshot-portrait.jpg",
    quote:
      "HAMGAB's tools have streamlined my entire workflow. I can now manage more properties efficiently and provide better service to my clients.",
    rating: 5,
    earnings: "68K XAF/month",
  },
  {
    name: "Marie-Claire Fon",
    role: "Residential Property Specialist",
    location: "Bamenda, Cameroon",
    image: "/professional-headshot-person.png",
    quote:
      "As a new agent, the training and support from HAMGAB helped me build my reputation quickly. The platform is user-friendly and professional.",
    rating: 5,
    earnings: "38K XAF/month",
  },
]

const firstRow = testimonials.slice(0, testimonials.length / 2)
const secondRow = testimonials.slice(testimonials.length / 2)

const TestimonialCard = ({
  name,
  role,
  location,
  image,
  quote,
  rating,
  earnings,
}: {
  name: string
  role: string
  location: string
  image: string
  quote: string
  rating: number
  earnings: string
}) => {
  return (
    <Card className="relative p-5 h-full w-[280px] sm:w-[340px] shrink-0 mx-2 sm:mx-3 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
      <Quote className="absolute top-5 right-5 h-6 w-6 text-muted-foreground/20" />
      
      <div className="flex gap-1 mb-3">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      <p className="text-muted-foreground mb-5 leading-relaxed line-clamp-4 text-sm">"{quote}"</p>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">{name}</div>
            <div className="text-xs text-muted-foreground truncate">{role}</div>
            <div className="text-xs text-muted-foreground truncate">{location}</div>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <p className="font-bold text-base">{earnings}</p>
          <p className="text-xs text-muted-foreground">avg. earnings</p>
        </div>
      </div>
    </Card>
  )
}

export function AgentsTestimonials() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/20 to-muted opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4">Success Stories</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Hear from our top agents
          </h2>
          <p className="text-lg text-muted-foreground">
            Real stories from agents who have grown their careers with HAMGAB.
          </p>
        </motion.div>
      </div>

      <div className="relative flex flex-col gap-8 w-full overflow-hidden">
        {/* Row 1 - Left to Right */}
        <div className="flex group overflow-hidden">
          <div
            className="flex w-max animate-marquee items-stretch"
            style={{ "--duration": "120s" } as React.CSSProperties}
          >
            {[...firstRow, ...firstRow, ...firstRow].map((item, idx) => (
              <div key={`row1-${idx}`} className="h-full">
                <TestimonialCard {...item} />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="flex group overflow-hidden">
          <div
            className="flex w-max animate-marquee-reverse items-stretch"
            style={{ "--duration": "120s" } as React.CSSProperties}
          >
            {[...secondRow, ...secondRow, ...secondRow].map((item, idx) => (
              <div key={`row2-${idx}`} className="h-full">
                <TestimonialCard {...item} />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Fade Edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-1/4 bg-gradient-to-r from-background via-background/20 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-1/4 bg-gradient-to-l from-background via-background/20 to-transparent z-10" />
      </div>
    </section>
  )
}
