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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getAllAdminLogs, getAdminLogStatistics } from "@/services/AdminService"

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [logAction, setLogAction] = useState<string>("all")
  const [logModule, setLogModule] = useState<string>("all")

  // Fetch logs from API
  const { data: logsData, isLoading } = useQuery({
    queryKey: ["adminLogs", currentPage, pageSize, searchTerm, logAction, logModule],
    queryFn: () => getAllAdminLogs(currentPage, pageSize, searchTerm, logAction, logModule),
  })

  // Fetch statistics from API
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["adminLogStats"],
    queryFn: getAdminLogStatistics,
  })

  const logs = logsData?.data?.data || []
  const pagination = logsData?.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }

  // const stats = statsData || { total: 0, today: 0, login24h: 0, actionsToday: 0, uniqueIps: 0 }

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
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Tổng hoạt động</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{isLoadingStats ? '...' : stats?.total}</div>
            <p className="text-xs text-orange-600 mt-1">Tổng số</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Đăng nhập 24h</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <LogIn className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{isLoadingStats ? '...' : stats?.login24h}</div>
            <p className="text-xs text-blue-600 mt-1">24h qua</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Thao tác hôm nay</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Edit className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{isLoadingStats ? '...' : stats?.actionsToday}</div>
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
            <div className="text-3xl font-bold text-slate-900">{isLoadingStats ? '...' : stats?.uniqueIps}</div>
            <p className="text-xs text-purple-600 mt-1">Địa chỉ IP</p>
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
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 rounded-xl border-slate-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
              />
            </div>
            <Select value={logAction} onValueChange={v => { setLogAction(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-[150px] rounded-xl border-slate-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100">
                <SelectValue placeholder="Hành động" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="login">Đăng nhập</SelectItem>
                <SelectItem value="logout">Đăng xuất</SelectItem>
                <SelectItem value="create">Tạo mới</SelectItem>
                <SelectItem value="update">Cập nhật</SelectItem>
                <SelectItem value="delete">Xóa</SelectItem>
                <SelectItem value="approve">Duyệt</SelectItem>
                <SelectItem value="reject">Từ chối</SelectItem>
                <SelectItem value="suspend">Tạm ngưng</SelectItem>
                <SelectItem value="activate">Kích hoạt</SelectItem>
                <SelectItem value="view">Xem</SelectItem>
                <SelectItem value="export">Xuất dữ liệu</SelectItem>
                <SelectItem value="import">Nhập dữ liệu</SelectItem>
              </SelectContent>
            </Select>
            <Select value={logModule} onValueChange={v => { setLogModule(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-[150px] rounded-xl border-slate-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100">
                <SelectValue placeholder="Phân hệ" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="admins">Admin</SelectItem>
                <SelectItem value="roles">Vai trò</SelectItem>
                <SelectItem value="countries">Quốc gia</SelectItem>
                <SelectItem value="categories">Danh mục</SelectItem>
                <SelectItem value="products">Sản phẩm</SelectItem>
                <SelectItem value="product_tags">Tag sản phẩm</SelectItem>
                <SelectItem value="price_printing">In giá</SelectItem>
                <SelectItem value="settings">Cài đặt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">Lịch sử hoạt động</CardTitle>
          <CardDescription>Hiển thị {pagination.total} hoạt động gần nhất</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <span>Đang tải dữ liệu...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-slate-50/50">
                    <TableHead className="text-slate-600 font-semibold">Thời gian</TableHead>
                    <TableHead className="text-slate-600 font-semibold">Quản trị viên</TableHead>
                    <TableHead className="text-slate-600 font-semibold">Hành động</TableHead>
                    <TableHead className="text-slate-600 font-semibold">Phân hệ</TableHead>
                    <TableHead className="text-slate-600 font-semibold">Mô tả</TableHead>
                    <TableHead className="text-slate-600 font-semibold">Địa chỉ IP</TableHead>
                    <TableHead className="text-slate-600 font-semibold">Thiết bị/Trình duyệt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log: any) => (
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
                            <AvatarImage src={log.admin?.admin_avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold">
                              {log.admin?.admin_fullname
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("") || "A"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-slate-900">{log.admin?.admin_fullname || "N/A"}</span>
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
                      <TableCell>
                        <div className="max-w-xs truncate text-xs text-slate-500 font-mono">
                          {log.log_user_agent || 'N/A'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* Pagination */}
              <div className="flex items-center justify-center mt-6 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center p-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-slate-700 font-semibold px-2">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="flex items-center p-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
