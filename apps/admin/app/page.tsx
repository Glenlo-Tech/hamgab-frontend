import type { Metadata } from "next"
import AdminLoginPage from "./login/page"

export const metadata: Metadata = {
  title: "Admin Login | HAMGAB",
  description: "Secure login for HAMGAB administrators.",
}

export default function AdminPage() {
  return (
    <AdminLoginPage />
  )
}
