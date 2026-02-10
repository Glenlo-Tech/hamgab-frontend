import { SiteHeader } from "@/components/shared/site-header"

const navLinks = [
  { href: "#properties", label: "Properties" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
]

export function Header() {
  return <SiteHeader navLinks={navLinks} />
}
