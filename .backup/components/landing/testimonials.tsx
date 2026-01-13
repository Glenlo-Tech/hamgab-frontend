"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Property Owner",
    image: "/professional-woman-headshot.png",
    content:
      "HAMGAB made selling my property incredibly smooth. The verification process gave buyers confidence, and I received multiple offers within weeks.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "First-time Buyer",
    image: "/professional-asian-man-headshot-portrait.jpg",
    content:
      "As a first-time buyer, I was nervous about the process. My agent through HAMGAB was patient, knowledgeable, and helped me find my dream home.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Tenant",
    image: "/professional-latina-woman-headshot-portrait.jpg",
    content:
      "The search filters are fantastic. I found a verified apartment that matched all my criteria. The whole rental process was transparent and secure.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <p className="text-sm font-medium text-muted-foreground mb-2">Testimonials</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">Trusted by thousands</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from our satisfied clients who found their perfect properties through HAMGAB.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <Quote className="h-10 w-10 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">{testimonial.content}</p>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
