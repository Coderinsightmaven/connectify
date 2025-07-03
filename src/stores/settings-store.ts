import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = "light" | "light-blue" | "dark" | "system"

export interface NotificationSettings {
  pushEnabled: boolean
  emailEnabled: boolean
  likesEnabled: boolean
  commentsEnabled: boolean
  followsEnabled: boolean
  messagesEnabled: boolean
  marketingEnabled: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private'
  messagePermissions: 'everyone' | 'friends' | 'nobody'
  showOnlineStatus: boolean
  showLastSeen: boolean
  dataCollection: boolean
  analytics: boolean
  advertisements: boolean
}

export interface AppearanceSettings {
  theme: Theme
  fontSize: 'small' | 'medium' | 'large'
  reducedMotion: boolean
  highContrast: boolean
  compactMode: boolean
}

export interface AccessibilitySettings {
  screenReader: boolean
  keyboardNavigation: boolean
  altTextEnabled: boolean
  autoplayVideos: boolean
  flashingAnimations: boolean
}

interface SettingsState {
  // Theme and appearance
  appearance: AppearanceSettings
  
  // Notifications
  notifications: NotificationSettings
  
  // Privacy
  privacy: PrivacySettings
  
  // Accessibility
  accessibility: AccessibilitySettings
  
  // App settings
  autoSave: boolean
  language: string
  timezone: string
  
  // UI state
  sidebarCollapsed: boolean
  
  // Actions
  setTheme: (theme: Theme) => void
  updateAppearance: (settings: Partial<AppearanceSettings>) => void
  updateNotifications: (settings: Partial<NotificationSettings>) => void
  updatePrivacy: (settings: Partial<PrivacySettings>) => void
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  resetToDefaults: () => void
  exportSettings: () => string
  importSettings: (settingsJson: string) => boolean
}

