"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "auto"
type PrimaryColor = "blue" | "green" | "purple" | "red" | "orange"
type SidebarStyle = "fixed" | "collapsible" | "overlay"

interface ThemeSettings {
  theme: Theme
  primaryColor: PrimaryColor
  sidebarStyle: SidebarStyle
  showBreadcrumb: boolean
  compactMode: boolean
}

interface ThemeContextType {
  settings: ThemeSettings
  updateTheme: (theme: Theme) => void
  updatePrimaryColor: (color: PrimaryColor) => void
  updateSidebarStyle: (style: SidebarStyle) => void
  updateBreadcrumb: (show: boolean) => void
  updateCompactMode: (compact: boolean) => void
  resetToDefault: () => void
}

const defaultSettings: ThemeSettings = {
  theme: "light",
  primaryColor: "blue",
  sidebarStyle: "fixed",
  showBreadcrumb: true,
  compactMode: false,
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("admin-theme-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error("Failed to parse theme settings:", error)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("admin-theme-settings", JSON.stringify(settings))
    applyThemeSettings(settings)
  }, [settings])

  const applyThemeSettings = (settings: ThemeSettings) => {
    const root = document.documentElement

    // Apply theme
    if (settings.theme === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.toggle("dark", prefersDark)
    } else {
      root.classList.toggle("dark", settings.theme === "dark")
    }

    // Apply primary color
    root.setAttribute("data-primary-color", settings.primaryColor)

    // Apply compact mode
    root.classList.toggle("compact-mode", settings.compactMode)

    // Apply sidebar style
    root.setAttribute("data-sidebar-style", settings.sidebarStyle)

    // Apply breadcrumb setting
    root.setAttribute("data-show-breadcrumb", settings.showBreadcrumb.toString())

    // Force a repaint to ensure colors are applied
    root.style.display = "none"
    root.offsetHeight // Trigger reflow
    root.style.display = ""
  }

  const updateTheme = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }))
  }

  const updatePrimaryColor = (primaryColor: PrimaryColor) => {
    setSettings((prev) => ({ ...prev, primaryColor }))
  }

  const updateSidebarStyle = (sidebarStyle: SidebarStyle) => {
    setSettings((prev) => ({ ...prev, sidebarStyle }))
  }

  const updateBreadcrumb = (showBreadcrumb: boolean) => {
    setSettings((prev) => ({ ...prev, showBreadcrumb }))
  }

  const updateCompactMode = (compactMode: boolean) => {
    setSettings((prev) => ({ ...prev, compactMode }))
  }

  const resetToDefault = () => {
    setSettings(defaultSettings)
  }

  return (
    <ThemeContext.Provider
      value={{
        settings,
        updateTheme,
        updatePrimaryColor,
        updateSidebarStyle,
        updateBreadcrumb,
        updateCompactMode,
        resetToDefault,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
