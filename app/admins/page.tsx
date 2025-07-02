"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createAdmin, getAdmins } from "@/services/AdminService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Shield, Eye, Users, UserCheck, UserX, Crown, Loader2 } from "lucide-react"

// Mock data
const admins = [
  {
    admin_id: 1,
    admin_username: "superadmin",
    admin_email: "super@example.com",
    admin_fullname: "Super Administrator",
    admin_level: "super_admin",
    admin_status: "active",
    admin_last_login: "2024-01-15 10:30:00",
    admin_last_ip: "192.168.1.100",
    role_name: "Super Admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    admin_id: 2,
    admin_username: "admin1",
    admin_email: "admin1@example.com",
    admin_fullname: "John Doe",
    admin_level: "admin",
    admin_status: "active",
    admin_last_login: "2024-01-15 09:15:00",
    admin_last_ip: "192.168.1.101",
    role_name: "Administrator",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    admin_id: 3,
    admin_username: "moderator1",
    admin_email: "mod1@example.com",
    admin_fullname: "Jane Smith",
    admin_level: "moderator",
    admin_status: "inactive",
    admin_last_login: "2024-01-14 16:45:00",
    admin_last_ip: "192.168.1.102",
    role_name: "Moderator",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const roles = [
  { role_id: 1, role_name: "Super Admin" },
  { role_id: 2, role_name: "Administrator" },
  { role_id: 3, role_name: "Moderator" },
  { role_id: 4, role_name: "Support" },
]

export default function AdminsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [formData, setFormData] = useState({
    admin_username: "",
    admin_email: "",
    admin_password: "",
    admin_fullname: "",
    admin_level: "",
    admin_role_id: ""
  })
  const queryClient = useQueryClient()

  // Fetch admins data
  const { data: adminsData, isLoading, error } = useQuery({
    queryKey: ["admins", currentPage, searchTerm, selectedLevel, selectedStatus],
    queryFn: () => getAdmins(currentPage, 10, searchTerm, selectedLevel, selectedStatus),
  })

  const admins = adminsData?.data?.admins || []
  const pagination = adminsData?.data?.pagination || { page: 1, limit: 10, total: 0, total_pages: 1 }

  const createAdminMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      toast.success("Tạo admin mới thành công")
      setIsCreateDialogOpen(false)
      setFormData({
        admin_username: "",
        admin_email: "",
        admin_password: "",
        admin_fullname: "",
        admin_level: "",
        admin_role_id: ""
      })
      // Refresh admin list
      queryClient.invalidateQueries({ queryKey: ["admins"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Không thể tạo admin mới")
    }
  })

  const handleCreateAdmin = () => {
    if (!formData.admin_username || !formData.admin_email || !formData.admin_password || 
        !formData.admin_fullname || !formData.admin_level || !formData.admin_role_id) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    const payload = {
      ...formData,
      admin_role_id: parseInt(formData.admin_role_id)
    }

    createAdminMutation.mutate(payload)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 text-white border-0">
            Hoạt động
          </Badge>
        )
      case "inactive":
        return (
          <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600 text-white border-0">
            Không hoạt động
          </Badge>
        )
      case "suspended":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 dark:from-red-400 dark:to-pink-400 text-white border-0">
            Tạm khóa
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "super_admin":
        return (
          <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 text-white border-0 shadow-lg">
            <Crown className="w-3 h-3 mr-1" />
            Super Admin
          </Badge>
        )
      case "admin":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 text-white border-0 shadow-lg">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        )
      case "moderator":
        return (
          <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400 text-white border-0 shadow-lg">
            <UserCheck className="w-3 h-3 mr-1" />
            Moderator
          </Badge>
        )
      case "support":
        return (
          <Badge className="bg-gradient-to-r from-gray-500 to-slate-500 dark:from-gray-400 dark:to-slate-400 text-white border-0 shadow-lg">
            <Users className="w-3 h-3 mr-1" />
            Support
          </Badge>
        )
      default:
        return <Badge variant="secondary">{level}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 dark:from-gray-100 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Quản lý tài khoản người dùng và phân quyền</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Thêm người dùng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 backdrop-blur-xl border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Thêm người dùng mới
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Tạo tài khoản người dùng mới cho hệ thống
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  Username
                </Label>
                <Input
                  id="username"
                  value={formData.admin_username}
                  onChange={(e) => handleInputChange("admin_username", e.target.value)}
                  className="col-span-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900"
                  placeholder="Nhập username"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.admin_email}
                  onChange={(e) => handleInputChange("admin_email", e.target.value)}
                  className="col-span-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900"
                  placeholder="Nhập email"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullname" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  Họ tên
                </Label>
                <Input
                  id="fullname"
                  value={formData.admin_fullname}
                  onChange={(e) => handleInputChange("admin_fullname", e.target.value)}
                  className="col-span-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900"
                  placeholder="Nhập họ tên"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="level" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  Cấp độ
                </Label>
                <Select value={formData.admin_level} onValueChange={(value) => handleInputChange("admin_level", value)}>
                  <SelectTrigger className="col-span-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900">
                    <SelectValue placeholder="Chọn cấp độ" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  Vai trò
                </Label>
                <Select value={formData.admin_role_id} onValueChange={(value) => handleInputChange("admin_role_id", value)}>
                  <SelectTrigger className="col-span-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
                    {roles.map((role) => (
                      <SelectItem key={role.role_id} value={role.role_id.toString()}>
                        {role.role_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.admin_password}
                  onChange={(e) => handleInputChange("admin_password", e.target.value)}
                  className="col-span-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleCreateAdmin}
                disabled={createAdminMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600 text-white rounded-xl"
              >
                {createAdminMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo người dùng"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200/50 dark:border-purple-800/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 dark:from-purple-400/30 dark:to-indigo-400/30 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Tổng Admin</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {isLoading ? "..." : pagination.total}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Tổng số admin</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 dark:from-green-400/30 dark:to-emerald-400/30 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Đang hoạt động</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {isLoading ? "..." : admins.filter((a: any) => a.admin_status === "active").length}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {isLoading ? "..." : admins.length > 0 ? Math.round((admins.filter((a: any) => a.admin_status === "active").length / admins.length) * 100) : 0}% tổng số
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200/50 dark:border-orange-800/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 dark:from-orange-400/30 dark:to-red-400/30 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Không hoạt động</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <UserX className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {isLoading ? "..." : admins.filter((a: any) => a.admin_status === "inactive").length}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Cần kiểm tra</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/50 dark:border-blue-800/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 dark:from-blue-400/30 dark:to-cyan-400/30 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Vai trò</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{roles.length}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Tổng vai trò</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/60 dark:border-gray-700/60 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Tìm kiếm & Lọc</CardTitle>
        </CardHeader>
        <CardContent>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Tìm kiếm theo tên, email, username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="suspended">Tạm khóa</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900">
                    <SelectValue placeholder="Cấp độ" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
        </CardContent>
      </Card>

      {/* Admins Table */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/60 dark:border-gray-700/60 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Danh sách Admin</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {isLoading ? "Đang tải..." : `Tổng cộng ${pagination.total} admin trong hệ thống`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-red-600 dark:text-red-400">Không thể tải dữ liệu admin</span>
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="lg:hidden space-y-4">
                {admins.map((admin: any) => (
              <Card
                key={admin.admin_id}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/60 dark:border-gray-700/60 hover:shadow-xl transition-all duration-300 rounded-xl"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 ring-2 ring-gray-200/60 dark:ring-gray-700/60 shadow-md">
                        <AvatarImage src={admin.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 text-white font-semibold">
                          {admin.admin_fullname
                            .split(" ")
                            .map((n: any) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{admin.admin_fullname}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">@{admin.admin_username}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{admin.admin_email}</div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <span className="sr-only">Mở menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-gray-200/60 dark:border-gray-700/60 shadow-xl rounded-xl"
                      >
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 rounded-lg">
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 rounded-lg">
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 rounded-lg">
                          <Shield className="mr-2 h-4 w-4" />
                          Phân quyền
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-lg">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Vai trò:</span>
                      {getLevelBadge(admin.admin_level)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Trạng thái:</span>
                      {getStatusBadge(admin.admin_status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Đăng nhập cuối:</span>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {admin.admin_last_login ? new Date(admin.admin_last_login).toLocaleString("vi-VN") : "Chưa đăng nhập"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Ngày tạo:</span>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {admin.created_at ? new Date(admin.created_at).toLocaleDateString("vi-VN") : "N/A"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">Admin</TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">Email</TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">Vai trò</TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">Trạng thái</TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">Đăng nhập cuối</TableHead>
                      <TableHead className="text-right text-gray-600 dark:text-gray-400 font-semibold">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin: any) => (
                  <TableRow
                    key={admin.admin_id}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 ring-2 ring-gray-200/60 dark:ring-gray-700/60 shadow-md">
                          <AvatarImage src={admin.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 text-white font-semibold">
                            {admin.admin_fullname
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{admin.admin_fullname}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">@{admin.admin_username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">{admin.admin_email}</TableCell>
                    <TableCell>
                      {getLevelBadge(admin.admin_level)}
                    </TableCell>
                    <TableCell>{getStatusBadge(admin.admin_status)}</TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {admin.admin_last_login ? new Date(admin.admin_last_login).toLocaleString("vi-VN") : "Chưa đăng nhập"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          >
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-gray-200/60 dark:border-gray-700/60 shadow-xl rounded-xl"
                        >
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 rounded-lg">
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 rounded-lg">
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 rounded-lg">
                            <Shield className="mr-2 h-4 w-4" />
                            Phân quyền
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-lg">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
