"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Download,
  Eye,
  Calendar,
  Activity,
  LogIn,
  Plus,
  Edit,
  Trash2,
  Upload,
  Clock,
  Users,
} from "lucide-react"

// Mock data
const logs = [
  {
    log_id: 1,
    admin_name: "Super Admin",
    log_action: "login",
    log_module: "admins",
    log_description: "Đăng nhập vào hệ thống",
    log_ip_address: "192.168.1.100",
    created_at: "2024-01-15 10:30:00",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    log_id: 2,
    admin_name: "John Doe",
    log_action: "create",
    log_module: "products",
    log_description: "Tạo sản phẩm mới: iPhone 15 Pro Max",
    log_ip_address: "192.168.1.101",
    created_at: "2024-01-15 10:25:00",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    log_id: 3,
    admin_name: "Jane Smith",
    log_action: "update",
    log_module: "admins",
    log_description: "Cập nhật thông tin admin: Mike Johnson",
    log_ip_address: "192.168.1.102",
    created_at: "2024-01-15 10:20:00",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    log_id: 4,
    admin_name: "Mike Johnson",
    log_action: "delete",
    log_module: "products",
    log_description: "Xóa sản phẩm: Old Product",
    log_ip_address: "192.168.1.103",
    created_at: "2024-01-15 10:15:00",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    log_id: 5,
    admin_name: "Sarah Wilson",
    log_action: "export",
    log_module: "products",
    log_description: "Xuất danh sách sản phẩm",
    log_ip_address: "192.168.1.104",
    created_at: "2024-01-15 10:10:00",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const getActionBadge = (action: string) => {
    switch (action) {
      case "login":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
            <LogIn className="w-3 h-3 mr-1" />
            Đăng nhập
          </Badge>
        )
      case "logout":
        return (
          <Badge className="bg-gradient-to-r from-gray-500 to-slate-500 text-white border-0 shadow-lg">Đăng xuất</Badge>
        )
      case "create":
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
            <Plus className="w-3 h-3 mr-1" />
            Tạo mới
          </Badge>
        )
      case "update":
        return (
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
            <Edit className="w-3 h-3 mr-1" />
            Cập nhật
          </Badge>
        )
      case "delete":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
            <Trash2 className="w-3 h-3 mr-1" />
            Xóa
          </Badge>
        )
      case "export":
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg">
            <Download className="w-3 h-3 mr-1" />
            Xuất dữ liệu
          </Badge>
        )
      case "import":
        return (
          <Badge className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-0 shadow-lg">
            <Upload className="w-3 h-3 mr-1" />
            Nhập dữ liệu
          </Badge>
        )
      default:
        return <Badge variant="secondary">{action}</Badge>
    }
  }

  const getModuleBadge = (module: string) => {
    const moduleConfig = {
      admins: { label: "Admin", color: "from-purple-100 to-indigo-100 text-purple-700" },
      products: { label: "Sản phẩm", color: "from-green-100 to-emerald-100 text-green-700" },
      roles: { label: "Vai trò", color: "from-blue-100 to-cyan-100 text-blue-700" },
      countries: { label: "Quốc gia", color: "from-orange-100 to-red-100 text-orange-700" },
      settings: { label: "Cài đặt", color: "from-gray-100 to-slate-100 text-gray-700" },
    }

    const config = moduleConfig[module as keyof typeof moduleConfig] || {
      label: module,
      color: "from-gray-100 to-slate-100 text-gray-700",
    }

    return <Badge className={`bg-gradient-to-r ${config.color} border-0 shadow-sm`}>{config.label}</Badge>
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const logTime = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - logTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Vừa xong"
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-orange-800 to-red-800 bg-clip-text text-transparent">
            Nhật ký hoạt động
          </h1>
          <p className="text-slate-600 mt-2">Theo dõi tất cả hoạt động trong hệ thống</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-slate-200 hover:bg-slate-50 rounded-xl transition-all duration-300"
          >
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          <Button
            variant="outline"
            className="border-slate-200 hover:bg-slate-50 rounded-xl transition-all duration-300"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Chọn ngày
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-5">
        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Tổng hoạt động</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{logs.length}</div>
            <p className="text-xs text-orange-600 mt-1">Hôm nay</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Đăng nhập</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <LogIn className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">
              {logs.filter((log) => log.log_action === "login").length}
            </div>
            <p className="text-xs text-blue-600 mt-1">24h qua</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Thao tác</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Edit className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">
              {logs.filter((log) => ["create", "update", "delete"].includes(log.log_action)).length}
            </div>
            <p className="text-xs text-green-600 mt-1">Hôm nay</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">IP unique</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">
              {new Set(logs.map((log) => log.log_ip_address)).size}
            </div>
            <p className="text-xs text-purple-600 mt-1">Địa chỉ IP</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-400/20 to-slate-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Admin hoạt động</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-gray-500 to-slate-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{new Set(logs.map((log) => log.admin_name)).size}</div>
            <p className="text-xs text-gray-600 mt-1">Đã hoạt động hôm nay</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">Tìm kiếm & Lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Tìm kiếm theo admin, sản phẩm, IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-slate-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[150px] rounded-xl border-slate-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100">
                <SelectValue placeholder="Hành động" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="login">Đăng nhập</SelectItem>
                <SelectItem value="create">Tạo mới</SelectItem>
                <SelectItem value="update">Cập nhật</SelectItem>
                <SelectItem value="delete">Xóa</SelectItem>
                <SelectItem value="export">Xuất dữ liệu</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px] rounded-xl border-slate-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="admins">Admin</SelectItem>
                <SelectItem value="products">Sản phẩm</SelectItem>
                <SelectItem value="roles">Vai trò</SelectItem>
                <SelectItem value="countries">Quốc gia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">Lịch sử hoạt động</CardTitle>
          <CardDescription>Hiển thị {logs.length} hoạt động gần nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 hover:bg-slate-50/50">
                <TableHead className="text-slate-600 font-semibold">Thời gian</TableHead>
                <TableHead className="text-slate-600 font-semibold">Admin</TableHead>
                <TableHead className="text-slate-600 font-semibold">Hành động</TableHead>
                <TableHead className="text-slate-600 font-semibold">Module</TableHead>
                <TableHead className="text-slate-600 font-semibold">Mô tả</TableHead>
                <TableHead className="text-slate-600 font-semibold">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.log_id} className="hover:bg-slate-50/80 transition-colors duration-200">
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {new Date(log.created_at).toLocaleString("vi-VN")}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {getTimeAgo(log.created_at)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8 ring-2 ring-slate-200/60 shadow-sm">
                        <AvatarImage src={log.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold">
                          {log.admin_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-slate-900">{log.admin_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getActionBadge(log.log_action)}</TableCell>
                  <TableCell>{getModuleBadge(log.log_module)}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-sm text-slate-600">{log.log_description}</div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-700 font-mono">
                      {log.log_ip_address}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
