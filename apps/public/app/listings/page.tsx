import { ListingsHeader } from "@/components/listings/listings-header"
import { ListingsPageClient } from "@/components/listings/listings-page-client"
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
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8">
          <ListingsPageClient />
        </div>
      </main>
      <Footer />
    </div>
  )
}
