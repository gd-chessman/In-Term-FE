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
  Package,
  Eye,
  Tags,
  TrendingUp,
  ShoppingCart,
  Star,
} from "lucide-react"

// Mock data
const products = [
  {
    product_id: 1,
    product_name: "iPhone 15 Pro Max",
    product_code: "IP15PM001",
    price: 29990000,
    product_status: "active",
    category_name: "Điện thoại",
    created_at: "2024-01-15 10:30:00",
    tags: ["Apple", "Flagship", "5G"],
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    product_id: 2,
    product_name: "Samsung Galaxy S24 Ultra",
    product_code: "SGS24U001",
    price: 31990000,
    product_status: "active",
    category_name: "Điện thoại",
    created_at: "2024-01-14 15:20:00",
    tags: ["Samsung", "Android", "Camera"],
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    product_id: 3,
    product_name: "MacBook Pro M3",
    product_code: "MBP14M3001",
    price: 52990000,
    product_status: "inactive",
    category_name: "Laptop",
    created_at: "2024-01-13 09:45:00",
    tags: ["Apple", "M3", "Professional"],
    image: "/placeholder.svg?height=60&width=60",
  },
]

const categories = [
  { category_id: 1, category_name: "Điện thoại" },
  { category_id: 2, category_name: "Laptop" },
  { category_id: 3, category_name: "Tablet" },
  { category_id: 4, category_name: "Phụ kiện" },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
            Hoạt động
          </Badge>
        )
      case "inactive":
        return (
          <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-lg">
            Không hoạt động
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
            Quản lý Sản phẩm
          </h1>
          <p className="text-slate-600 mt-2">Quản lý danh sách sản phẩm và thông tin</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Thêm Sản phẩm
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-900">Thêm Sản phẩm mới</DialogTitle>
              <DialogDescription className="text-slate-600">Tạo sản phẩm mới trong hệ thống</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product_name" className="text-right font-medium text-slate-700">
                  Tên sản phẩm
                </Label>
                <Input
                  id="product_name"
                  className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product_code" className="text-right font-medium text-slate-700">
                  Mã sản phẩm
                </Label>
                <Input
                  id="product_code"
                  className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right font-medium text-slate-700">
                  Giá
                </Label>
                <Input
                  id="price"
                  type="number"
                  className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right font-medium text-slate-700">
                  Danh mục
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    {categories.map((category) => (
                      <SelectItem key={category.category_id} value={category.category_id.toString()}>
                        {category.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right font-medium text-slate-700">
                  Trạng thái
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl">
                Tạo Sản phẩm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Tổng sản phẩm</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{products.length}</div>
            <div className="flex items-center text-xs text-green-600 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2 từ tuần trước
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Đang hoạt động</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">
              {products.filter((p) => p.product_status === "active").length}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {Math.round((products.filter((p) => p.product_status === "active").length / products.length) * 100)}% tổng
              số
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Danh mục</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Tags className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{categories.length}</div>
            <p className="text-xs text-purple-600 mt-1">Tổng danh mục</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Giá trị TB</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-slate-900">
              {formatPrice(products.reduce((sum, p) => sum + p.price, 0) / products.length)}
            </div>
            <p className="text-xs text-orange-600 mt-1">Giá trung bình</p>
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
                placeholder="Tìm kiếm theo tên, mã sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px] rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all">Tất cả</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.category_id} value={category.category_id.toString()}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards View */}
      <div className="lg:hidden space-y-4">
        {products.map((product) => (
          <Card
            key={product.product_id}
            className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-md">
                    <Package className="h-6 w-6 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{product.product_name}</div>
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-700 font-mono">
                      {product.product_code}
                    </code>
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
                      <Eye className="mr-2 h-4 w-4" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                      <Tags className="mr-2 h-4 w-4" />
                      Quản lý Tags
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 hover:bg-red-50/80 rounded-lg">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Danh mục:</span>
                  <Badge variant="outline" className="border-slate-300 text-slate-700 rounded-lg">
                    {product.category_name}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Giá:</span>
                  <span className="font-semibold text-slate-900">{formatPrice(product.price)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 2).map((tag, index) => (
                      <Badge
                        key={index}
                        className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-0 text-xs rounded-lg"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {product.tags.length > 2 && (
                      <Badge className="bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-0 text-xs rounded-lg">
                        +{product.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Trạng thái:</span>
                  {getStatusBadge(product.product_status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Ngày tạo:</span>
                  <div className="text-sm text-slate-600">
                    {new Date(product.created_at).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products Table */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl lg:hidden">
        <CardHeader>
          <CardTitle className="text-slate-900">Danh sách Sản phẩm</CardTitle>
          <CardDescription>Tổng cộng {products.length} sản phẩm trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 hover:bg-slate-50/50">
                <TableHead className="text-slate-600 font-semibold">Sản phẩm</TableHead>
                <TableHead className="text-slate-600 font-semibold">Mã SP</TableHead>
                <TableHead className="text-slate-600 font-semibold">Danh mục</TableHead>
                <TableHead className="text-slate-600 font-semibold">Giá</TableHead>
                <TableHead className="text-slate-600 font-semibold">Tags</TableHead>
                <TableHead className="text-slate-600 font-semibold">Trạng thái</TableHead>
                <TableHead className="text-slate-600 font-semibold">Ngày tạo</TableHead>
                <TableHead className="text-right text-slate-600 font-semibold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.product_id} className="hover:bg-slate-50/80 transition-colors duration-200">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-md">
                        <Package className="h-6 w-6 text-slate-600" />
                      </div>
                      <div className="font-semibold text-slate-900">{product.product_name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-700 font-mono">
                      {product.product_code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-300 text-slate-700 rounded-lg">
                      {product.category_name}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 2).map((tag, index) => (
                        <Badge
                          key={index}
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-0 text-xs rounded-lg"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {product.tags.length > 2 && (
                        <Badge className="bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-0 text-xs rounded-lg">
                          +{product.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(product.product_status)}</TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-600">
                      {new Date(product.created_at).toLocaleDateString("vi-VN")}
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
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                          <Tags className="mr-2 h-4 w-4" />
                          Quản lý Tags
                        </DropdownMenuItem>
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

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
          <CardHeader>
            <CardTitle className="text-slate-900">Danh sách Sản phẩm</CardTitle>
            <CardDescription>Tổng cộng {products.length} sản phẩm trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-slate-50/50">
                  <TableHead className="text-slate-600 font-semibold">Sản phẩm</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Mã SP</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Danh mục</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Giá</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Tags</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Trạng thái</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Ngày tạo</TableHead>
                  <TableHead className="text-right text-slate-600 font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.product_id} className="hover:bg-slate-50/80 transition-colors duration-200">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-md">
                          <Package className="h-6 w-6 text-slate-600" />
                        </div>
                        <div className="font-semibold text-slate-900">{product.product_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-700 font-mono">
                        {product.product_code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-300 text-slate-700 rounded-lg">
                        {product.category_name}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map((tag, index) => (
                          <Badge
                            key={index}
                            className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-0 text-xs rounded-lg"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {product.tags.length > 2 && (
                          <Badge className="bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-0 text-xs rounded-lg">
                            +{product.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.product_status)}</TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-600">
                        {new Date(product.created_at).toLocaleDateString("vi-VN")}
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
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                            <Tags className="mr-2 h-4 w-4" />
                            Quản lý Tags
                          </DropdownMenuItem>
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
    </div>
  )
}
