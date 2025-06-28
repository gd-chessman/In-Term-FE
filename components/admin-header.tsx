"use client"

import { Bell, Search, Settings, Sun, Moon, Monitor, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/theme-context"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUserMe, logout } from "@/services/AdminService"
import { useRouter } from "next/navigation"

export function AdminHeader() {
  const { data: userMe } = useQuery({
    queryKey: ["userMe"],
    queryFn: getUserMe,
  })
  const { settings, updateTheme } = useTheme()
  const router = useRouter()
  const queryClient = useQueryClient()

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear local storage
      localStorage.removeItem("admin-auth-token")
      localStorage.removeItem("admin-user")
      
      // Clear all queries
      queryClient.clear()
      
      // Redirect to login page
      router.push("/login")
    },
    onError: (error) => {
      console.error("Logout error:", error)
      // Still clear local storage and redirect even if API call fails
      localStorage.removeItem("admin-auth-token")
      localStorage.removeItem("admin-user")
      queryClient.clear()
      router.push("/login")
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const getThemeIcon = () => {
    switch (settings.theme) {
      case "light":
        return <Sun className="h-4 w-4 text-gray-600 dark:text-zinc-400" />
      case "dark":
        return <Moon className="h-4 w-4 text-gray-600 dark:text-zinc-400" />
      default:
        return <Monitor className="h-4 w-4 text-gray-600 dark:text-zinc-400" />
    }
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

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 lg:px-6 shadow-sm transition-colors duration-300">
      {/* Left side - empty for balance */}
      <div className="flex-1" />

      {/* Center - Search */}
      <div className="flex items-center justify-center flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
          <Input
            type="search"
            placeholder="Tìm kiếm..."
            className="w-full pl-10 rounded-full bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-400"
          />
        </div>
      </div>

      {/* Right side - Theme toggle, settings, user menu */}
      <div className="flex items-center space-x-2 lg:space-x-3 flex-1 justify-end">
        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200 rounded-xl h-10 w-10"
            >
              {getThemeIcon()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 shadow-xl rounded-xl"
          >
            <DropdownMenuLabel className="text-gray-700 dark:text-zinc-300">Chọn theme</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-zinc-800" />
            <DropdownMenuItem
              onClick={() => updateTheme("light")}
              className="hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg m-1 text-gray-700 dark:text-zinc-300"
            >
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateTheme("dark")}
              className="hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg m-1 text-gray-700 dark:text-zinc-300"
            >
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateTheme("auto")}
              className="hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg m-1 text-gray-700 dark:text-zinc-300"
            >
              <Monitor className="mr-2 h-4 w-4" />
              <span>Auto</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200 rounded-xl h-10 w-10"
            >
              <Bell className="h-4 w-4 text-gray-600 dark:text-zinc-400" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white border-2 border-white dark:border-zinc-900 shadow-lg animate-pulse">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 shadow-xl rounded-xl"
          >
            <DropdownMenuLabel className="text-gray-700 dark:text-zinc-300 font-semibold">Thông báo</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-zinc-800" />
            <DropdownMenuItem className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg m-1">
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shadow-sm"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">Admin mới đăng nhập</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">john.doe@example.com - 2 phút trước</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg m-1">
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2 shadow-sm"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">Sản phẩm mới được thêm</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Product #1234 - 5 phút trước</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg m-1">
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-orange-500 mt-2 shadow-sm"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">Template in được cập nhật</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Template Vietnam - 10 phút trước</p>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200 rounded-xl h-10 w-10"
        >
          <Settings className="h-4 w-4 text-gray-600 dark:text-zinc-400" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200"
            >
              <Avatar className="h-9 w-9 ring-2 ring-gray-200 dark:ring-zinc-700 shadow-md">
                <AvatarImage src="" alt="" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold">
                  {userMe?.admin_fullname ? getInitials(userMe.admin_fullname) : ""}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 shadow-xl rounded-xl"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none text-gray-900 dark:text-zinc-100">
                  {userMe?.admin_fullname || "Admin User"}
                </p>
                <p className="text-xs leading-none text-gray-500 dark:text-zinc-400">
                  {userMe?.admin_email || "admin@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-zinc-800" />
            <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg m-1 text-gray-700 dark:text-zinc-300">
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg m-1 text-gray-700 dark:text-zinc-300">
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-zinc-800" />
            <DropdownMenuItem 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg m-1"
            >
              <span>
                {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
