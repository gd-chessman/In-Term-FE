"use client"

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { useState } from "react"
import "./globals.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider>
          <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <div
              className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Mobile menu button */}
              <div className="lg:hidden">
                <div className="flex items-center justify-between bg-white dark:bg-zinc-900 px-4 py-2 shadow-sm border-b border-gray-200 dark:border-zinc-800">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="text-gray-600 dark:text-zinc-300"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Admin Panel</h1>
                  <div className="w-10" /> {/* Spacer */}
                </div>
              </div>

              {/* Header */}
              <AdminHeader />

              {/* Page content */}
              <main className="flex-1 overflow-auto bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
                <div className="p-4 lg:p-6">{children}</div>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
