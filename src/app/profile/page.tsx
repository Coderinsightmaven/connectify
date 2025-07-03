import { MainLayout } from "@/components/layout/main-layout"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"

export default function ProfilePage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <ProfileHeader />
        <ProfileTabs />
      </div>
    </MainLayout>
  )
} 