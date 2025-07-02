"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Folder,
  FolderOpen,
  Package,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCategoriesTree, createCategory, updateCategory, deleteCategory } from "@/services/CategoryService"
import { toast } from "sonner"

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])
  const [formData, setFormData] = useState({
    category_name: "",
    parent_id: "none"
  })
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [deletingCategory, setDeletingCategory] = useState<any>(null)

  const queryClient = useQueryClient()

  // Fetch categories data
  const { data: categoriesTree = [], isLoading, error } = useQuery({
    queryKey: ["categories-tree"],
    queryFn: getCategoriesTree,
  })

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Tạo danh mục thành công!")
      queryClient.invalidateQueries({ queryKey: ["categories-tree"] })
      setIsCreateDialogOpen(false)
      setFormData({ category_name: "", parent_id: "none" })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo danh mục")
    }
  })

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, item }: { id: number; item: any }) => updateCategory(id, item),
    onSuccess: () => {
      toast.success("Cập nhật danh mục thành công!")
      queryClient.invalidateQueries({ queryKey: ["categories-tree"] })
      setIsEditDialogOpen(false)
      setEditingCategory(null)
      setFormData({ category_name: "", parent_id: "none" })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật danh mục")
    }
  })

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Xóa danh mục thành công!")
      queryClient.invalidateQueries({ queryKey: ["categories-tree"] })
      setIsDeleteDialogOpen(false)
      setDeletingCategory(null)
    },
    onError: (error: any) => {
      if (error.response?.status === 409) {
        toast.error("Danh mục đang được sử dụng bởi sản phẩm. Vui lòng xóa danh mục khỏi sản phẩm trước khi xóa danh mục.")
      } else {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xóa danh mục")
      }
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleParentIdChange = (value: string) => {
    setFormData(prev => ({ ...prev, parent_id: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category_name.trim()) {
      toast.error("Vui lòng nhập tên danh mục")
      return
    }

    const payload: { category_name: string; parent_id?: number } = {
      category_name: formData.category_name.trim()
    }

    // Handle parent_id
    if (formData.parent_id !== "none") {
      payload.parent_id = parseInt(formData.parent_id)
    }

    createCategoryMutation.mutate(payload)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category_name.trim()) {
      toast.error("Vui lòng nhập tên danh mục")
      return
    }

    const payload: { category_name: string; parent_id?: number } = {
      category_name: formData.category_name.trim()
    }

    // Handle parent_id
    if (formData.parent_id !== "none") {
      payload.parent_id = parseInt(formData.parent_id)
    }

    updateCategoryMutation.mutate({
      id: editingCategory.category_id,
      item: payload
    })
  }

  const handleEditClick = (category: any) => {
    setEditingCategory(category)
    setFormData({
      category_name: category.category_name,
      parent_id: category.parent_id ? category.parent_id.toString() : "none"
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (category: any) => {
    setDeletingCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (deletingCategory) {
      deleteCategoryMutation.mutate(deletingCategory.category_id)
    }
  }

  const toggleExpanded = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const flattenCategories = () => {
    const result: any[] = []
    categoriesTree.forEach((category: any) => {
      result.push({ ...category, level: 0 })
      if (expandedCategories.includes(category.category_id) && category.children) {
        category.children.forEach((child: any) => {
          result.push({ ...child, level: 1 })
        })
      }
    })
    return result
  }

  // Calculate stats from real data
  const totalCategories = categoriesTree.length + categoriesTree.reduce((sum: number, c: any) => sum + (c.children?.length || 0), 0)
  const rootCategories = categoriesTree.length
  const childCategories = categoriesTree.reduce((sum: number, c: any) => sum + (c.children?.length || 0), 0)

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
              Quản lý Danh mục
            </h1>
            <p className="text-slate-600 mt-2">Đang tải dữ liệu...</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
              Quản lý Danh mục
            </h1>
            <p className="text-red-600 mt-2">Có lỗi xảy ra khi tải dữ liệu</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
            Quản lý Danh mục
          </h1>
          <p className="text-slate-600 mt-2">Quản lý cây danh mục sản phẩm</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Thêm Danh mục
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-900">Thêm Danh mục mới</DialogTitle>
              <DialogDescription className="text-slate-600">Tạo danh mục sản phẩm mới</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category_name" className="text-right font-medium text-slate-700">
                    Tên danh mục
                  </Label>
                  <Input
                    id="category_name"
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleInputChange}
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                    placeholder="Nhập tên danh mục..."
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="parent_id" className="text-right font-medium text-slate-700">
                    Danh mục cha
                  </Label>
                  <Select value={formData.parent_id} onValueChange={handleParentIdChange}>
                    <SelectTrigger className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                      <SelectValue placeholder="Chọn danh mục cha (tùy chọn)" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      <SelectItem value="none">📁 Không có danh mục cha (Danh mục gốc)</SelectItem>
                      {categoriesTree.map((category: any) => (
                        <SelectItem key={category.category_id} value={category.category_id.toString()}>
                          📁 {category.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="rounded-xl"
                >
                  Hủy
                </Button>
                <Button 
                  type="submit"
                  disabled={createCategoryMutation.isPending}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
                >
                  {createCategoryMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo Danh mục"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Tổng danh mục</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Folder className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{totalCategories}</div>
            <div className="flex items-center text-xs text-green-600 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              {rootCategories} danh mục gốc
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Danh mục gốc</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <FolderOpen className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{rootCategories}</div>
            <p className="text-xs text-blue-600 mt-1">Cấp độ cao nhất</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Danh mục con</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{childCategories}</div>
            <p className="text-xs text-purple-600 mt-1">Cấp độ 2</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Tổng sản phẩm</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">-</div>
            <p className="text-xs text-orange-600 mt-1">Chưa có dữ liệu</p>
          </CardContent>
        </Card>
      </div>



      {/* Search */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">Tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Tìm kiếm theo tên danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">Cây danh mục</CardTitle>
          <CardDescription>Danh sách danh mục theo cấu trúc cây</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 hover:bg-slate-50/50">
                <TableHead className="text-slate-600 font-semibold">Danh mục</TableHead>
                <TableHead className="text-slate-600 font-semibold">Danh mục con</TableHead>
                <TableHead className="text-slate-600 font-semibold">ID</TableHead>
                <TableHead className="text-right text-slate-600 font-semibold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flattenCategories().map((category: any) => (
                <TableRow key={category.category_id} className="hover:bg-slate-50/80 transition-colors duration-200">
                  <TableCell>
                    <div className={`flex items-center ${category.level > 0 ? "ml-6" : ""}`}>
                      {category.level === 0 && category.children && category.children.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mr-2 h-6 w-6 p-0 hover:bg-slate-100 rounded-lg"
                          onClick={() => toggleExpanded(category.category_id)}
                        >
                          {expandedCategories.includes(category.category_id) ? (
                            <FolderOpen className="h-4 w-4" />
                          ) : (
                            <Folder className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      {category.level > 0 && (
                        <div className="mr-2 w-6 flex justify-center">
                          <div className="w-4 h-4 border-l-2 border-b-2 border-gray-300 rounded-bl-lg"></div>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">📁</span>
                        <span className={category.level === 0 ? "font-semibold text-slate-900" : "text-slate-600"}>
                          {category.category_name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        category.level === 0 && category.children && category.children.length > 0
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg"
                          : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-0"
                      }`}
                    >
                      {category.children?.length || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-600">
                      {category.category_id}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg">
                          <span className="sr-only">Mở menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-xl rounded-xl"
                      >
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem 
                          className="hover:bg-slate-50/80 rounded-lg"
                          onClick={() => handleEditClick(category)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        {category.level === 0 && (
                          <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm danh mục con
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 hover:bg-red-50/80 rounded-lg"
                          onClick={() => handleDeleteClick(category)}
                        >
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
        </CardContent>
      </Card>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">Chỉnh sửa Danh mục</DialogTitle>
            <DialogDescription className="text-slate-600">Cập nhật thông tin danh mục sản phẩm</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_category_name" className="text-right font-medium text-slate-700">
                  Tên danh mục
                </Label>
                <Input
                  id="edit_category_name"
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleInputChange}
                  className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  placeholder="Nhập tên danh mục..."
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_parent_id" className="text-right font-medium text-slate-700">
                  Danh mục cha
                </Label>
                <Select value={formData.parent_id} onValueChange={handleParentIdChange}>
                  <SelectTrigger className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                    <SelectValue placeholder="Chọn danh mục cha (tùy chọn)" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    <SelectItem value="none">📁 Không có danh mục cha (Danh mục gốc)</SelectItem>
                    {categoriesTree
                      .filter((cat: any) => cat.category_id !== editingCategory?.category_id)
                      .map((category: any) => (
                        <SelectItem key={category.category_id} value={category.category_id.toString()}>
                          📁 {category.category_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="rounded-xl"
              >
                Hủy
              </Button>
              <Button 
                type="submit"
                disabled={updateCategoryMutation.isPending}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
              >
                {updateCategoryMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật Danh mục"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục <strong>"{deletingCategory?.category_name}"</strong>?
              <br /><br />
              <span className="text-amber-600 font-medium">⚠️ Lưu ý:</span> Nếu danh mục này đang được sử dụng bởi sản phẩm hoặc có danh mục con, bạn sẽ không thể xóa được. Hãy xóa danh mục khỏi sản phẩm và xóa các danh mục con trước.
              <br /><br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl">📁</div>
            <div>
              <div className="font-semibold text-red-800">{deletingCategory?.category_name}</div>
              <div className="text-sm text-red-600">ID: {deletingCategory?.category_id}</div>
              {deletingCategory?.children && deletingCategory.children.length > 0 && (
                <div className="text-sm text-red-600">
                  Có {deletingCategory.children.length} danh mục con
                </div>
              )}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteCategoryMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteCategoryMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
