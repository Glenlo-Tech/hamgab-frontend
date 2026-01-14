"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Property Owner",
    location: "Bastos, Yaoundé",
    image: "/professional-woman-headshot.png",
    content:
      "HAMGAB made selling my property incredibly smooth. The verification process gave buyers confidence, and I received multiple offers within weeks.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "First-time Buyer",
    location: "Akwa, Douala",
    image: "/professional-asian-man-headshot-portrait.jpg",
    content:
      "As a first-time buyer, I was nervous about the process. My agent through HAMGAB was patient, knowledgeable, and helped me find my dream home.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Tenant",
    location: "Mvog-Ada, Yaoundé",
    image: "/professional-latina-woman-headshot-portrait.jpg",
    content:
      "The search filters are fantastic. I found a verified apartment that matched all my criteria. The whole rental process was transparent and secure.",
    rating: 5,
  },
  {
    id: 4,
    name: "Aminata Diallo",
    role: "Property Owner",
    location: "Bonapriso, Douala",
    image: "/professional-headshot-person.png",
    content:
      "J'ai vendu ma propriété en moins d'un mois grâce à HAMGAB. La plateforme est professionnelle et les agents sont très compétents.",
    rating: 5,
  },
  {
    id: 5,
    name: "Jean-Baptiste Nkeng",
    role: "Property Investor",
    location: "Etoa-Meki, Yaoundé",
    image: "/professional-asian-man-headshot-business.jpg",
    content:
      "HAMGAB has been instrumental in building my property portfolio. The verified listings save me time and give me confidence in every purchase.",
    rating: 5,
  },
  {
    id: 6,
    name: "Fatou Mbarga",
    role: "Tenant",
    location: "Buea, Cameroon",
    image: "/professional-woman-headshot.png",
    content:
      "I found my perfect apartment through HAMGAB. The verification system ensures all properties are legitimate, which gave me peace of mind.",
    rating: 5,
  },
  {
    id: 7,
    name: "Samuel Tchouassi",
    role: "First-time Buyer",
    location: "Limbe, Cameroon",
    image: "/professional-latina-woman-headshot-friendly.jpg",
    content:
      "The process was smooth from start to finish. My agent guided me through every step, and I'm now a proud homeowner thanks to HAMGAB.",
    rating: 5,
  },
  {
    id: 8,
    name: "Marie-Claire Fon",
    role: "Property Owner",
    location: "Bamenda, Cameroon",
    image: "/professional-headshot-person.png",
    content:
      "Selling my property through HAMGAB was the best decision. The platform connected me with serious buyers, and the transaction was completed quickly.",
    rating: 5,
  },
]

const firstRow = testimonials.slice(0, testimonials.length / 2)
const secondRow = testimonials.slice(testimonials.length / 2)

const TestimonialCard = ({
  name,
  role,
  location,
  image,
  content,
  rating,
}: {
  name: string
  role: string
  location: string
  image: string
  content: string
  rating: number
}) => {
  return (
    <Card className="relative p-5 h-full w-[280px] sm:w-[340px] shrink-0 mx-2 sm:mx-3 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
      <Quote className="absolute top-5 right-5 h-6 w-6 text-muted-foreground/20" />
      
      <div className="flex gap-1 mb-3">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      <p className="text-muted-foreground mb-5 leading-relaxed line-clamp-4 text-sm">"{content}"</p>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
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
    </Card>
  )
}

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-muted/30 overflow-hidden relative">
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
          <Badge className="mb-4">Testimonials</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Trusted by thousands
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear from our satisfied clients who found their perfect properties through HAMGAB.
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
              <div key={`row1-${item.id}-${idx}`} className="h-full">
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
              <div key={`row2-${item.id}-${idx}`} className="h-full">
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