const defaultSettings = {
  appearance: {
    theme: "system" as Theme,
    fontSize: "medium" as const,
    reducedMotion: false,
    highContrast: false,
    compactMode: false
  },
  notifications: {
    pushEnabled: true,
    emailEnabled: true,
    likesEnabled: true,
    commentsEnabled: true,
    followsEnabled: true,
    messagesEnabled: true,
    marketingEnabled: false
  },
  privacy: {
    profileVisibility: "public" as const,
    messagePermissions: "everyone" as const,
    showOnlineStatus: true,
    showLastSeen: true,
    dataCollection: true,
    analytics: false,
    advertisements: true
  },
  accessibility: {
    screenReader: false,
    keyboardNavigation: true,
    altTextEnabled: true,
    autoplayVideos: true,
    flashingAnimations: true
  },
  autoSave: true,
  language: "en",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  sidebarCollapsed: false
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      ...defaultSettings,
      
      // Actions
      setTheme: (theme: Theme) => {
        set({
          appearance: {
            ...get().appearance,
            theme
          }
        })
        
        // Apply theme to document
        if (theme === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
          document.documentElement.className = systemTheme
        } else {
          document.documentElement.className = theme
        }
      },
      
      updateAppearance: (settings: Partial<AppearanceSettings>) => {
        const { appearance } = get()
        const newAppearance = { ...appearance, ...settings }
        
        set({ appearance: newAppearance })
        
        // Apply theme changes if theme was updated
        if (settings.theme) {
          get().setTheme(settings.theme)
        }
        
        // Apply font size changes
        if (settings.fontSize) {
          document.documentElement.style.setProperty(
            '--font-size-scale',
            settings.fontSize === 'small' ? '0.9' : 
            settings.fontSize === 'large' ? '1.1' : '1'
          )
        }
        
        // Apply reduced motion
        if (settings.reducedMotion !== undefined) {
          document.documentElement.style.setProperty(
            '--animation-duration',
            settings.reducedMotion ? '0s' : '0.3s'
          )
        }
        
        // Apply high contrast
        if (settings.highContrast !== undefined) {
          document.documentElement.classList.toggle('high-contrast', settings.highContrast)
        }
        
        // Apply compact mode
        if (settings.compactMode !== undefined) {
          document.documentElement.classList.toggle('compact-mode', settings.compactMode)
        }
      },
      
      updateNotifications: (settings: Partial<NotificationSettings>) => {
        const { notifications } = get()
        set({
          notifications: { ...notifications, ...settings }
        })
      },
      
      updatePrivacy: (settings: Partial<PrivacySettings>) => {
        const { privacy } = get()
        set({
          privacy: { ...privacy, ...settings }
        })
      },
      
      updateAccessibility: (settings: Partial<AccessibilitySettings>) => {
        const { accessibility } = get()
        const newAccessibility = { ...accessibility, ...settings }
        
        set({ accessibility: newAccessibility })
        
        // Apply accessibility settings to DOM
        if (settings.autoplayVideos !== undefined) {
          document.documentElement.classList.toggle('no-autoplay', !settings.autoplayVideos)
        }
        
        if (settings.flashingAnimations !== undefined) {
          document.documentElement.classList.toggle('no-flash', !settings.flashingAnimations)
        }
      },
      
      toggleSidebar: () => {
        set({ sidebarCollapsed: !get().sidebarCollapsed })
      },
      
      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed })
      },
      
      resetToDefaults: () => {
        set(defaultSettings)
        
        // Reset DOM changes
        document.documentElement.className = defaultSettings.appearance.theme
        document.documentElement.style.removeProperty('--font-size-scale')
        document.documentElement.style.removeProperty('--animation-duration')
        document.documentElement.classList.remove('high-contrast', 'compact-mode', 'no-autoplay', 'no-flash')
      },
      
      exportSettings: (): string => {
        const state = get()
        const exportData = {
          appearance: state.appearance,
          notifications: state.notifications,
          privacy: state.privacy,
          accessibility: state.accessibility,
          autoSave: state.autoSave,
          language: state.language,
          timezone: state.timezone
        }
        return JSON.stringify(exportData, null, 2)
      },
      
      importSettings: (settingsJson: string): boolean => {
        try {
          const importedSettings = JSON.parse(settingsJson)
          
          // Validate and merge settings
          const validatedSettings = {
            appearance: { ...defaultSettings.appearance, ...importedSettings.appearance },
            notifications: { ...defaultSettings.notifications, ...importedSettings.notifications },
            privacy: { ...defaultSettings.privacy, ...importedSettings.privacy },
            accessibility: { ...defaultSettings.accessibility, ...importedSettings.accessibility },
            autoSave: importedSettings.autoSave ?? defaultSettings.autoSave,
            language: importedSettings.language ?? defaultSettings.language,
            timezone: importedSettings.timezone ?? defaultSettings.timezone
          }
          
          set(validatedSettings)
          
          // Apply imported theme
          get().setTheme(validatedSettings.appearance.theme)
          get().updateAppearance(validatedSettings.appearance)
          get().updateAccessibility(validatedSettings.accessibility)
          
          return true
        } catch (error) {
          console.error('Failed to import settings:', error)
          return false
        }
      }
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        appearance: state.appearance,
        notifications: state.notifications,
        privacy: state.privacy,
        accessibility: state.accessibility,
        autoSave: state.autoSave,
        language: state.language,
        timezone: state.timezone,
        sidebarCollapsed: state.sidebarCollapsed
      })
    }
  )
)

// Auto-apply theme on store initialization
if (typeof window !== 'undefined') {
  const settings = useSettingsStore.getState()
  
  // Apply initial theme
  if (settings.appearance.theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    document.documentElement.className = systemTheme
  } else {
    document.documentElement.className = settings.appearance.theme
  }
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  mediaQuery.addEventListener('change', (e) => {
    const currentSettings = useSettingsStore.getState()
    if (currentSettings.appearance.theme === "system") {
      document.documentElement.className = e.matches ? "dark" : "light"
    }
  })
} 