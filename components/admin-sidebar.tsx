"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "@/contexts/theme-context"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUserMe, logout } from "@/services/AdminService"
import { useRouter } from "next/navigation"
import { useLang } from "@/lang/useLang"
import {
  LayoutDashboard,
  Users,
  User,
  Package,
  Printer,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Shield,
  Activity,
  Globe,
  Tags,
  FileText,
  History,
  Sparkles,
  X,
  Building2,
} from "lucide-react"

// Menu items sẽ được tạo động với bản dịch
const createMenuItems = (t: any) => [
  {
    title: t('sidebar.dashboard'),
    href: "/",
    icon: LayoutDashboard,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: t('sidebar.profile'),
    href: "/profile",
    icon: User,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    title: t('sidebar.userManagement'),
    icon: Users,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    children: [
      { title: t('sidebar.userList'), href: "/admins", icon: Users },
      { title: t('sidebar.rolesPermissions'), href: "/roles", icon: Shield },
      { title: t('sidebar.activityLogs'), href: "/logs", icon: Activity },
    ],
  },
  {
    title: t('sidebar.system'),
    icon: Settings,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    children: [
      { title: t('sidebar.branches'), href: "/branches", icon: Building2 },
      { title: t('sidebar.countries'), href: "/countries", icon: Globe },
      // { title: t('sidebar.settings'), href: "/settings", icon: Settings },
    ],
  },
  {
    title: t('sidebar.products'),
    icon: Package,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    children: [
      { title: t('sidebar.productList'), href: "/products", icon: Package },
      { title: t('sidebar.categories'), href: "/categories", icon: FileText },
      { title: t('sidebar.tags'), href: "/tags", icon: Tags },
    ],
  },
  {
    title: t('sidebar.printing'),
    icon: Printer,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    children: [
      { title: t('sidebar.printTemplates'), href: "/print-templates", icon: FileText },
      { title: t('sidebar.printSelection'), href: "/print-select", icon: Printer },
      { title: t('sidebar.printHistory'), href: "/print-logs", icon: History },
    ],
  },
]

interface AdminSidebarProps {
  onClose?: () => void
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const { t } = useLang()
  const pathname = usePathname()
  const { settings } = useTheme()
  const router = useRouter()
  const queryClient = useQueryClient()

  // Tạo menu items với bản dịch
  const menuItems = createMenuItems(t)

