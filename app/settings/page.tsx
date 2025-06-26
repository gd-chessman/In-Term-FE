"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "@/contexts/theme-context"
import {
  Globe,
  Shield,
  Mail,
  Database,
  Palette,
  Bell,
  Save,
  RefreshCw,
  Server,
  Lock,
  Eye,
  CheckCircle,
  AlertTriangle,
  SettingsIcon,
  Zap,
  Monitor,
  Smartphone,
  Sun,
  Moon,
  Wifi,
  Check,
} from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [saveProgress, setSaveProgress] = useState(0)
  const {
    settings,
    updateTheme,
    updatePrimaryColor,
    updateSidebarStyle,
    updateBreadcrumb,
    updateCompactMode,
    resetToDefault,
  } = useTheme()

  const handleSave = async () => {
    setIsLoading(true)
    setSaveProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setSaveProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsLoading(false)
          return 100
        }
        return prev + 10
      })
    }, 100)
  }

  const primaryColors = [
    { name: "blue", color: "from-blue-500 to-cyan-500", border: "border-blue-600" },
    { name: "green", color: "from-green-500 to-emerald-500", border: "border-green-600" },
    { name: "purple", color: "from-purple-500 to-violet-500", border: "border-purple-600" },
    { name: "red", color: "from-red-500 to-pink-500", border: "border-red-600" },
    { name: "orange", color: "from-orange-500 to-yellow-500", border: "border-orange-600" },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
            Cài đặt hệ thống
          </h1>
          <p className="text-slate-600 mt-2">Quản lý cấu hình và thiết lập hệ thống</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={resetToDefault}
            className="border-slate-200 hover:bg-slate-50 rounded-xl transition-all duration-300 w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Khôi phục mặc định
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl w-full sm:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Đang lưu..." : "Lưu cài đặt"}
          </Button>
        </div>
      </div>

      {/* Progress Bar when saving */}
      {isLoading && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200/50 rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <Save className="h-4 w-4 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Đang lưu cài đặt...</p>
                <Progress value={saveProgress} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-slate-100/80 rounded-xl p-1">
          <TabsTrigger
            value="general"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
          >
            <Globe className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Chung</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
          >
            <Shield className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Bảo mật</span>
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
          >
            <Mail className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger
            value="database"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
          >
            <Database className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Database</span>
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
          >
            <Palette className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Giao diện</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
          >
            <Bell className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Thông báo</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">Cài đặt chung</CardTitle>
                  <CardDescription>Cấu hình cơ bản của hệ thống</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="site_name" className="text-slate-700 font-medium">
                    Tên hệ thống
                  </Label>
                  <Input
                    id="site_name"
                    defaultValue="Admin Panel System"
                    className="rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_url" className="text-slate-700 font-medium">
                    URL hệ thống
                  </Label>
                  <Input
                    id="site_url"
                    defaultValue="https://admin.example.com"
                    className="rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_description" className="text-slate-700 font-medium">
                  Mô tả hệ thống
                </Label>
                <Textarea
                  id="site_description"
                  defaultValue="Hệ thống quản trị nội bộ cho việc quản lý sản phẩm và admin"
                  className="rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-slate-700 font-medium">
                    Múi giờ
                  </Label>
                  <Select defaultValue="asia/ho_chi_minh">
                    <SelectTrigger className="rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      <SelectItem value="asia/ho_chi_minh">🇻🇳 Asia/Ho_Chi_Minh (UTC+7)</SelectItem>
                      <SelectItem value="utc">🌍 UTC (UTC+0)</SelectItem>
                      <SelectItem value="america/new_york">🇺🇸 America/New_York (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-slate-700 font-medium">
                    Ngôn ngữ mặc định
                  </Label>
                  <Select defaultValue="vi">
                    <SelectTrigger className="rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <Label className="text-slate-900 font-medium">Chế độ bảo trì</Label>
                      <p className="text-sm text-slate-600">Kích hoạt chế độ bảo trì cho hệ thống</p>
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">Cài đặt bảo mật</CardTitle>
                  <CardDescription>Cấu hình bảo mật và xác thực</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="session_timeout" className="text-slate-700 font-medium">
                    Thời gian hết phiên (phút)
                  </Label>
                  <Input
                    id="session_timeout"
                    type="number"
                    defaultValue="30"
                    className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-2 focus:ring-red-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_login_attempts" className="text-slate-700 font-medium">
                    Số lần đăng nhập tối đa
                  </Label>
                  <Input
                    id="max_login_attempts"
                    type="number"
                    defaultValue="5"
                    className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Label className="text-slate-900 font-medium">Bắt buộc xác thực 2 yếu tố</Label>
                        <p className="text-sm text-slate-600">Yêu cầu tất cả admin sử dụng 2FA</p>
                      </div>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Eye className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Label className="text-slate-900 font-medium">Ghi log đăng nhập</Label>
                        <p className="text-sm text-slate-600">Lưu lại tất cả hoạt động đăng nhập</p>
                      </div>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-cyan-500"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Label className="text-slate-900 font-medium">Khóa IP sau khi đăng nhập sai</Label>
                        <p className="text-sm text-slate-600">Tự động khóa IP sau số lần đăng nhập sai</p>
                      </div>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-violet-500"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Danh sách IP được phép</Label>
                <Textarea
                  placeholder="192.168.1.0/24&#10;10.0.0.0/8&#10;172.16.0.0/12"
                  className="h-24 rounded-xl border-slate-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 font-mono text-sm"
                />
                <p className="text-sm text-slate-500">Mỗi IP/subnet một dòng. Để trống để cho phép tất cả IP.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">Cài đặt Email</CardTitle>
                  <CardDescription>Cấu hình SMTP và email thông báo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtp_host" className="text-slate-700 font-medium">
                    SMTP Host
                  </Label>
                  <Input
                    id="smtp_host"
                    defaultValue="smtp.gmail.com"
                    className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp_port" className="text-slate-700 font-medium">
                    SMTP Port
                  </Label>
                  <Input
                    id="smtp_port"
                    type="number"
                    defaultValue="587"
                    className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtp_username" className="text-slate-700 font-medium">
                    Username
                  </Label>
                  <Input
                    id="smtp_username"
                    defaultValue="admin@example.com"
                    className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp_password" className="text-slate-700 font-medium">
                    Password
                  </Label>
                  <Input
                    id="smtp_password"
                    type="password"
                    defaultValue="••••••••"
                    className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="from_email" className="text-slate-700 font-medium">
                  Email gửi đi
                </Label>
                <Input
                  id="from_email"
                  defaultValue="noreply@example.com"
                  className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <Label className="text-slate-900 font-medium">Sử dụng SSL/TLS</Label>
                      <p className="text-sm text-slate-600">Kích hoạt mã hóa SSL/TLS cho SMTP</p>
                    </div>
                  </div>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Mail className="mr-2 h-4 w-4" />
                  Gửi email test
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center shadow-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">Cài đặt Database</CardTitle>
                  <CardDescription>Thông tin và cấu hình database</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Loại Database</Label>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0 shadow-lg">
                      MySQL 8.0
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Trạng thái kết nối</Label>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Đã kết nối
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="db_host" className="text-slate-700 font-medium">
                    Database Host
                  </Label>
                  <Input
                    id="db_host"
                    defaultValue="localhost"
                    className="rounded-xl border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db_port" className="text-slate-700 font-medium">
                    Port
                  </Label>
                  <Input
                    id="db_port"
                    type="number"
                    defaultValue="3306"
                    className="rounded-xl border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="db_name" className="text-slate-700 font-medium">
                    Database Name
                  </Label>
                  <Input
                    id="db_name"
                    defaultValue="admin_system"
                    className="rounded-xl border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db_username" className="text-slate-700 font-medium">
                    Username
                  </Label>
                  <Input
                    id="db_username"
                    defaultValue="admin_user"
                    className="rounded-xl border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Server className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Label className="text-slate-900 font-medium">Tự động backup</Label>
                        <p className="text-sm text-slate-600">Backup database tự động hàng ngày</p>
                      </div>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-cyan-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup_time" className="text-slate-700 font-medium">
                    Thời gian backup
                  </Label>
                  <Input
                    id="backup_time"
                    type="time"
                    defaultValue="02:00"
                    className="rounded-xl border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>

              <div className="pt-4 space-x-3">
                <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Wifi className="mr-2 h-4 w-4" />
                  Test kết nối
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-200 hover:bg-purple-50 rounded-xl transition-all duration-300"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Backup ngay
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">Cài đặt giao diện</CardTitle>
                  <CardDescription>Tùy chỉnh giao diện admin panel</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-slate-700 font-medium">
                  Theme
                </Label>
                <Select value={settings.theme} onValueChange={updateTheme}>
                  <SelectTrigger className="rounded-xl border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    <SelectItem value="light">
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4" />
                        <span>Light</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center space-x-2">
                        <Moon className="h-4 w-4" />
                        <span>Dark</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="auto">
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-4 w-4" />
                        <span>Auto (theo hệ thống)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary_color" className="text-slate-700 font-medium">
                  Màu chủ đạo
                </Label>
                <div className="flex space-x-3">
                  {primaryColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => updatePrimaryColor(color.name as any)}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color.color} border-2 ${
                        settings.primaryColor === color.name ? color.border : "border-transparent"
                      } shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 relative`}
                    >
                      {settings.primaryColor === color.name && (
                        <Check className="absolute inset-0 m-auto h-5 w-5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sidebar_style" className="text-slate-700 font-medium">
                  Kiểu sidebar
                </Label>
                <Select value={settings.sidebarStyle} onValueChange={updateSidebarStyle}>
                  <SelectTrigger className="rounded-xl border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    <SelectItem value="fixed">Cố định</SelectItem>
                    <SelectItem value="collapsible">Thu gọn được</SelectItem>
                    <SelectItem value="overlay">Overlay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        <SettingsIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Label className="text-slate-900 font-medium">Hiển thị breadcrumb</Label>
                        <p className="text-sm text-slate-600">Hiển thị đường dẫn điều hướng</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.showBreadcrumb}
                      onCheckedChange={updateBreadcrumb}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-cyan-500"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Label className="text-slate-900 font-medium">Compact mode</Label>
                        <p className="text-sm text-slate-600">Giảm khoảng cách giữa các phần tử</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={updateCompactMode}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-violet-500"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">Cài đặt thông báo</CardTitle>
                  <CardDescription>Cấu hình thông báo hệ thống</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Label className="text-slate-900 font-medium">Thông báo đăng nhập mới</Label>
                        <p className="text-sm text-slate-600">Gửi thông báo khi có admin đăng nhập</p>
                      </div>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-cyan-500"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <SettingsIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Label className="text-slate-900 font-medium">Thông báo thay đổi dữ liệu</Label>
                        <p className="text-sm text-slate-600">Thông báo khi có thay đổi quan trọng</p>
                      </div>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Label className="text-slate-900 font-medium">Thông báo lỗi hệ thống</Label>
                        <p className="text-sm text-slate-600">Gửi email khi có lỗi nghiêm trọng</p>
                      </div>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-500 data-[state=checked]:to-pink-500"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Label className="text-slate-900 font-medium">Báo cáo hàng ngày</Label>
                        <p className="text-sm text-slate-600">Gửi báo cáo tổng hợp hàng ngày</p>
                      </div>
                    </div>
                    <Switch className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-violet-500" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="notification_emails" className="text-slate-700 font-medium">
                  Email nhận thông báo
                </Label>
                <Textarea
                  id="notification_emails"
                  placeholder="admin@example.com&#10;manager@example.com"
                  className="h-20 rounded-xl border-slate-200 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-100"
                />
                <p className="text-sm text-slate-500">Mỗi email một dòng</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
