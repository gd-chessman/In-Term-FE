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

// Mock data
const categories = [
  {
    category_id: 1,
    category_name: "Điện thoại",
    parent_id: null,
    created_at: "2024-01-01 00:00:00",
    product_count: 450,
    icon: "📱",
    color: "from-blue-500 to-cyan-500",
    children: [
      {
        category_id: 2,
        category_name: "iPhone",
        parent_id: 1,
        created_at: "2024-01-01 00:00:00",
        product_count: 180,
        icon: "🍎",
      },
      {
        category_id: 3,
        category_name: "Samsung",
        parent_id: 1,
        created_at: "2024-01-01 00:00:00",
        product_count: 150,
        icon: "📱",
      },
      {
        category_id: 4,
        category_name: "Xiaomi",
        parent_id: 1,
        created_at: "2024-01-01 00:00:00",
        product_count: 120,
        icon: "📱",
      },
    ],
  },
  {
    category_id: 5,
    category_name: "Laptop",
    parent_id: null,
    created_at: "2024-01-01 00:00:00",
    product_count: 320,
    icon: "💻",
    color: "from-green-500 to-emerald-500",
    children: [
      {
        category_id: 6,
        category_name: "MacBook",
        parent_id: 5,
        created_at: "2024-01-01 00:00:00",
        product_count: 120,
        icon: "🍎",
      },
      {
        category_id: 7,
        category_name: "Dell",
        parent_id: 5,
        created_at: "2024-01-01 00:00:00",
        product_count: 100,
        icon: "💻",
      },
      {
        category_id: 8,
        category_name: "HP",
        parent_id: 5,
        created_at: "2024-01-01 00:00:00",
        product_count: 100,
        icon: "💻",
      },
    ],
  },
  {
    category_id: 9,
    category_name: "Tablet",
    parent_id: null,
    created_at: "2024-01-01 00:00:00",
    product_count: 180,
    icon: "📱",
    color: "from-purple-500 to-violet-500",
    children: [
      {
        category_id: 10,
        category_name: "iPad",
        parent_id: 9,
        created_at: "2024-01-01 00:00:00",
        product_count: 120,
        icon: "🍎",
      },
      {
        category_id: 11,
        category_name: "Samsung Tab",
        parent_id: 9,
        created_at: "2024-01-01 00:00:00",
        product_count: 60,
        icon: "📱",
      },
    ],
  },
  {
    category_id: 12,
    category_name: "Phụ kiện",
    parent_id: null,
    created_at: "2024-01-01 00:00:00",
    product_count: 280,
    icon: "🎧",
    color: "from-orange-500 to-red-500",
    children: [],
  },
]

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<number[]>([1, 5, 9])

  const toggleExpanded = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const flattenCategories = () => {
    const result: any[] = []
    categories.forEach((category) => {
      result.push({ ...category, level: 0 })
      if (expandedCategories.includes(category.category_id) && category.children) {
        category.children.forEach((child) => {
          result.push({ ...child, level: 1 })
        })
      }
    })
    return result
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
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category_name" className="text-right font-medium text-slate-700">
                  Tên danh mục
                </Label>
                <Input
                  id="category_name"
                  className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parent_id" className="text-right font-medium text-slate-700">
                  Danh mục cha
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                    <SelectValue placeholder="Chọn danh mục cha (tùy chọn)" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    <SelectItem value="none">Không có danh mục cha</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.category_id} value={category.category_id.toString()}>
                        {category.icon} {category.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl">
                Tạo Danh mục
              </Button>
            </DialogFooter>
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
            <div className="text-3xl font-bold text-slate-900">
              {categories.length + categories.reduce((sum, c) => sum + c.children.length, 0)}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              {categories.length} danh mục gốc
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
            <div className="text-3xl font-bold text-slate-900">{categories.length}</div>
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
            <div className="text-3xl font-bold text-slate-900">
              {categories.reduce((sum, c) => sum + c.children.length, 0)}
            </div>
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
            <div className="text-3xl font-bold text-slate-900">
              {categories.reduce((sum, c) => sum + c.product_count, 0).toLocaleString()}
            </div>
            <p className="text-xs text-orange-600 mt-1">Trên tất cả danh mục</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Card
            key={category.category_id}
            className="relative overflow-hidden bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl"
          >
            <div
              className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${category.color} opacity-10 rounded-full -mr-10 -mt-10`}
            ></div>
            <CardHeader className="pb-3 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{category.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{category.category_name}</h3>
                    <p className="text-sm text-slate-600">{category.children.length} danh mục con</p>
                  </div>
                </div>
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
                    <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm danh mục con
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 hover:bg-red-50/80 rounded-lg">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Sản phẩm:</span>
                  <Badge className={`bg-gradient-to-r ${category.color} text-white border-0 shadow-lg`}>
                    {category.product_count}
                  </Badge>
                </div>
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                  Tạo: {new Date(category.created_at).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
                <TableHead className="text-slate-600 font-semibold">Số sản phẩm</TableHead>
                <TableHead className="text-slate-600 font-semibold">Ngày tạo</TableHead>
                <TableHead className="text-right text-slate-600 font-semibold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flattenCategories().map((category) => (
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
                        <span className="text-lg">{category.icon}</span>
                        <span className={category.level === 0 ? "font-semibold text-slate-900" : "text-slate-600"}>
                          {category.category_name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        category.level === 0 && category.color
                          ? `bg-gradient-to-r ${category.color} text-white border-0 shadow-lg`
                          : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-0"
                      }`}
                    >
                      {category.product_count}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-600">
                      {new Date(category.created_at).toLocaleDateString("vi-VN")}
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
                        <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
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
                        <DropdownMenuItem className="text-red-600 hover:bg-red-50/80 rounded-lg">
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
    </div>
  )
}
