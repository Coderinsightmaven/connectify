import { MainLayout } from "@/components/layout/main-layout"
import { ExploreContent } from "@/components/explore/explore-content"

export default function ExplorePage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Explore</h1>
          <p className="text-muted-foreground">Discover trending topics and new people to follow</p>
        </div>
        <ExploreContent />
      </div>
    </MainLayout>
  )
} 