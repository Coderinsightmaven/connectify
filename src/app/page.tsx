import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { HomePageClient } from "@/components/pages/home-page-client"

export default async function HomePage() {
  // Validate the session on the server side
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // If no valid session, redirect to login
  if (!session) {
    redirect("/login")
  }

  // Pass the session to the client component
  return <HomePageClient session={session} />
}
