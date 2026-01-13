import { ListingsHeader } from "@/components/listings/listings-header"
import { ListingsFilters } from "@/components/listings/listings-filters"
import { ListingsGrid } from "@/components/listings/listings-grid"
import { Footer } from "@/components/landing/footer"

export const metadata = {
  title: "Property Listings | HAMGAB",
  description:
    "Browse thousands of verified property listings. Find your perfect home, apartment, or commercial space.",
}

export default function ListingsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ListingsHeader />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ListingsFilters />
          <ListingsGrid />
        </div>
      </main>
      <Footer />
    </div>
  )
}
