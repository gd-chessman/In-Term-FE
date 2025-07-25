"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Search, Edit, Trash2, Building2, Filter, MoreHorizontal, Loader2, Grid, List, TrendingUp, Users, MapPin, Calendar } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"

import { getBranches, createBranch, updateBranch, deleteBranch, updateBranchStatus } from "@/services/BranchService"

export default function BranchesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  // States
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"cards" | "table">("table")

  // Form states
  const [formData, setFormData] = useState({
    branch_name: "",
    branch_description: ""
  })

  const [editFormData, setEditFormData] = useState({
    branch_name: "",
    branch_description: ""
  })

  // Read search param from URL
  useEffect(() => {
    const search = searchParams.get('search')
    if (search) {
      setSearchTerm(search)
    }
  }, [searchParams])

  // Fetch branches data
  const { data: branchesData, isLoading, error, refetch } = useQuery({
    queryKey: ['branches', searchTerm, statusFilter, currentPage],
    queryFn: () => getBranches({
      query: searchTerm || undefined,
      status: statusFilter !== 'all' ? statusFilter as 'active' | 'inactive' : undefined,
      page: currentPage,
      limit: 10,
      sortBy: 'created_at',
      sortOrder: 'desc'
    })
  })



  // Mutations
  const createMutation = useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success("Tạo chi nhánh thành công!")
      setIsCreateDialogOpen(false)
      setFormData({ branch_name: "", branch_description: "" })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo chi nhánh")
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => updateBranch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success("Cập nhật chi nhánh thành công!")
      setIsEditDialogOpen(false)
      setSelectedBranch(null)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật chi nhánh")
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success("Xóa chi nhánh thành công!")
      setIsDeleteDialogOpen(false)
      setSelectedBranch(null)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa chi nhánh")
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: 'active' | 'inactive' }) => updateBranchStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success("Cập nhật trạng thái thành công!")
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái")
    }
  })

  // Handlers
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.branch_name.trim()) {
      toast.error("Tên chi nhánh không được để trống")
      return
    }
    createMutation.mutate(formData)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editFormData.branch_name.trim()) {
      toast.error("Tên chi nhánh không được để trống")
      return
    }
    if (selectedBranch) {
      updateMutation.mutate({ id: selectedBranch.branch_id, data: editFormData })
    }
  }

  const handleDelete = () => {
    if (selectedBranch) {
      deleteMutation.mutate(selectedBranch.branch_id)
    }
  }

  const handleEdit = (branch: any) => {
    setSelectedBranch(branch)
    setEditFormData({
      branch_name: branch.branch_name,
      branch_description: branch.branch_description || ""
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (branch: any) => {
    setSelectedBranch(branch)
    setIsDeleteDialogOpen(true)
  }

  const handleStatusChange = (branch: any, newStatus: boolean) => {
    const status = newStatus ? 'active' : 'inactive'
    updateStatusMutation.mutate({ id: branch.branch_id, status })
  }

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Hoạt động</Badge>
    } else {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">Không hoạt động</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }



  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 mb-2">Có lỗi xảy ra khi tải dữ liệu</div>
          <Button onClick={() => refetch()} variant="outline">
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  const branches = branchesData?.branches || []

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-800 bg-clip-text text-transparent">
            Quản lý Chi nhánh
          </h1>
          <p className="text-slate-600 mt-2">Quản lý thông tin các chi nhánh trong hệ thống</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white rounded-lg border shadow-sm">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                <Plus className="mr-2 h-4 w-4" />
                Thêm Chi nhánh
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-slate-900">Thêm Chi nhánh mới</DialogTitle>
                <DialogDescription className="text-slate-600">Thêm chi nhánh mới vào hệ thống</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit}>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="branch_name" className="text-right font-medium text-slate-700">
                      Tên chi nhánh
                    </Label>
                    <Input
                      id="branch_name"
                      value={formData.branch_name}
                      onChange={(e) => setFormData({...formData, branch_name: e.target.value})}
                      className="col-span-3 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      placeholder="Nhập tên chi nhánh"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="branch_description" className="text-right font-medium text-slate-700">
                      Mô tả
                    </Label>
                    <Textarea
                      id="branch_description"
                      value={formData.branch_description}
                      onChange={(e) => setFormData({...formData, branch_description: e.target.value})}
                      className="col-span-3 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      placeholder="Nhập mô tả chi nhánh (tùy chọn)"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang thêm...
                      </>
                    ) : (
                      'Thêm Chi nhánh'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Tổng chi nhánh</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{branches.length}</div>
            <div className="flex items-center text-xs text-blue-600 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trong hệ thống
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Đang hoạt động</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">
              {branches.filter((branch: any) => branch.branch_status === 'active').length}
            </div>
            <p className="text-xs text-green-600 mt-1">Chi nhánh hoạt động</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Không hoạt động</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">
              {branches.filter((branch: any) => branch.branch_status === 'inactive').length}
            </div>
            <p className="text-xs text-purple-600 mt-1">Chi nhánh tạm ngưng</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Tỷ lệ hoạt động</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">
              {branches.length > 0 ? Math.round((branches.filter((branch: any) => branch.branch_status === 'active').length / branches.length) * 100) : 0}%
            </div>
            <p className="text-xs text-orange-600 mt-1">Chi nhánh hoạt động</p>
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
                placeholder="Tìm kiếm theo tên chi nhánh, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {isLoading ? (
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
          <CardHeader>
            <CardTitle className="text-slate-900">Danh sách Chi nhánh</CardTitle>
            <CardDescription>Đang tải dữ liệu...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="text-slate-600">Đang tải dữ liệu chi nhánh...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "cards" ? (
        // Cards View
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
          <CardHeader>
            <CardTitle className="text-slate-900">Danh sách Chi nhánh</CardTitle>
            <CardDescription>Tổng cộng {branches.length} chi nhánh trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch: any) => (
                <Card key={branch.branch_id} className="hover:shadow-lg transition-shadow border-slate-200/60 rounded-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg text-slate-900">{branch.branch_name}</CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(branch)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(branch)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="text-slate-600">
                      {branch.branch_description || "Không có mô tả"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Trạng thái:</span>
                        <Switch
                          checked={branch.branch_status === 'active'}
                          onCheckedChange={(checked) => handleStatusChange(branch, checked)}
                          disabled={updateStatusMutation.isPending}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Ngày tạo:</span>
                        <span className="text-sm text-slate-700">{formatDate(branch.created_at)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Cập nhật:</span>
                        <span className="text-sm text-slate-700">{formatDate(branch.updated_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Table View
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
          <CardHeader>
            <CardTitle className="text-slate-900">Danh sách Chi nhánh</CardTitle>
            <CardDescription>Tổng cộng {branches.length} chi nhánh trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-slate-50/50">
                  <TableHead className="text-slate-600 font-semibold">Tên chi nhánh</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Mô tả</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Trạng thái</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Ngày tạo</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Cập nhật</TableHead>
                  <TableHead className="text-right text-slate-600 font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch: any) => (
                  <TableRow key={branch.branch_id} className="border-slate-100 hover:bg-slate-50/50">
                    <TableCell className="font-medium text-slate-900">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <span>{branch.branch_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {branch.branch_description || "Không có mô tả"}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={branch.branch_status === 'active'}
                        onCheckedChange={(checked) => handleStatusChange(branch, checked)}
                        disabled={updateStatusMutation.isPending}
                      />
                    </TableCell>
                    <TableCell className="text-slate-600">{formatDate(branch.created_at)}</TableCell>
                    <TableCell className="text-slate-600">{formatDate(branch.updated_at)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(branch)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(branch)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}



      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">Chỉnh sửa Chi nhánh</DialogTitle>
            <DialogDescription className="text-slate-600">Cập nhật thông tin chi nhánh</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_branch_name" className="text-right font-medium text-slate-700">
                  Tên chi nhánh
                </Label>
                <Input
                  id="edit_branch_name"
                  value={editFormData.branch_name}
                  onChange={(e) => setEditFormData({...editFormData, branch_name: e.target.value})}
                  className="col-span-3 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  placeholder="Nhập tên chi nhánh"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_branch_description" className="text-right font-medium text-slate-700">
                  Mô tả
                </Label>
                <Textarea
                  id="edit_branch_description"
                  value={editFormData.branch_description}
                  onChange={(e) => setEditFormData({...editFormData, branch_description: e.target.value})}
                  className="col-span-3 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  placeholder="Nhập mô tả chi nhánh (tùy chọn)"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  'Cập nhật Chi nhánh'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-slate-900">Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Bạn có chắc chắn muốn xóa chi nhánh <strong>{selectedBranch?.branch_name}</strong>? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2 p-4 bg-red-50 rounded-lg border border-red-200">
            <Building2 className="h-8 w-8 text-red-600" />
            <div>
              <div className="font-semibold text-red-800">{selectedBranch?.branch_name}</div>
              <div className="text-sm text-red-600">{selectedBranch?.branch_description || "Không có mô tả"}</div>
            </div>
          </div>
          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 rounded-xl"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa Chi nhánh
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 