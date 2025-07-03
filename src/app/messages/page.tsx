import { MainLayout } from "@/components/layout/main-layout"
import { MessagesContent } from "@/components/messages/messages-content"

export default function MessagesPage() {
  return (
    <MainLayout>
      <div className="h-[calc(100vh-4rem)] max-w-6xl mx-auto">
        <MessagesContent />
      </div>
    </MainLayout>
  )
} 