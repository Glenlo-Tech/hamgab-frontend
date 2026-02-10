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
      <main id="main-content" className="flex-1 pt-20">
        <div className="mx-auto w-full max-w-[1920px] px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10 lg:py-10 xl:px-12">
          <ListingsPageClient />
        </div>
      </main>
      <Footer />
    </div>
  )
}
