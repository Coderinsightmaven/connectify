import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">404</h1>
          <h2 className="text-xl font-semibold">Page not found</h2>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <Link
          href="/"
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "h-10 px-4 py-2"
          )}
        >
          <Icons.home className="mr-2 h-4 w-4" />
          Go back home
        </Link>
      </div>
    </MainLayout>
  )
} 