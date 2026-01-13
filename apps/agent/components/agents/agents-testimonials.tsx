"use client"

import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion-wrapper"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Senior Property Agent",
    location: "New York, NY",
    image: "/professional-woman-headshot-real-estate-agent.jpg",
    quote:
      "HAMGAB transformed my business. The quality of leads and the commission structure are unmatched. I've doubled my income in just 8 months.",
    rating: 5,
    earnings: "XAF 62K/month",
  },
  {
    name: "Michael Chen",
    role: "Luxury Property Specialist",
    location: "Los Angeles, CA",
    image: "/professional-asian-man-headshot-business.jpg",
    quote:
      "The verified listings feature alone saves me hours every week. No more wasted time on fake properties. The platform is a game-changer.",
    rating: 5,
    earnings: "XAF 78K/month",
  },
  {
    name: "Emily Rodriguez",
    role: "Residential Agent",
    location: "Miami, FL",
    image: "/professional-latina-woman-headshot-friendly.jpg",
    quote:
      "As a new agent, HAMGAB gave me the tools and support I needed to compete with established agents. The training resources are invaluable.",
    rating: 5,
    earnings: "XAF 35K/month",
  },
]

export function AgentsTestimonials() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Success Stories</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Hear from our top agents
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from agents who have grown their careers with HAMGAB.
          </p>
        </FadeIn>

        <StaggerChildren className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <div className="group relative p-8 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-all duration-300 h-full flex flex-col">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-muted-foreground/20" />

                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6 flex-1">"{testimonial.quote}"</p>

                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{testimonial.earnings}</p>
                    <p className="text-xs text-muted-foreground">avg. earnings</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
