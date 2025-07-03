import { MainLayout } from "@/components/layout/main-layout"
import { BookmarksContent } from "@/components/bookmarks/bookmarks-content"

export default function BookmarksPage() {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Bookmarks</h1>
          <p className="text-muted-foreground">Posts you've saved for later</p>
        </div>
        <BookmarksContent />
      </div>
    </MainLayout>
  )
} 