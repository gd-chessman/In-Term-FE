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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Tag, Hash, TrendingUp, Eye, Grid, List } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTags, createTag, deleteTag } from "@/services/TagService"
import { toast } from "sonner"

export default function TagsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [formData, setFormData] = useState({
    tag_name: "",
    tag_description: ""
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<any>(null)

  const queryClient = useQueryClient()

  // Fetch tags data
  const { data: tags = [], isLoading, error } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  })

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      toast.success("Tạo tag thành công!")
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      setIsCreateDialogOpen(false)
      setFormData({ tag_name: "", tag_description: "" })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo tag")
    }
  })

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      toast.success("Xóa tag thành công!")
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      setDeleteDialogOpen(false)
      setTagToDelete(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xóa tag")
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.tag_name.trim()) {
      toast.error("Vui lòng nhập tên tag")
      return
    }

    const payload = {
      tag_name: formData.tag_name.trim(),
      tag_description: formData.tag_description.trim()
    }

    createTagMutation.mutate(payload)
  }

  const handleDeleteClick = (tag: any) => {
    setTagToDelete(tag)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (tagToDelete) {
      deleteTagMutation.mutate(tagToDelete.tag_id)
    }
  }

  // Calculate stats from real data
  const totalTags = tags.length
  const avgProductsPerTag = tags.length > 0 ? Math.round(tags.length / tags.length) : 0

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Quản lý Tags
            </h1>
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Quản lý Tags
            </h1>
            <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Quản lý Tags
          </h1>
          <p className="text-muted-foreground">Quản lý thẻ gắn cho sản phẩm</p>
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
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Plus className="mr-2 h-4 w-4" />
                Thêm Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Tag className="h-4 w-4 text-white" />
                  </div>
                  Thêm Tag mới
                </DialogTitle>
                <DialogDescription>Tạo thẻ mới cho sản phẩm trong hệ thống</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="tag_name">Tên tag</Label>
                    <Input 
                      id="tag_name" 
                      name="tag_name"
                      value={formData.tag_name}
                      onChange={handleInputChange}
                      placeholder="Nhập tên tag..." 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tag_description">Mô tả</Label>
                    <Textarea 
                      id="tag_description" 
                      name="tag_description"
                      value={formData.tag_description}
                      onChange={handleInputChange}
                      placeholder="Mô tả chi tiết về tag..." 
                      rows={3} 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createTagMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-blue-700"
                  >
                    {createTagMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Đang tạo...
                      </>
                    ) : (
                      "Tạo Tag"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Tổng tags</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Tag className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalTags}</div>
            <p className="text-xs text-blue-700">Đang hoạt động</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Tổng sản phẩm</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-500 flex items-center justify-center">
              <Hash className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">-</div>
            <p className="text-xs text-green-700">Chưa có dữ liệu</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Tag phổ biến</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">-</div>
            <p className="text-xs text-purple-700">Chưa có dữ liệu</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">TB sản phẩm</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Hash className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{avgProductsPerTag}</div>
            <p className="text-xs text-orange-700">Sản phẩm/tag</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search */}
      <Card className="bg-gradient-to-r from-gray-50 to-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-600" />
            Tìm kiếm & Lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên tag, mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Conditional Rendering based on View Mode */}
      {viewMode === "cards" ? (
        /* Enhanced Tags Grid */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag: any) => (
            <Card
              key={tag.tag_id}
              className="hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50 border-gray-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium">{tag.tag_name}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Tag className="mr-2 h-4 w-4" />
                        Xem sản phẩm
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDeleteClick(tag)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{tag.tag_description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      ID: {tag.tag_id}
                    </Badge>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Tạo: {new Date(tag.created_at).toLocaleDateString("vi-VN")}</span>
                    <span>Cập nhật: {new Date(tag.updated_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Enhanced Tags Table */
        <Card className="bg-gradient-to-r from-white to-gray-50">
          <CardHeader>
            <CardTitle>Danh sách Tags</CardTitle>
            <CardDescription>Tổng cộng {tags.length} tags trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Tag</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Cập nhật</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag: any) => (
                  <TableRow key={tag.tag_id} className="hover:bg-blue-50/50 transition-colors">
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium">{tag.tag_name}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm">{tag.tag_description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {tag.tag_id}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(tag.created_at).toLocaleDateString("vi-VN")}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(tag.updated_at).toLocaleDateString("vi-VN")}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Tag className="mr-2 h-4 w-4" />
                            Xem sản phẩm
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteClick(tag)}
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
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tag</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tag "{tagToDelete?.tag_name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteTagMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteTagMutation.isPending ? (
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
