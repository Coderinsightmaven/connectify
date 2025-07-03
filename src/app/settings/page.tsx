import { MainLayout } from "@/components/layout/main-layout"
import { SettingsContent } from "@/components/settings/settings-content"

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <SettingsContent />
      </div>
    </MainLayout>
  )
} 