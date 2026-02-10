import { SiteHeader } from "@/components/shared/site-header"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Listings" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#contact", label: "Contact" },
]

export function ListingsHeader() {
  return <SiteHeader navLinks={navLinks} />
}
