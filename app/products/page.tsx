"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { getProducts, createProduct, deleteProduct } from "@/services/ProductService"
import { getCategoriesTree } from "@/services/CategoryService"
import { getTags } from "@/services/TagService"
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
  Loader2,
} from "lucide-react"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<any>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  // Fetch products
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })

  // Fetch categories for form and filter
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ["categories-tree"],
    queryFn: getCategoriesTree,
  })

  // Fetch tags for tag selection
  const {
    data: tags = [],
    isLoading: isLoadingTags,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  })

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setIsCreateDialogOpen(false)
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được tạo thành công",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra khi tạo sản phẩm",
        variant: "destructive",
      })
    },
  })

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được xóa thành công",
      })
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra khi xóa sản phẩm",
        variant: "destructive",
      })
    },
  })

  // Filter products based on search and filters
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.product_code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category_id?.toString() === selectedCategory
    const matchesStatus = selectedStatus === "all" || product.product_status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

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

  const handleCreateProduct = (formData: FormData) => {
    const productData: any = {
      product_name: formData.get("product_name") as string,
      product_code: formData.get("product_code") as string,
      product_description: formData.get("product_description") as string,
      category_id: Number(formData.get("category_id")),
      price: Number(formData.get("price")),
      product_status: formData.get("product_status") as string || "active",
      tagIds: formData.getAll("tagIds").map(id => Number(id)),
    }
    
    // Handle image file
    const imageFile = formData.get("image") as File
    if (imageFile && imageFile.size > 0) {
      productData.image = imageFile
    }
    
    createProductMutation.mutate(productData)
  }

  const handleDeleteProduct = (product: any) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete.product_id)
    }
  }

  // Flatten categories for select options
  const flattenedCategories = categories.reduce((acc: any[], category: any) => {
    acc.push(category)
    if (category.children) {
      acc.push(...category.children)
    }
    return acc
  }, [])

  if (isLoadingProducts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Đang tải danh sách sản phẩm...</span>
        </div>
      </div>
    )
  }

  if (productsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Có lỗi xảy ra khi tải danh sách sản phẩm</p>
          <Button onClick={() => queryClient.refetchQueries({ queryKey: ["products"] })}>
            Thử lại
          </Button>
        </div>
      </div>
    )
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
            <form onSubmit={(e) => {
              e.preventDefault()
              handleCreateProduct(new FormData(e.currentTarget))
            }}>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product_name" className="text-right font-medium text-slate-700">
                    Tên sản phẩm *
                  </Label>
                  <Input
                    id="product_name"
                    name="product_name"
                    required
                    minLength={1}
                    maxLength={200}
                    placeholder="Nhập tên sản phẩm (1-200 ký tự)"
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product_code" className="text-right font-medium text-slate-700">
                    Mã sản phẩm *
                  </Label>
                  <Input
                    id="product_code"
                    name="product_code"
                    required
                    minLength={1}
                    maxLength={100}
                    placeholder="Nhập mã sản phẩm (1-100 ký tự)"
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="product_description" className="text-right font-medium text-slate-700 pt-2">
                    Mô tả
                  </Label>
                  <Textarea
                    id="product_description"
                    name="product_description"
                    placeholder="Nhập mô tả sản phẩm (tùy chọn)"
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100 min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category_id" className="text-right font-medium text-slate-700">
                    Danh mục *
                  </Label>
                  <Select name="category_id" required>
                    <SelectTrigger className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      {isLoadingCategories ? (
                        <SelectItem value="" disabled>Đang tải...</SelectItem>
                      ) : (
                        flattenedCategories.map((category: any) => (
                          <SelectItem key={category.category_id} value={category.category_id.toString()}>
                            {category.category_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right font-medium text-slate-700">
                    Giá *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    required
                    min={0}
                    step={1000}
                    placeholder="Nhập giá sản phẩm"
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product_status" className="text-right font-medium text-slate-700">
                    Trạng thái
                  </Label>
                  <Select name="product_status" defaultValue="active">
                    <SelectTrigger className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right font-medium text-slate-700 pt-2">
                    Tags
                  </Label>
                  <div className="col-span-3 space-y-2 max-h-32 overflow-y-auto border border-slate-200 rounded-xl p-3">
                    {isLoadingTags ? (
                      <div className="text-sm text-slate-500">Đang tải tags...</div>
                    ) : tags.length > 0 ? (
                      tags.map((tag: any) => (
                        <div key={tag.tag_id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-${tag.tag_id}`}
                            name="tagIds"
                            value={tag.tag_id}
                            className="rounded border-slate-300"
                          />
                          <Label
                            htmlFor={`tag-${tag.tag_id}`}
                            className="text-sm font-normal cursor-pointer hover:text-green-600"
                          >
                            {tag.tag_name}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500">Không có tags nào</div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right font-medium text-slate-700">
                    Ảnh sản phẩm
                  </Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={createProductMutation.isPending}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
                >
                  {createProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Tạo Sản phẩm
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-slate-900">Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Bạn có chắc chắn muốn xóa sản phẩm <strong>{productToDelete?.product_name}</strong> ({productToDelete?.product_code})?
              <br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow-md">
              <Package className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="font-semibold text-red-800">{productToDelete?.product_name}</div>
              <div className="text-sm text-red-600">Mã: {productToDelete?.product_code}</div>
              <div className="text-sm text-red-600">Giá: {productToDelete?.price ? formatPrice(productToDelete.price) : "N/A"}</div>
            </div>
          </div>
          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel 
              className="rounded-xl"
              disabled={deleteProductMutation.isPending}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteProductMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              {deleteProductMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa Sản phẩm
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              {products.filter((p: any) => p.product_status === "active").length}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {products.length > 0 ? Math.round((products.filter((p: any) => p.product_status === "active").length / products.length) * 100) : 0}% tổng
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
            <div className="text-3xl font-bold text-slate-900">{flattenedCategories.length}</div>
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
              {products.length > 0 ? formatPrice(products.reduce((sum: number, p: any) => sum + p.price, 0) / products.length) : "0 ₫"}
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all">Tất cả</SelectItem>
                {flattenedCategories.map((category: any, index: number) => (
                  <SelectItem key={index} value={category.category_id.toString()}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
        {filteredProducts.map((product: any) => (
          <Card
            key={product.product_id}
            className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-md overflow-hidden">
                    <img 
                      src={apiUrl + product.product_image} 
                      alt={"product_image"}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                    <Package className="h-6 w-6 text-slate-600 hidden" />
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
                    <DropdownMenuItem 
                      className="text-red-600 hover:bg-red-50/80 rounded-lg"
                      onClick={() => handleDeleteProduct(product)}
                      disabled={deleteProductMutation.isPending}
                    >
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
                    {product.category?.category_name || "N/A"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Giá:</span>
                  <span className="font-semibold text-slate-900">{formatPrice(product.price)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {product.productTags?.slice(0, 2).map((tag: any, index: number) => (
                      <Badge
                        key={index}
                        className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-0 text-xs rounded-lg"
                      >
                        {tag.tag?.tag_name || tag}
                      </Badge>
                    ))}
                    {product.productTags && product.productTags.length > 2 && (
                      <Badge className="bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-0 text-xs rounded-lg">
                        +{product.productTags.length - 2}
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
      <div className="hidden lg:block">
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
          <CardHeader>
            <CardTitle className="text-slate-900">Danh sách Sản phẩm</CardTitle>
            <CardDescription>Tổng cộng {filteredProducts.length} sản phẩm trong hệ thống</CardDescription>
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
                {filteredProducts.map((product: any) => (
                  <TableRow key={product.product_id} className="hover:bg-slate-50/80 transition-colors duration-200">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-md overflow-hidden">
                          <img 
                            src={apiUrl + product.product_image} 
                            alt={product.product_name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.nextElementSibling?.classList.remove('hidden')
                            }}
                          />
                          <Package className="h-6 w-6 text-slate-600 hidden" />
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
                        {product.category?.category_name || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.productTags?.slice(0, 2).map((tag: any, index: number) => (
                          <Badge
                            key={index}
                            className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-0 text-xs rounded-lg"
                          >
                            {tag.tag?.tag_name || tag}
                          </Badge>
                        ))}
                        {product.productTags && product.productTags.length > 2 && (
                          <Badge className="bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-0 text-xs rounded-lg">
                            +{product.productTags.length - 2}
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
                          <DropdownMenuItem 
                            className="text-red-600 hover:bg-red-50/80 rounded-lg"
                            onClick={() => handleDeleteProduct(product)}
                            disabled={deleteProductMutation.isPending}
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
      </div>
    </div>
  )
}
