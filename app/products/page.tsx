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
import { getProducts, createProduct, updateProduct, deleteProduct, updateStatus, deleteProductTags, addProductTags, getProductStatistics } from "@/services/ProductService"
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
  Filter,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { getCountries } from "@/services/CountryService"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<any>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [tagsDialogOpen, setTagsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedTagsToAdd, setSelectedTagsToAdd] = useState<number[]>([])
  const [selectedTagsToDelete, setSelectedTagsToDelete] = useState<number[]>([])
  
  // Advanced filters
  const [productName, setProductName] = useState("")
  const [productCode, setProductCode] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: productStatistics, isLoading: productStatsLoading } = useQuery({
    queryKey: ["product-statistics"],
    queryFn: getProductStatistics,
  })

  const { data: countries = [], isLoading, error, refetch } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
  })

  // Fetch products
  const {
    data: productsData = { products: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
    isLoading: isLoadingProducts,
    error: productsError,
    isFetching: isFetchingProducts,
  } = useQuery({
    queryKey: ["products", currentPage, pageSize, searchTerm, selectedCategory, selectedStatus, productName, productCode, productDescription, minPrice, maxPrice, selectedTags, sortBy, sortOrder],
    queryFn: () => getProducts({
      page: currentPage,
      limit: pageSize,
      search: searchTerm || undefined,
      category_id: selectedCategory !== "all" ? Number(selectedCategory) : undefined,
      product_status: selectedStatus !== "all" ? selectedStatus : undefined,
      product_name: productName || undefined,
      product_code: productCode || undefined,
      product_description: productDescription || undefined,
      min_price: minPrice ? Number(minPrice) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined,
      tag_ids: selectedTags.length > 0 ? selectedTags : undefined,
      sort_by: sortBy,
      sort_order: sortOrder
    }),
  })

  const products = productsData.products || []
  const pagination = productsData.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }

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

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, item }: { id: number; item: any }) => updateProduct(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được cập nhật thành công",
      })
      setIsEditDialogOpen(false)
      setEditingProduct(null)
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra khi cập nhật sản phẩm",
        variant: "destructive",
      })
    },
  })

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateStatus(id, { productStatus: status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast({
        title: "Thành công",
        description: "Trạng thái sản phẩm đã được cập nhật",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái sản phẩm",
        variant: "destructive",
      })
    },
  })

  // Delete product tags mutation
  const deleteProductTagsMutation = useMutation({
    mutationFn: ({ id, tagIds }: { id: number; tagIds: number[] }) => deleteProductTags(id, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast({
        title: "Thành công",
        description: "Tags đã được xóa khỏi sản phẩm",
      })
      setTagsDialogOpen(false)
      setSelectedProduct(null)
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra khi xóa tags",
        variant: "destructive",
      })
    },
  })

  // Add product tags mutation
  const addProductTagsMutation = useMutation({
    mutationFn: ({ id, tagIds }: { id: number; tagIds: number[] }) => addProductTags(id, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast({
        title: "Thành công",
        description: "Tags đã được thêm vào sản phẩm",
      })
      setSelectedTagsToAdd([])
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra khi thêm tags",
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

  // Use products directly from API (server-side filtering)
  const filteredProducts = products

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


  const getCountryFlag = (countryCode: string) => {
    if (!countryCode || typeof countryCode !== 'string') {
      return "🌍"
    }
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  const handleCreateProduct = (formData: FormData) => {
    const productData: any = {
      product_name: formData.get("product_name") as string,
      product_code: formData.get("product_code") as string,
      product_description: formData.get("product_description") as string,
      category_id: Number(formData.get("category_id")),
      price: Number(formData.get("price")),
      origin_country_id: Number(formData.get("origin_country_id")),
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

  const handleUpdateProduct = (formData: FormData) => {
    const productData: any = {}
    
    // Chỉ lấy các trường được phép cập nhật theo DTO
    const product_name = formData.get("product_name") as string
    const product_description = formData.get("product_description") as string
    const category_id = Number(formData.get("category_id"))
    const price = Number(formData.get("price"))
    const origin_country_id = Number(formData.get("origin_country_id"))
    
    // Chỉ thêm vào object nếu có giá trị
    if (product_name && product_name.trim()) {
      productData.product_name = product_name.trim()
    }
    if (product_description && product_description.trim()) {
      productData.product_description = product_description.trim()
    }
    if (category_id && category_id > 0) {
      productData.category_id = category_id
    }
    if (price && price >= 0) {
      productData.price = price
    }
    if (origin_country_id && origin_country_id > 0) {
      productData.origin_country_id = origin_country_id
    }
    
    // Handle image file
    const imageFile = formData.get("image") as File
    if (imageFile && imageFile.size > 0) {
      productData.image = imageFile
    }
    
    updateProductMutation.mutate({
      id: editingProduct.product_id,
      item: productData
    })
  }

  const handleDeleteProduct = (product: any) => {
    setProductToDelete(product)
    setDeleteConfirmation("")
    setDeleteDialogOpen(true)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setIsEditDialogOpen(true)
  }

  const handleUpdateStatus = (product: any, newStatus: string) => {
    updateStatusMutation.mutate({
      id: product.product_id,
      status: newStatus
    })
  }

  const handleManageTags = (product: any) => {
    setSelectedProduct(product)
    setSelectedTagsToAdd([])
    setSelectedTagsToDelete([])
    setTagsDialogOpen(true)
  }

  const handleDeleteTags = (tagIds: number[]) => {
    if (selectedProduct && tagIds.length > 0) {
      deleteProductTagsMutation.mutate({
        id: selectedProduct.product_id,
        tagIds: tagIds
      })
    }
  }

  const handleDeleteSelectedTags = () => {
    if (selectedProduct && selectedTagsToDelete.length > 0) {
      deleteProductTagsMutation.mutate({
        id: selectedProduct.product_id,
        tagIds: selectedTagsToDelete
      })
    }
  }

  const handleAddTags = () => {
    if (selectedProduct && selectedTagsToAdd.length > 0) {
      addProductTagsMutation.mutate({
        id: selectedProduct.product_id,
        tagIds: selectedTagsToAdd
      })
    }
  }

  const handleTagSelectionChange = (tagId: number, checked: boolean) => {
    if (checked) {
      setSelectedTagsToAdd(prev => [...prev, tagId])
    } else {
      setSelectedTagsToAdd(prev => prev.filter(id => id !== tagId))
    }
  }

  const handleDeleteTagSelectionChange = (tagId: number, checked: boolean) => {
    if (checked) {
      setSelectedTagsToDelete(prev => [...prev, tagId])
    } else {
      setSelectedTagsToDelete(prev => prev.filter(id => id !== tagId))
    }
  }

  const handleDeleteConfirm = () => {
    if (productToDelete && deleteConfirmation === productToDelete.product_code) {
      deleteProductMutation.mutate(productToDelete.product_id)
    } else {
      toast({
        title: "Lỗi",
        description: "Mã sản phẩm không khớp. Vui lòng nhập đúng mã sản phẩm để xác nhận xóa.",
        variant: "destructive",
      })
    }
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedStatus("all")
    setProductName("")
    setProductCode("")
    setProductDescription("")
    setMinPrice("")
    setMaxPrice("")
    setSelectedTags([])
    setSortBy("created_at")
    setSortOrder("desc")
    setCurrentPage(1)
  }

  const handleFilterTagSelectionChange = (tagId: number, checked: boolean) => {
    if (checked) {
      setSelectedTags(prev => [...prev, tagId])
    } else {
      setSelectedTags(prev => prev.filter(id => id !== tagId))
    }
  }

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || selectedStatus !== "all" || 
    productName || productCode || productDescription || minPrice || maxPrice || 
    selectedTags.length > 0 || sortBy !== "created_at" || sortOrder !== "desc"

  // Flatten categories for select options
  const flattenedCategories = categories.reduce((acc: any[], category: any) => {
    acc.push(category)
    if (category.children) {
      acc.push(...category.children)
    }
    return acc
  }, [])



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
                  <Label htmlFor="origin_country_id" className="text-right font-medium text-slate-700">
                    Xuất xứ *
                  </Label>
                  <Select name="origin_country_id" required>
                    <SelectTrigger className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                      <SelectValue placeholder="Chọn quốc gia xuất xứ" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      {isLoading ? (
                        <SelectItem value="" disabled>Đang tải...</SelectItem>
                      ) : (
                        countries.map((country: any) => (
                          <SelectItem key={country.country_id} value={country.country_id.toString()}>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{getCountryFlag(country.country_code)}</span>
                              <span>{country.country_name}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
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
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100 file:mr-4 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">Chỉnh sửa Sản phẩm</DialogTitle>
            <DialogDescription className="text-slate-600">Cập nhật thông tin sản phẩm</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            handleUpdateProduct(new FormData(e.currentTarget))
          }}>
            <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_product_name" className="text-right font-medium text-slate-700">
                    Tên sản phẩm
                  </Label>
                  <Input
                    id="edit_product_name"
                    name="product_name"
                    defaultValue={editingProduct?.product_name}
                    minLength={1}
                    maxLength={200}
                    placeholder="Nhập tên sản phẩm (1-200 ký tự)"
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_product_code" className="text-right font-medium text-slate-700">
                    Mã sản phẩm
                  </Label>
                  <Input
                    id="edit_product_code"
                    name="product_code"
                    defaultValue={editingProduct?.product_code}
                    disabled
                    minLength={1}
                    maxLength={100}
                    placeholder="Nhập mã sản phẩm (1-100 ký tự)"
                    className="col-span-3 rounded-xl border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit_product_description" className="text-right font-medium text-slate-700 pt-2">
                  Mô tả
                </Label>
                <Textarea
                  id="edit_product_description"
                  name="product_description"
                  defaultValue={editingProduct?.product_description}
                  placeholder="Nhập mô tả sản phẩm (tùy chọn)"
                  className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100 min-h-[80px]"
                />
              </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_category_id" className="text-right font-medium text-slate-700">
                    Danh mục
                  </Label>
                  <Select name="category_id" defaultValue={editingProduct?.category_id?.toString()}>
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
                  <Label htmlFor="edit_price" className="text-right font-medium text-slate-700">
                    Giá
                  </Label>
                  <Input
                    id="edit_price"
                    name="price"
                    type="number"
                    defaultValue={editingProduct?.price}
                    min={0}
                    step={1000}
                    placeholder="Nhập giá sản phẩm"
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_origin_country_id" className="text-right font-medium text-slate-700">
                    Xuất xứ
                  </Label>
                  <Select name="origin_country_id" defaultValue={editingProduct?.origin?.country_id?.toString()}>
                    <SelectTrigger className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                      <SelectValue placeholder="Chọn quốc gia xuất xứ" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      {isLoading ? (
                        <SelectItem value="" disabled>Đang tải...</SelectItem>
                      ) : (
                        countries.map((country: any) => (
                          <SelectItem key={country.country_id} value={country.country_id.toString()}>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{getCountryFlag(country.country_code)}</span>
                              <span>{country.country_name}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                              
                              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_image" className="text-right font-medium text-slate-700">
                    Ảnh sản phẩm
                  </Label>
                  <Input
                    id="edit_image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100 file:mr-4 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={updateProductMutation.isPending}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
              >
                {updateProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cập nhật Sản phẩm
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manage Tags Dialog */}
      <Dialog open={tagsDialogOpen} onOpenChange={setTagsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">Quản lý Tags</DialogTitle>
            <DialogDescription className="text-slate-600">
              Quản lý tags cho sản phẩm: <strong>{selectedProduct?.product_name}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Product Info */}
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Package className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-800">{selectedProduct?.product_name}</div>
                <div className="text-sm text-slate-600">Mã: <code className="bg-white px-1 rounded">{selectedProduct?.product_code}</code></div>
              </div>
            </div>

            {/* Current Tags */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Tags hiện tại ({selectedProduct?.productTags?.length || 0})
              </Label>
              {selectedProduct?.productTags && selectedProduct.productTags.length > 0 ? (
                <div className="space-y-2">
                  {selectedProduct.productTags.map((tagItem: any, index: number) => {
                    const tagId = tagItem.tag_id || tagItem.ptg_tag_id || tagItem
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`delete-tag-${tagId}`}
                            checked={selectedTagsToDelete.includes(tagId)}
                            onCheckedChange={(checked) => handleDeleteTagSelectionChange(tagId, checked as boolean)}
                            className="rounded border-slate-300"
                          />
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm font-medium text-blue-800">
                            {tagItem.tag?.tag_name || tagItem}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <Tags className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                  <p>Sản phẩm chưa có tags nào</p>
                </div>
              )}
              {selectedTagsToDelete.length > 0 && (
                <Button
                  onClick={handleDeleteSelectedTags}
                  disabled={deleteProductTagsMutation.isPending}
                  className="mt-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg"
                >
                  {deleteProductTagsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa {selectedTagsToDelete.length} tag(s)
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Add New Tags */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Thêm tags mới
              </Label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-slate-200 rounded-lg p-3">
                {isLoadingTags ? (
                  <div className="text-sm text-slate-500">Đang tải tags...</div>
                ) : tags.length > 0 ? (
                  tags
                    .filter((tag: any) => {
                      // Kiểm tra xem tag này đã có trong productTags chưa
                      return !selectedProduct?.productTags?.some((pt: any) => {
                        // Kiểm tra nhiều trường hợp có thể có của tag_id
                        const existingTagId = pt.tag_id || pt.ptg_tag_id || pt.tag?.tag_id
                        return existingTagId === tag.tag_id
                      })
                    })
                    .map((tag: any) => (
                      <div key={tag.tag_id} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-200">
                        <Checkbox
                          id={`add-tag-${tag.tag_id}`}
                          checked={selectedTagsToAdd.includes(tag.tag_id)}
                          onCheckedChange={(checked) => handleTagSelectionChange(tag.tag_id, checked as boolean)}
                          className="rounded border-slate-300"
                        />
                        <Label
                          htmlFor={`add-tag-${tag.tag_id}`}
                          className="text-sm font-medium text-green-800 cursor-pointer hover:text-green-600"
                        >
                          {tag.tag_name}
                        </Label>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <Tags className="h-6 w-6 mx-auto mb-1 text-slate-400" />
                    <p className="text-sm">Tất cả tags đã được gán cho sản phẩm này</p>
                  </div>
                )}
              </div>
              {selectedTagsToAdd.length > 0 && (
                <Button
                  onClick={handleAddTags}
                  disabled={addProductTagsMutation.isPending}
                  className="mt-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg"
                >
                  {addProductTagsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm {selectedTagsToAdd.length} tag(s)
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setTagsDialogOpen(false)}
              disabled={deleteProductTagsMutation.isPending}
              className="rounded-xl"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-slate-900">Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Bạn có chắc chắn muốn xóa sản phẩm <strong>{productToDelete?.product_name}</strong> ({productToDelete?.product_code})?
              <br />
              <span className="text-red-600 font-semibold">⚠️ Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn sản phẩm khỏi hệ thống.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {/* Cảnh báo */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-sm font-bold">⚠️</span>
              </div>
              <div className="text-sm text-red-800">
                <div className="font-semibold mb-1">Cảnh báo quan trọng:</div>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống</li>
                  <li>Tất cả dữ liệu liên quan đến sản phẩm sẽ bị mất</li>
                  <li>Không thể khôi phục sau khi xóa</li>
                  <li>Ảnh hưởng đến các báo cáo và thống kê</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-md">
              <Package className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">{productToDelete?.product_name}</div>
              <div className="text-sm text-slate-600">Mã: <code className="bg-white px-1 rounded text-slate-700">{productToDelete?.product_code}</code></div>
              <div className="text-sm text-slate-600">Giá: {productToDelete?.price ? productToDelete.price : "N/A"}</div>
            </div>
          </div>

          {/* Input xác nhận */}
          <div className="space-y-3">
            <Label htmlFor="delete-confirmation" className="text-sm font-medium text-slate-700">
              Để xác nhận xóa, vui lòng nhập mã sản phẩm: <code className="bg-red-100 px-1 rounded text-red-700 font-bold">{productToDelete?.product_code}</code>
            </Label>
            <Input
              id="delete-confirmation"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Nhập mã sản phẩm để xác nhận"
              className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel 
              className="rounded-xl"
              disabled={deleteProductMutation.isPending}
              onClick={() => setDeleteConfirmation("")}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteProductMutation.isPending || deleteConfirmation !== productToDelete?.product_code}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl disabled:bg-red-300 disabled:cursor-not-allowed"
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
            <div className="text-3xl font-bold text-slate-900">
              {productStatsLoading ? (
                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
              ) : (
                productStatistics?.totalProducts || 0
              )}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              {pagination.totalPages > 1 ? `Trang ${pagination.page}/${pagination.totalPages}` : 'Tất cả sản phẩm'}
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
              {productStatsLoading ? (
                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
              ) : (
                productStatistics?.activeProducts || 0
              )}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {productStatsLoading ? (
                <div className="h-3 w-12 bg-slate-200 rounded animate-pulse"></div>
              ) : (
                productStatistics?.totalProducts > 0 
                  ? Math.round((productStatistics.activeProducts / productStatistics.totalProducts) * 100) 
                  : 0
              )}% tổng số
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Không hoạt động</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Tags className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">
              {productStatsLoading ? (
                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
              ) : (
                productStatistics?.inactiveProducts || 0
              )}
            </div>
            <p className="text-xs text-purple-600 mt-1">
              {productStatsLoading ? (
                <div className="h-3 w-12 bg-slate-200 rounded animate-pulse"></div>
              ) : (
                productStatistics?.totalProducts > 0 
                  ? Math.round((productStatistics.inactiveProducts / productStatistics.totalProducts) * 100) 
                  : 0
              )}% tổng số
            </p>
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
              {productStatsLoading ? (
                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
              ) : (
                productStatistics?.averagePrice ? (productStatistics.averagePrice.toFixed(2)) : "0"
              )}
            </div>
            <p className="text-xs text-orange-600 mt-1">
              {productStatsLoading ? (
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse"></div>
              ) : (
                productStatistics?.minPrice && productStatistics?.maxPrice 
                  ? `${(productStatistics.minPrice)} - ${(productStatistics.maxPrice)}`
                  : "Giá trung bình"
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900">Tìm kiếm & Lọc</CardTitle>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="rounded-lg"
                >
                  <X className="mr-2 h-4 w-4" />
                  Xóa bộ lọc
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="rounded-lg"
              >
                <Filter className="mr-2 h-4 w-4" />
                Bộ lọc nâng cao
                {showAdvancedFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Basic Filters */}
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

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Tên sản phẩm</Label>
                  <Input
                    placeholder="Nhập tên sản phẩm..."
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Mã sản phẩm</Label>
                  <Input
                    placeholder="Nhập mã sản phẩm..."
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Mô tả</Label>
                  <Input
                    placeholder="Nhập từ khóa mô tả..."
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Giá tối thiểu</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Giá tối đa</Label>
                  <Input
                    type="number"
                    placeholder="999999999"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Sắp xếp theo</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      <SelectItem value="created_at">Ngày tạo</SelectItem>
                      <SelectItem value="product_name">Tên sản phẩm</SelectItem>
                      <SelectItem value="product_code">Mã sản phẩm</SelectItem>
                      <SelectItem value="price">Giá</SelectItem>
                      <SelectItem value="product_status">Trạng thái</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Thứ tự</Label>
                  <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                    <SelectTrigger className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      <SelectItem value="desc">Giảm dần</SelectItem>
                      <SelectItem value="asc">Tăng dần</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label className="text-sm font-medium text-slate-700">Tags</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto border border-slate-200 rounded-xl p-3">
                    {isLoadingTags ? (
                      <div className="text-sm text-slate-500">Đang tải tags...</div>
                    ) : tags.length > 0 ? (
                      tags.map((tag: any) => (
                        <div key={tag.tag_id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`filter-tag-${tag.tag_id}`}
                            checked={selectedTags.includes(tag.tag_id)}
                            onCheckedChange={(checked) => handleFilterTagSelectionChange(tag.tag_id, checked as boolean)}
                            className="rounded border-slate-300"
                          />
                          <Label
                            htmlFor={`filter-tag-${tag.tag_id}`}
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards View */}
      <div className="lg:hidden space-y-4">
        {(isFetchingProducts || isLoadingProducts) && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-green-600" />
              <span className="text-sm text-slate-600">
                {isLoadingProducts ? "Đang tải dữ liệu..." : "Đang cập nhật dữ liệu..."}
              </span>
            </div>
          </div>
        )}
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
                      src={product.product_image || ""} 
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
                    {/* <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                      <Eye className="mr-2 h-4 w-4" />
                      Xem chi tiết
                    </DropdownMenuItem> */}
                    <DropdownMenuItem 
                      className="hover:bg-slate-50/80 rounded-lg"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="hover:bg-slate-50/80 rounded-lg"
                      onClick={() => handleManageTags(product)}
                    >
                      <Tags className="mr-2 h-4 w-4" />
                      Quản lý Tags
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className={product.product_status === "active" ? "text-orange-600 hover:bg-orange-50/80 rounded-lg" : "text-green-600 hover:bg-green-50/80 rounded-lg"}
                      onClick={() => handleUpdateStatus(product, product.product_status === "active" ? "inactive" : "active")}
                      disabled={updateStatusMutation.isPending}
                    >
                      {product.product_status === "active" ? (
                        <>
                          <div className="mr-2 h-4 w-4 rounded-full bg-orange-500"></div>
                          Tạm ngưng
                        </>
                      ) : (
                        <>
                          <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                          Kích hoạt
                        </>
                      )}
                    </DropdownMenuItem>
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
                  <span className="text-sm text-slate-600">Xuất xứ:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCountryFlag(product.origin?.country_code)}</span>
                    <span className="text-sm font-medium text-slate-700">
                      {product.origin?.country_name || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Giá:</span>
                  <span className="font-semibold text-slate-900">{product.price}</span>
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
            <CardDescription>Tổng cộng {pagination.total} sản phẩm trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {(isFetchingProducts || isLoadingProducts) && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                  <span className="text-sm text-slate-600">
                    {isLoadingProducts ? "Đang tải dữ liệu..." : "Đang cập nhật dữ liệu..."}
                  </span>
                </div>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-slate-50/50">
                  <TableHead className="text-slate-600 font-semibold">Sản phẩm</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Mã SP</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Danh mục</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Xuất xứ</TableHead>
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
                        <div className="h-12 w-12 rounded-xl flex items-center justify-center overflow-hidden">
                          <img 
                            src={product.product_image || ""} 
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
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCountryFlag(product.origin?.country_code)}</span>
                        <span className="text-sm font-medium text-slate-700">
                          {product.origin?.country_name || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">{product.price}</TableCell>
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
                          {/* <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem> */}
                          <DropdownMenuItem 
                            className="hover:bg-slate-50/80 rounded-lg"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="hover:bg-slate-50/80 rounded-lg"
                            onClick={() => handleManageTags(product)}
                          >
                            <Tags className="mr-2 h-4 w-4" />
                            Quản lý Tags
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className={product.product_status === "active" ? "text-orange-600 hover:bg-orange-50/80 rounded-lg" : "text-green-600 hover:bg-green-50/80 rounded-lg"}
                            onClick={() => handleUpdateStatus(product, product.product_status === "active" ? "inactive" : "active")}
                            disabled={updateStatusMutation.isPending}
                          >
                            {product.product_status === "active" ? (
                              <>
                                <div className="mr-2 h-4 w-4 rounded-full bg-orange-500"></div>
                                Tạm ngưng
                              </>
                            ) : (
                              <>
                                <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                                Kích hoạt
                              </>
                            )}
                          </DropdownMenuItem>
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

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, pagination.total)} trong tổng số {pagination.total} sản phẩm
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg"
                >
                  Trước
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum = i + 1
                    if (pagination.totalPages > 5) {
                      if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="rounded-lg min-w-[40px]"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="rounded-lg"
                >
                  Sau
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

