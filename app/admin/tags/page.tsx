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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Tag, Hash, TrendingUp, Eye, Grid, List } from "lucide-react"

// Mock data with enhanced properties
const tags = [
  {
    tag_id: 1,
    tag_name: "Apple",
    tag_description: "Sản phẩm của Apple Inc.",
    created_at: "2024-01-01 00:00:00",
    product_count: 250,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    usage_trend: "+12%",
    last_used: "2024-01-15 14:30:00",
  },
  {
    tag_id: 2,
    tag_name: "Samsung",
    tag_description: "Sản phẩm Samsung Electronics",
    created_at: "2024-01-01 00:00:00",
    product_count: 180,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    usage_trend: "+8%",
    last_used: "2024-01-14 16:45:00",
  },
  {
    tag_id: 3,
    tag_name: "Flagship",
    tag_description: "Sản phẩm cao cấp, hàng đầu",
    created_at: "2024-01-01 00:00:00",
    product_count: 120,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    usage_trend: "+15%",
    last_used: "2024-01-15 10:20:00",
  },
  {
    tag_id: 4,
    tag_name: "5G",
    tag_description: "Hỗ trợ mạng 5G",
    created_at: "2024-01-01 00:00:00",
    product_count: 95,
    color: "bg-green-100 text-green-800 border-green-200",
    usage_trend: "+20%",
    last_used: "2024-01-15 09:15:00",
  },
  {
    tag_id: 5,
    tag_name: "Gaming",
    tag_description: "Tối ưu cho gaming",
    created_at: "2024-01-01 00:00:00",
    product_count: 75,
    color: "bg-red-100 text-red-800 border-red-200",
    usage_trend: "+5%",
    last_used: "2024-01-13 18:30:00",
  },
  {
    tag_id: 6,
    tag_name: "Professional",
    tag_description: "Dành cho chuyên nghiệp",
    created_at: "2024-01-01 00:00:00",
    product_count: 60,
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    usage_trend: "+3%",
    last_used: "2024-01-12 11:45:00",
  },
  {
    tag_id: 7,
    tag_name: "Budget",
    tag_description: "Giá cả phải chăng",
    created_at: "2024-01-01 00:00:00",
    product_count: 45,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    usage_trend: "-2%",
    last_used: "2024-01-10 15:20:00",
  },
]

export default function TagsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  const totalProducts = tags.reduce((sum, t) => sum + t.product_count, 0)
  const avgProductsPerTag = Math.round(totalProducts / tags.length)
  const mostPopularTag = Math.max(...tags.map((t) => t.product_count))

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
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="tag_name">Tên tag</Label>
                  <Input id="tag_name" placeholder="Nhập tên tag..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tag_description">Mô tả</Label>
                  <Textarea id="tag_description" placeholder="Mô tả chi tiết về tag..." rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Hủy
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700">Tạo Tag</Button>
              </DialogFooter>
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
            <div className="text-2xl font-bold text-blue-900">{tags.length}</div>
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
            <div className="text-2xl font-bold text-green-900">{totalProducts}</div>
            <p className="text-xs text-green-700">Có gắn tag</p>
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
            <div className="text-2xl font-bold text-purple-900">{mostPopularTag}</div>
            <p className="text-xs text-purple-700">Sản phẩm nhiều nhất</p>
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
          {tags.map((tag) => (
            <Card
              key={tag.tag_id}
              className="hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50 border-gray-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className={`${tag.color} border font-medium`}>{tag.tag_name}</Badge>
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
                      <DropdownMenuItem className="text-red-600 cursor-pointer">
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
                      {tag.product_count} sản phẩm
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        tag.usage_trend.startsWith("+")
                          ? "text-green-600 border-green-200 bg-green-50"
                          : "text-red-600 border-red-200 bg-red-50"
                      }`}
                    >
                      {tag.usage_trend}
                    </Badge>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Tạo: {new Date(tag.created_at).toLocaleDateString("vi-VN")}</span>
                    <span>Dùng: {new Date(tag.last_used).toLocaleDateString("vi-VN")}</span>
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
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Xu hướng</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Lần cuối dùng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.tag_id} className="hover:bg-blue-50/50 transition-colors">
                    <TableCell>
                      <Badge className={`${tag.color} border font-medium`}>{tag.tag_name}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm">{tag.tag_description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {tag.product_count}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          tag.usage_trend.startsWith("+")
                            ? "text-green-600 border-green-200 bg-green-50"
                            : "text-red-600 border-red-200 bg-red-50"
                        }`}
                      >
                        {tag.usage_trend}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(tag.created_at).toLocaleDateString("vi-VN")}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(tag.last_used).toLocaleDateString("vi-VN")}</div>
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
                          <DropdownMenuItem className="text-red-600">
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
    </div>
  )
}