  // Fetch user data
  const { data: userMe } = useQuery({
    queryKey: ["userMe"],
    queryFn: getUserMe,
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
      router.push("/login")
    },
    onError: (error) => {
      console.error("Logout error:", error)
      queryClient.clear()
      router.push("/login")
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  // Get initials from admin_fullname
  const getInitials = (fullname: string) => {
    return fullname
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Tìm section chứa pathname hiện tại để tự động mở
  const findActiveSection = () => {
    for (const item of menuItems) {
      if (item.children) {
        const hasActiveChild = item.children.some(child => child.href === pathname)
        if (hasActiveChild) {
          return item.title
        }
      } else if (item.href === pathname) {
        return null // Không cần mở section cho item không có children
      }
    }
    return null
  }

  const [expandedItem, setExpandedItem] = useState<string | null>(() => findActiveSection())

  const toggleExpanded = (title: string) => {
    setExpandedItem((prev) => (prev === title ? null : title))
  }

  // Cập nhật expandedItem khi pathname thay đổi
  useEffect(() => {
    const activeSection = findActiveSection()
    setExpandedItem(activeSection)
  }, [pathname])

  const handleLinkClick = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 shadow-lg transition-colors duration-300">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 lg:px-6 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 relative overflow-hidden">
        <div className="flex items-center space-x-3 relative z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg lg:text-xl font-bold text-white">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
        </div>

        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="lg:hidden text-white hover:bg-white/20 relative z-10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 lg:px-4 py-4 lg:py-6">
        <nav className="space-y-1 lg:space-y-2">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <div>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200 group rounded-xl text-xs lg:text-sm overflow-hidden",
                      expandedItem === item.title && "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100",
                      settings.compactMode && "h-8 text-xs",
                    )}
                    onClick={() => toggleExpanded(item.title)}
                  >
                    <div
                      className={cn(
                        "mr-2 lg:mr-3 h-5 w-5 lg:h-6 lg:w-6 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0",
                        item.bgColor,
                        settings.compactMode && "h-4 w-4",
                      )}
                    >
                      <item.icon
                        className={cn("h-3 w-3 lg:h-3.5 lg:w-3.5", item.color, settings.compactMode && "h-2.5 w-2.5")}
                      />
                    </div>
                    <span className="truncate flex-1 min-w-0 text-left">{item.title}</span>
                    {expandedItem === item.title ? (
                      <ChevronDown className="ml-2 h-3 w-3 transition-transform duration-200 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="ml-2 h-3 w-3 transition-transform duration-200 flex-shrink-0" />
                    )}
                  </Button>
                  {expandedItem === item.title && (
                    <div
                      className={cn(
                        "ml-2 mt-1 lg:mt-2 space-y-1 animate-in slide-in-from-top-2 duration-300 relative",
                        settings.compactMode && "ml-3 mt-1 space-y-0.5",
                      )}
                    >
                      {item.children.map((child, index) => (
                        <div key={child.href} className="relative">
                          {/* Vertical connector line - only show until current item */}
                          {index < item.children.length - 1 && (
                            <div className="absolute left-2 top-6 bottom-0 w-px bg-gray-300 dark:bg-zinc-700" />
                          )}

                          {/* Vertical line for current item (shorter) */}
                          <div className="absolute left-2 top-0 h-6 w-px bg-gray-300 dark:bg-zinc-700" />

                          {/* Horizontal connector line */}
                          <div className="absolute left-2 top-6 w-4 h-px bg-gray-300 dark:bg-zinc-700 -translate-y-1/2" />

                          <Link href={child.href} onClick={handleLinkClick}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "w-full justify-start text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all duration-200 rounded-lg text-xs ml-6 mr-2",
                                pathname === child.href &&
                                  "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm",
                                settings.compactMode && "h-6 text-xs py-1 ml-4 mr-1",
                              )}
                            >
                              <child.icon
                                className={cn(
                                  "mr-2 h-3 w-3 flex-shrink-0",
                                  settings.compactMode && "h-2.5 w-2.5 mr-1.5",
                                )}
                              />
                              <span className="truncate flex-1 min-w-0 text-left">{child.title}</span>
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link href={item.href} onClick={handleLinkClick}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200 group rounded-xl text-xs lg:text-sm overflow-hidden",
                      pathname === item.href &&
                        "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm",
                      settings.compactMode && "h-8 text-xs",
                    )}
                  >
                    <div
                      className={cn(
                        "mr-2 lg:mr-3 h-5 w-5 lg:h-6 lg:w-6 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0",
                        item.bgColor,
                        settings.compactMode && "h-4 w-4",
                      )}
                    >
                      <item.icon
                        className={cn("h-3 w-3 lg:h-3.5 lg:w-3.5", item.color, settings.compactMode && "h-2.5 w-2.5")}
                      />
                    </div>
                    <span className="truncate flex-1 min-w-0 text-left">{item.title}</span>
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info */}
      <div
        className={cn(
          "border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 p-3 lg:p-4 transition-colors duration-300",
          settings.compactMode && "p-2",
        )}
      >
        <div className="flex items-center space-x-2 lg:space-x-3">
          <Avatar
            className={cn(
              "h-8 w-8 lg:h-10 lg:w-10 ring-2 ring-blue-200 dark:ring-blue-700 shadow-md",
              settings.compactMode && "h-7 w-7",
            )}
          >
            <AvatarImage src={userMe?.admin_avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold text-xs lg:text-sm">
              {userMe?.admin_fullname ? getInitials(userMe.admin_fullname) : t('sidebar.defaultUser')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-xs lg:text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate",
                settings.compactMode && "text-xs",
              )}
            >
              {userMe?.admin_fullname || t('sidebar.defaultUser')}
            </p>
            <p className={cn("text-xs text-gray-500 dark:text-zinc-400 truncate", settings.compactMode && "text-xs")}>
              {userMe?.admin_email || t('sidebar.defaultEmail')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className={cn(
              "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200 rounded-lg p-1 lg:p-2",
              settings.compactMode && "p-1",
            )}
          >
            <LogOut className={cn("h-3 w-3 lg:h-4 lg:w-4", settings.compactMode && "h-3 w-3")} />
          </Button>
        </div>
      </div>
    </div>
  )
}
