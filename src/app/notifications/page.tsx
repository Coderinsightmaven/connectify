import { MainLayout } from "@/components/layout/main-layout"
import { NotificationsContent } from "@/components/notifications/notifications-content"

export default function NotificationsPage() {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay up to date with your activity</p>
        </div>
        <NotificationsContent />
      </div>
    </MainLayout>
  )
} 