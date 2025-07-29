"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
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
import { getActiveBranches } from "@/services/BranchService"
import { useLang } from "@/lang/useLang"

export default function ProductsPage() {
  const { t } = useLang()
  const searchParams = useSearchParams()
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
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedProductDetail, setSelectedProductDetail] = useState<any>(null)
  
  // Advanced filters
  const [productName, setProductName] = useState("")
  const [productCode, setProductCode] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [selectedBranches, setSelectedBranches] = useState<number[]>([])
  const [selectedFilterBranches, setSelectedFilterBranches] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Đọc search parameter từ URL khi component mount
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

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
    queryKey: ["products", currentPage, pageSize, searchTerm, selectedCategory, selectedStatus, productName, productCode, productDescription, minPrice, maxPrice, selectedTags, selectedFilterBranches, sortBy, sortOrder],
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
      branch_ids: selectedFilterBranches.length > 0 ? selectedFilterBranches : undefined,
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

  // Fetch active branches for branch selection
  const {
    data: branches = [],
    isLoading: isLoadingBranches,
  } = useQuery({
    queryKey: ["active-branches"],
    queryFn: getActiveBranches,
  })

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setIsCreateDialogOpen(false)
      toast({
        title: t('products.toasts.createSuccess.title'),
        description: t('products.toasts.createSuccess.description'),
      })
    },
    onError: (error: any) => {
      toast({
        title: t('products.toasts.createError.title'),
        description: error.response?.data?.message || t('products.toasts.createError.description'),
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
        title: t('products.toasts.updateSuccess.title'),
        description: t('products.toasts.updateSuccess.description'),
      })
      setIsEditDialogOpen(false)
      setEditingProduct(null)
    },
    onError: (error: any) => {
      toast({
        title: t('products.toasts.updateError.title'),
        description: error.response?.data?.message || t('products.toasts.updateError.description'),
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
        title: t('products.toasts.statusUpdateSuccess.title'),
        description: t('products.toasts.statusUpdateSuccess.description'),
      })
    },
    onError: (error: any) => {
      toast({
        title: t('products.toasts.statusUpdateError.title'),
        description: error.response?.data?.message || t('products.toasts.statusUpdateError.description'),
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
        title: t('products.toasts.deleteTagsSuccess.title'),
        description: t('products.toasts.deleteTagsSuccess.description'),
      })
      setTagsDialogOpen(false)
      setSelectedProduct(null)
    },
    onError: (error: any) => {
      toast({
        title: t('products.toasts.deleteTagsError.title'),
        description: error.response?.data?.message || t('products.toasts.deleteTagsError.description'),
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
        title: t('products.toasts.addTagsSuccess.title'),
        description: t('products.toasts.addTagsSuccess.description'),
      })
      setSelectedTagsToAdd([])
    },
    onError: (error: any) => {
      toast({
        title: t('products.toasts.addTagsError.title'),
        description: error.response?.data?.message || t('products.toasts.addTagsError.description'),
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
        title: t('products.toasts.deleteSuccess.title'),
        description: t('products.toasts.deleteSuccess.description'),
      })
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    },
    onError: (error: any) => {
      toast({
        title: t('products.toasts.deleteError.title'),
        description: error.response?.data?.message || t('products.toasts.deleteError.description'),
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
            {t('products.status.active')}
          </Badge>
        )
      case "inactive":
        return (
          <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-lg">
            {t('products.status.inactive')}
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
      product_info: formData.get("product_info") as string,
      category_id: Number(formData.get("category_id")),
      price: Number(formData.get("price")),
      origin_country_id: Number(formData.get("origin_country_id")),
      unit_name: formData.get("unit_name") as string,
      unit_total: Number(formData.get("unit_total")),
      unit_step: Number(formData.get("unit_step")),
      product_status: "active", // Mặc định là Hoạt động
      tagIds: formData.getAll("tagIds").map(id => Number(id)),
      branchIds: formData.getAll("branchIds").map(id => Number(id)),
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
    const product_info = formData.get("product_info") as string
    const category_id = Number(formData.get("category_id"))
    const price = Number(formData.get("price"))
    const origin_country_id = Number(formData.get("origin_country_id"))
    const unit_name = formData.get("unit_name") as string
    const unit_total = Number(formData.get("unit_total"))
    const unit_step = Number(formData.get("unit_step"))
    const branchIds = formData.getAll("branchIds").map(id => Number(id))
    const tagIds = formData.getAll("tagIds").map(id => Number(id))
    
    // Chỉ thêm vào object nếu có giá trị
    if (product_name && product_name.trim()) {
      productData.product_name = product_name.trim()
    }
    if (product_description && product_description.trim()) {
      productData.product_description = product_description.trim()
    }
    if (product_info && product_info.trim()) {
      productData.product_info = product_info.trim()
    } else {
      productData.product_info = ""
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
    if (unit_name && unit_name.trim()) {
      productData.unit_name = unit_name.trim()
    }
    if (unit_total && unit_total > 0) {
      productData.unit_total = unit_total
    }
    if (unit_step && unit_step > 0) {
      productData.unit_step = unit_step
    }
    if (branchIds.length > 0) {
      productData.branchIds = branchIds
    }
    if (tagIds.length > 0) {
      productData.tagIds = tagIds
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

  const handleViewDetail = (product: any) => {
    setSelectedProductDetail(product)
    setDetailDialogOpen(true)
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
    setSelectedBranches([])
    setSelectedFilterBranches([])
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

  const handleBranchSelectionChange = (branchId: number, checked: boolean) => {
    if (checked) {
      setSelectedBranches(prev => [...prev, branchId])
    } else {
      setSelectedBranches(prev => prev.filter(id => id !== branchId))
    }
  }

  const handleFilterBranchSelectionChange = (branchId: number, checked: boolean) => {
    if (checked) {
      setSelectedFilterBranches(prev => [...prev, branchId])
    } else {
      setSelectedFilterBranches(prev => prev.filter(id => id !== branchId))
    }
  }

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || selectedStatus !== "all" || 
    productName || productCode || productDescription || minPrice || maxPrice || 
    selectedTags.length > 0 || selectedFilterBranches.length > 0 || sortBy !== "created_at" || sortOrder !== "desc"

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
            {t('products.title')}
          </h1>
          <p className="text-slate-600 mt-2">{t('products.subtitle')}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              {t('products.create.button')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] lg:max-w-[1124px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-900">{t('products.create.title')}</DialogTitle>
              <DialogDescription className="text-slate-600">{t('products.create.subtitle')}</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              handleCreateProduct(new FormData(e.currentTarget))
            }}>
              <div className="grid gap-6 py-4">
                {/* Layout 2 cột cho desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Cột trái */}
                  <div className="space-y-6">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product_name" className="text-right font-medium text-slate-700">
                    {t('products.create.fields.name')} *
                  </Label>
                  <Input
                    id="product_name"
                    name="product_name"
                    required
                    minLength={1}
                    maxLength={200}
                    placeholder={t('products.create.placeholders.name')}
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product_code" className="text-right font-medium text-slate-700">
                    {t('products.create.fields.code')} *
                  </Label>
                  <Input
                    id="product_code"
                    name="product_code"
                    required
                    minLength={1}
                    maxLength={100}
                    placeholder={t('products.create.placeholders.code')}
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="product_description" className="text-right font-medium text-slate-700 pt-2">
                  {t('products.create.fields.description')}
                  </Label>
                  <Textarea
                    id="product_description"
                    name="product_description"
                  placeholder={t('products.create.placeholders.description')}
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100 min-h-[80px]"
                  />
                </div>

              
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right font-medium text-slate-700 pt-2">
                    {t('products.create.fields.tags')}
                  </Label>
                  <div className="col-span-3 space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 flex flex-wrap gap-2">
                    {isLoadingTags ? (
                      <div className="text-sm text-slate-500">{t('products.create.loading.tags')}</div>
                    ) : tags.length > 0 ? (
                      tags.map((tag: any) => (
                        <div key={tag.tag_id} className="flex items-center space-x-2 !my-0">
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
                      <div className="text-sm text-slate-500">{t('products.create.noTags')}</div>
                    )}
                </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right font-medium text-slate-700 pt-2">
                    {t('products.create.fields.branches')}
                  </Label>
                  <div className="col-span-3 space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 flex flex-wrap gap-2">
                    {isLoadingBranches ? (
                      <div className="text-sm text-slate-500">{t('products.create.loading.branches')}</div>
                    ) : branches.length > 0 ? (
                      branches.map((branch: any) => (
                        <div key={branch.branch_id} className="flex items-center space-x-2 !my-0">
                          <Checkbox
                            id={`branch-${branch.branch_id}`}
                            name="branchIds"
                            value={branch.branch_id}
                            className="rounded border-slate-300"
                          />
                          <Label
                            htmlFor={`branch-${branch.branch_id}`}
                            className="text-sm font-normal cursor-pointer hover:text-green-600"
                          >
                            {branch.branch_name}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500">{t('products.create.noBranches')}</div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="origin_country_id" className="text-right font-medium text-slate-700">
                    {t('products.create.fields.origin')} *
                  </Label>
                  <Select name="origin_country_id" required>
                    <SelectTrigger className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                      <SelectValue placeholder={t('products.create.placeholders.origin')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      {isLoading ? (
                        <SelectItem value="" disabled>{t('products.create.loading.countries')}</SelectItem>
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


                  </div>
                  
                  {/* Cột phải */}
                  <div className="space-y-6">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category_id" className="text-right font-medium text-slate-700">
                    {t('products.create.fields.category')} *
                  </Label>
                  <Select name="category_id" required>
                    <SelectTrigger className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                      <SelectValue placeholder={t('products.create.placeholders.category')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      {isLoadingCategories ? (
                        <SelectItem value="" disabled>{t('products.create.loading.categories')}</SelectItem>
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
                    {t('products.create.fields.price')} *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    min={0}
                    placeholder={t('products.create.placeholders.price')}
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit_name" className="text-right font-medium text-slate-700">
                    {t('products.create.fields.unitName')} *
                          </Label>
                  <Input
                    id="unit_name"
                    name="unit_name"
                    required
                    placeholder={t('products.create.placeholders.unitName')}
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit_total" className="text-right font-medium text-slate-700">
                    {t('products.create.fields.unitTotal')} *
                  </Label>
                  <Input
                    id="unit_total"
                    name="unit_total"
                    type="number"
                    step="0.01"
                    required
                    min={0}
                    placeholder={t('products.create.placeholders.unitTotal')}
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                  </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit_step" className="text-right font-medium text-slate-700">
                    {t('products.create.fields.unitStep')} *
                  </Label>
                  <Input
                    id="unit_step"
                    name="unit_step"
                    type="number"
                    step="0.01"
                    required
                    min={0}
                    placeholder={t('products.create.placeholders.unitStep')}
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="product_info" className="text-right font-medium text-slate-700 pt-2">
                    {t('products.create.fields.productInfo')} *
                  </Label>
                  <Textarea
                    id="product_info"
                    name="product_info"
                    required
                    placeholder={t('products.create.placeholders.productInfo')}
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100 min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right font-medium text-slate-700">
                    {t('products.create.fields.image')}
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
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={createProductMutation.isPending}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
                >
                  {createProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('products.create.buttons.create')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[900px] lg:max-w-[1124px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">{t('products.edit.title')}</DialogTitle>
            <DialogDescription className="text-slate-600">{t('products.edit.subtitle')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            handleUpdateProduct(new FormData(e.currentTarget))
          }}>
            <div className="grid gap-6 py-4">
              {/* Layout 2 cột cho desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Cột trái */}
                <div className="space-y-6">
                  <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_product_name" className="text-right font-medium text-slate-700">
                    {t('products.edit.fields.name')}
                  </Label>
                  <Input
                    id="edit_product_name"
                    name="product_name"
                    defaultValue={editingProduct?.product_name}
                    minLength={1}
                    maxLength={200}
                    placeholder={t('products.edit.placeholders.name')}
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_product_code" className="text-right font-medium text-slate-700">
                    {t('products.edit.fields.code')}
                  </Label>
                  <Input
                    id="edit_product_code"
                    name="product_code"
                    defaultValue={editingProduct?.product_code}
                    disabled
                    minLength={1}
                    maxLength={100}
                    placeholder={t('products.edit.placeholders.code')}
                    className="col-span-3 rounded-xl border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit_product_description" className="text-right font-medium text-slate-700 pt-2">
                  {t('products.edit.fields.description')}
                </Label>
                <Textarea
                  id="edit_product_description"
                  name="product_description"
                  defaultValue={editingProduct?.product_description}
                  placeholder={t('products.edit.placeholders.description')}
                  className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100 min-h-[80px]"
                />
              </div>


                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right font-medium text-slate-700 pt-2">
                    {t('products.edit.fields.tags')}
                  </Label>
                  <div className="col-span-3 space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 flex flex-wrap gap-2">
                    {isLoadingTags ? (
                      <div className="text-sm text-slate-500">{t('products.edit.loading.tags')}</div>
                    ) : tags.length > 0 ? (
                      tags.map((tag: any) => (
                        <div key={tag.tag_id} className="flex items-center space-x-2 !my-0">
                          <Checkbox
                            id={`edit-tag-${tag.tag_id}`}
                            name="tagIds"
                            value={tag.tag_id}
                            defaultChecked={editingProduct?.productTags?.some((pt: any) => 
                              (pt.tag_id || pt.ptg_tag_id) === tag.tag_id
                            )}
                            className="rounded border-slate-300"
                          />
                          <Label
                            htmlFor={`edit-tag-${tag.tag_id}`}
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
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right font-medium text-slate-700 pt-2">
                    {t('products.edit.fields.branches')}
                  </Label>
                  <div className="col-span-3 space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 flex flex-wrap gap-2">
                    {isLoadingBranches ? (
                      <div className="text-sm text-slate-500">{t('products.edit.loading.branches')}</div>
                    ) : branches.length > 0 ? (
                      branches.map((branch: any) => (
                        <div key={branch.branch_id} className="flex items-center space-x-2 !my-0">
                          <Checkbox
                            id={`edit-branch-${branch.branch_id}`}
                            name="branchIds"
                            value={branch.branch_id}
                            defaultChecked={editingProduct?.productBranches?.some((pb: any) => 
                              (pb.branch_id || pb.pbg_branch_id) === branch.branch_id
                            )}
                            className="rounded border-slate-300"
                          />
                          <Label
                            htmlFor={`edit-branch-${branch.branch_id}`}
                            className="text-sm font-normal cursor-pointer hover:text-green-600"
                          >
                            {branch.branch_name}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500">Không có chi nhánh nào</div>
                    )}
                  </div>
              </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_origin_country_id" className="text-right font-medium text-slate-700">
                    {t('products.edit.fields.origin')}
                  </Label>
                  <Select name="origin_country_id" defaultValue={editingProduct?.origin?.country_id?.toString()}>
                    <SelectTrigger className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                      <SelectValue placeholder={t('products.edit.placeholders.origin')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      {isLoading ? (
                        <SelectItem value="" disabled>{t('products.edit.loading.loading')}</SelectItem>
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
                  </div>
                  
                  {/* Cột phải */}
                  <div className="space-y-6">
                  <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_category_id" className="text-right font-medium text-slate-700">
                    {t('products.edit.fields.category')}
                  </Label>
                  <Select name="category_id" defaultValue={editingProduct?.category_id?.toString()}>
                    <SelectTrigger className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                      <SelectValue placeholder={t('products.edit.placeholders.category')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      {isLoadingCategories ? (
                        <SelectItem value="" disabled>{t('products.edit.loading.loading')}</SelectItem>
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
                    {t('products.edit.fields.price')}
                  </Label>
                  <Input
                    id="edit_price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct?.price}
                    min={0}
                    placeholder={t('products.edit.placeholders.price')}
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_unit_name" className="text-right font-medium text-slate-700">
                    {t('products.edit.fields.unitName')}
                  </Label>
                  <Input
                    id="edit_unit_name"
                    name="unit_name"
                    defaultValue={editingProduct?.unit_name}
                    placeholder={t('products.edit.placeholders.unitName')}
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                            </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_unit_total" className="text-right font-medium text-slate-700">
                    {t('products.edit.fields.unitTotal')}
                  </Label>
                  <Input
                    id="edit_unit_total"
                    name="unit_total"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct?.unit_total}
                    min={0}
                    placeholder={t('products.edit.placeholders.unitTotal')}
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_unit_step" className="text-right font-medium text-slate-700">
                    {t('products.edit.fields.unitStep')}
                  </Label>
                  <Input
                    id="edit_unit_step"
                    name="unit_step"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct?.unit_step}
                    min={0}
                    placeholder={t('products.edit.placeholders.unitStep')}
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit_product_info" className="text-right font-medium text-slate-700 pt-2">
                    {t('products.edit.fields.productInfo')} *
                  </Label>
                  <Textarea
                    id="edit_product_info"
                    name="product_info"
                    required
                    defaultValue={editingProduct?.product_info}
                    placeholder={t('products.edit.placeholders.productInfo')}
                    className="col-span-3 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100 min-h-[80px]"
                  />
                </div>

                              
                              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit_image" className="text-right font-medium text-slate-700">
                    {t('products.edit.fields.image')}
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
                </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={updateProductMutation.isPending}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
              >
                {updateProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('products.edit.buttons.update')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manage Tags Dialog */}
      <Dialog open={tagsDialogOpen} onOpenChange={setTagsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">{t('products.tags.title')}</DialogTitle>
            <DialogDescription className="text-slate-600">
              {t('products.tags.description')}: <strong>{selectedProduct?.product_name}</strong>
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
                <div className="text-sm text-slate-600">{t('products.table.headers.code')}: <code className="bg-white px-1 rounded">{selectedProduct?.product_code}</code></div>
              </div>
            </div>

            {/* Current Tags */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                {t('products.tags.currentTags')} ({selectedProduct?.productTags?.length || 0})
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
                  <p>{t('products.tags.noTags')}</p>
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
                {t('products.tags.addTags')}
              </Label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-slate-200 rounded-lg p-3">
                {isLoadingTags ? (
                  <div className="text-sm text-slate-500">{t('products.search.loading.tags')}</div>
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
                    <p className="text-sm">{t('products.tags.noAvailableTags')}</p>
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
                      {t('products.tags.loading.adding')}
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      {t('products.tags.buttons.add')} {selectedTagsToAdd.length} tag(s)
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
              {t('products.tags.buttons.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">{t('products.detail.title')}</DialogTitle>
            <DialogDescription className="text-slate-600">
              {t('products.detail.description')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProductDetail && (
            <div className="space-y-6 py-4">
              {/* Product Header */}
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-green-50 rounded-xl border border-slate-200">
                <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-md overflow-hidden">
                  <img 
                    src={selectedProductDetail.product_image || ""} 
                    alt={selectedProductDetail.product_name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <Package className="h-8 w-8 text-slate-600 hidden" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{selectedProductDetail.product_name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <code className="text-sm bg-slate-100 px-2 py-1 rounded-lg text-slate-700 font-mono">
                      {selectedProductDetail.product_code}
                    </code>
                    {getStatusBadge(selectedProductDetail.product_status)}
                  </div>
                  <p className="text-slate-600 text-sm">
                    {selectedProductDetail.product_description || t('products.detail.noDescription')}
                  </p>
                </div>
              </div>

              {/* Product Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                    {t('products.detail.basicInfo')}
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">{t('products.detail.category')}:</span>
                      <Badge variant="outline" className="border-slate-300 text-slate-700 rounded-lg">
                        {selectedProductDetail.category?.category_name || t('products.na')}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">{t('products.detail.origin')}:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCountryFlag(selectedProductDetail.origin?.country_code)}</span>
                        <span className="text-sm font-medium text-slate-700">
                          {selectedProductDetail.origin?.country_name || t('products.na')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">{t('products.detail.price')}:</span>
                      <span className="font-semibold text-lg text-slate-900">
                        {selectedProductDetail.price}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">{t('products.detail.unitName')}:</span>
                      <span className="text-sm font-medium text-slate-700">
                        {selectedProductDetail.unit_name || t('products.na')}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">{t('products.detail.unitTotal')}:</span>
                      <span className="text-sm font-medium text-slate-700">
                        {selectedProductDetail.unit_total || t('products.na')}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">{t('products.detail.unitStep')}</span>
                      <span className="text-sm font-medium text-slate-700">
                        {selectedProductDetail.unit_step || t('products.na')}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">{t('products.detail.createdAt')}</span>
                      <span className="text-sm text-slate-600">
                        {new Date(selectedProductDetail.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags and Branches */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                    {t('products.detail.classification')}
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Tags */}
                    <div>
                      <span className="text-sm font-medium text-slate-600 block mb-2">{t('products.detail.tags')}</span>
                      {selectedProductDetail.productTags && selectedProductDetail.productTags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedProductDetail.productTags.map((tag: any, index: number) => (
                            <Badge
                              key={index}
                              className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-0 text-xs rounded-lg"
                            >
                              {tag.tag?.tag_name || tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">{t('products.detail.noTags')}</span>
                      )}
                    </div>

                    {/* Branches */}
                    <div>
                      <span className="text-sm font-medium text-slate-600 block mb-2">{t('products.detail.branches')}</span>
                      {selectedProductDetail.productBranches && selectedProductDetail.productBranches.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedProductDetail.productBranches.map((branchItem: any, index: number) => (
                            <Badge
                              key={index}
                              className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-0 text-xs rounded-lg"
                            >
                              {branchItem.branch?.branch_name || branchItem}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">{t('products.detail.notAssigned')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {selectedProductDetail.product_info && (
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                    {t('products.detail.productInfo')}
                  </h4>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-700 leading-relaxed">
                      {selectedProductDetail.product_info}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setDetailDialogOpen(false)}
              className="rounded-xl"
            >
              {t('products.detail.close')}
            </Button>
            <Button 
              onClick={() => {
                setDetailDialogOpen(false)
                handleEditProduct(selectedProductDetail)
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
            >
              <Edit className="mr-2 h-4 w-4" />
              {t('products.table.edit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-slate-900">{t('products.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              {t('products.delete.description')}
              <br />
              <span className="text-red-600 font-semibold">⚠️ {t('products.delete.warning.permanent')}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {/* Cảnh báo */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-sm font-bold">⚠️</span>
              </div>
              <div className="text-sm text-red-800">
                <div className="font-semibold mb-1">{t('products.delete.warning.title')}</div>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>{t('products.delete.warning.permanent')}</li>
                  <li>{t('products.delete.warning.dataLoss')}</li>
                  <li>{t('products.delete.warning.noRecovery')}</li>
                  <li>{t('products.delete.warning.affectReports')}</li>
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
              <div className="text-sm text-slate-600">{t('products.table.headers.code')}: <code className="bg-white px-1 rounded text-slate-700">{productToDelete?.product_code}</code></div>
              <div className="text-sm text-slate-600">{t('products.table.headers.price')}: {productToDelete?.price ? productToDelete.price : "N/A"}</div>
            </div>
          </div>

          {/* Input xác nhận */}
          <div className="space-y-3">
            <Label htmlFor="delete-confirmation" className="text-sm font-medium text-slate-700">
              {t('products.delete.confirmationLabel')}: <code className="bg-red-100 px-1 rounded text-red-700 font-bold">{productToDelete?.product_code}</code>
            </Label>
            <Input
              id="delete-confirmation"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder={t('products.delete.confirmationPlaceholder')}
              className="rounded-xl border-slate-200 focus:border-red-300 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel 
              className="rounded-xl"
              disabled={deleteProductMutation.isPending}
              onClick={() => setDeleteConfirmation("")}
            >
              {t('products.delete.buttons.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteProductMutation.isPending || deleteConfirmation !== productToDelete?.product_code}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              {deleteProductMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('products.delete.loading.deleting')}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('products.delete.buttons.delete')}
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
            <CardTitle className="text-sm font-medium text-slate-700">{t('products.stats.totalProducts')}</CardTitle>
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
              {pagination.totalPages > 1 ? `${t('products.stats.page')} ${pagination.page}/${pagination.totalPages}` : t('products.stats.allProducts')}
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">{t('products.stats.activeProducts')}</CardTitle>
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
              )}% {t('products.stats.ofTotal')}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">{t('products.stats.inactiveProducts')}</CardTitle>
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
              )}% {t('products.stats.ofTotal')}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">{t('products.stats.avgValue')}</CardTitle>
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
            <CardTitle className="text-slate-900">{t('products.search.title')}</CardTitle>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="rounded-lg"
                >
                  <X className="mr-2 h-4 w-4" />
                  {t('products.search.clearFilters')}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="rounded-lg"
              >
                <Filter className="mr-2 h-4 w-4" />
                {t('products.search.advancedFilters')}
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
                  placeholder={t('products.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                  <SelectValue placeholder={t('products.search.filters.category')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                  <SelectItem value="all">{t('products.search.allCategories')}</SelectItem>
                  {flattenedCategories.map((category: any, index: number) => (
                    <SelectItem key={index} value={category.category_id.toString()}>
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px] rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                  <SelectValue placeholder={t('products.search.filters.status')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                  <SelectItem value="all">{t('products.search.allStatuses')}</SelectItem>
                  <SelectItem value="active">{t('products.status.active')}</SelectItem>
                  <SelectItem value="inactive">{t('products.status.inactive')}</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={selectedFilterBranches.length > 0 ? selectedFilterBranches.join(',') : "all"} 
                onValueChange={(value) => {
                  if (value === "all") {
                    setSelectedFilterBranches([])
                  } else {
                    setSelectedFilterBranches(value.split(',').map(id => Number(id)))
                  }
                }}
              >
                <SelectTrigger className="w-[180px] rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                  <SelectValue placeholder={t('products.search.filters.branches')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                  <SelectItem value="all">{t('products.search.allBranches')}</SelectItem>
                  {branches.map((branch: any) => (
                    <SelectItem key={branch.branch_id} value={branch.branch_id.toString()}>
                      {branch.branch_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">{t('products.search.filters.productName')}</Label>
                  <Input
                    placeholder={t('products.search.filters.productNamePlaceholder')}
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">{t('products.search.filters.productCode')}</Label>
                  <Input
                    placeholder={t('products.search.filters.productCodePlaceholder')}
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">{t('products.search.filters.description')}</Label>
                  <Input
                    placeholder={t('products.search.filters.descriptionPlaceholder')}
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">{t('products.search.filters.minPrice')}</Label>
                  <Input
                    type="number"
                    placeholder={t('products.search.filters.minPricePlaceholder')}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">{t('products.search.filters.maxPrice')}</Label>
                  <Input
                    type="number"
                    placeholder={t('products.search.filters.maxPricePlaceholder')}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">{t('products.search.filters.sortBy')}</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      <SelectItem value="created_at">{t('products.search.sortOptions.createdAt')}</SelectItem>
                      <SelectItem value="product_name">{t('products.search.sortOptions.productName')}</SelectItem>
                      <SelectItem value="product_code">{t('products.search.sortOptions.productCode')}</SelectItem>
                      <SelectItem value="price">{t('products.search.sortOptions.price')}</SelectItem>
                      <SelectItem value="product_status">{t('products.search.sortOptions.status')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">{t('products.search.filters.sortOrder')}</Label>
                  <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                    <SelectTrigger className="rounded-xl border-slate-200 focus:border-green-300 focus:ring-2 focus:ring-green-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      <SelectItem value="desc">{t('products.search.sortOrder.desc')}</SelectItem>
                      <SelectItem value="asc">{t('products.search.sortOrder.asc')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label className="text-sm font-medium text-slate-700">{t('products.search.filters.tags')}</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto border border-slate-200 rounded-xl p-3">
                    {isLoadingTags ? (
                      <div className="text-sm text-slate-500">{t('products.search.loading.tags')}</div>
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
                      <div className="text-sm text-slate-500">{t('products.search.noTags')}</div>
                    )}
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label className="text-sm font-medium text-slate-700">{t('products.search.filters.branches')}</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto border border-slate-200 rounded-xl p-3">
                    {isLoadingBranches ? (
                      <div className="text-sm text-slate-500">{t('products.search.loading.branches')}</div>
                    ) : branches.length > 0 ? (
                      branches.map((branch: any) => (
                        <div key={branch.branch_id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`filter-branch-${branch.branch_id}`}
                            checked={selectedFilterBranches.includes(branch.branch_id)}
                            onCheckedChange={(checked) => handleFilterBranchSelectionChange(branch.branch_id, checked as boolean)}
                            className="rounded border-slate-300"
                          />
                          <Label
                            htmlFor={`filter-branch-${branch.branch_id}`}
                            className="text-sm font-normal cursor-pointer hover:text-green-600"
                          >
                            {branch.branch_name}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500">{t('products.search.noBranches')}</div>
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
                {isLoadingProducts ? t('products.table.loading.loading') : t('products.table.loading.updating')}
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
                      <span className="sr-only">{t('products.table.openMenu')}</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-xl rounded-xl"
                  >
                    <DropdownMenuLabel>{t('products.table.actions')}</DropdownMenuLabel>
                    <DropdownMenuItem 
                      className="hover:bg-slate-50/80 rounded-lg"
                      onClick={() => handleViewDetail(product)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      {t('products.table.viewDetail')}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="hover:bg-slate-50/80 rounded-lg"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {t('products.table.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="hover:bg-slate-50/80 rounded-lg"
                      onClick={() => handleManageTags(product)}
                    >
                      <Tags className="mr-2 h-4 w-4" />
                      {t('products.table.manageTags')}
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
                          {t('products.table.deactivate')}
                        </>
                      ) : (
                        <>
                          <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                          {t('products.table.activate')}
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600 hover:bg-red-50/80 rounded-lg"
                      onClick={() => handleDeleteProduct(product)}
                      disabled={deleteProductMutation.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('products.table.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{t('products.cards.category')}:</span>
                  <Badge variant="outline" className="border-slate-300 text-slate-700 rounded-lg">
                    {product.category?.category_name || "N/A"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{t('products.cards.origin')}:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCountryFlag(product.origin?.country_code)}</span>
                    <span className="text-sm font-medium text-slate-700">
                      {product.origin?.country_name || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{t('products.cards.price')}:</span>
                  <span className="font-semibold text-slate-900">{product.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{t('products.cards.unit')}:</span>
                  <span className="text-sm text-slate-700">
                    {product.unit_total && product.unit_name ? (
                      <span>{product.unit_total} {product.unit_name}</span>
                    ) : (
                      <span className="text-slate-500">N/A</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{t('products.cards.branches')}:</span>
                  <div className="flex flex-wrap gap-1">
                    {product.productBranches?.slice(0, 2).map((branchItem: any, index: number) => (
                      <Badge
                        key={index}
                        className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-0 text-xs rounded-lg"
                      >
                        {branchItem.branch?.branch_name || branchItem}
                      </Badge>
                    ))}
                    {product.productBranches && product.productBranches.length > 2 && (
                      <Badge className="bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-0 text-xs rounded-lg">
                        +{product.productBranches.length - 2}
                      </Badge>
                    )}
                    {(!product.productBranches || product.productBranches.length === 0) && (
                      <span className="text-xs text-slate-500">{t('products.cards.notAssigned')}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{t('products.cards.tags')}:</span>
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
                  <span className="text-sm text-slate-600">{t('products.cards.status')}:</span>
                  {getStatusBadge(product.product_status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{t('products.cards.created')}:</span>
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
            <CardTitle className="text-slate-900">{t('products.table.title')}</CardTitle>
            <CardDescription>{t('products.table.description', { count: pagination.total })}</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {(isFetchingProducts || isLoadingProducts) && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                  <span className="text-sm text-slate-600">
                    {isLoadingProducts ? t('products.table.loading.loading') : t('products.table.loading.updating')}
                  </span>
                </div>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-slate-50/50">
                  <TableHead className="text-slate-600 font-semibold">{t('products.table.headers.product')}</TableHead>
                  <TableHead className="text-slate-600 font-semibold">{t('products.table.headers.code')}</TableHead>
                  <TableHead className="text-slate-600 font-semibold">{t('products.table.headers.category')}</TableHead>
                  <TableHead className="text-slate-600 font-semibold">{t('products.table.headers.origin')}</TableHead>
                  <TableHead className="text-slate-600 font-semibold">{t('products.table.headers.price')}</TableHead>
                  <TableHead className="text-slate-600 font-semibold">{t('products.table.headers.unit')}</TableHead>
                  <TableHead className="text-slate-600 font-semibold">{t('products.table.headers.branches')}</TableHead>
                  <TableHead className="text-slate-600 font-semibold">{t('products.table.headers.tags')}</TableHead>
                  <TableHead className="text-slate-600 font-semibold">{t('products.table.headers.status')}</TableHead>
                  <TableHead className="text-slate-600 font-semibold">{t('products.table.headers.createdAt')}</TableHead>
                  <TableHead className="text-right text-slate-600 font-semibold">{t('products.table.headers.actions')}</TableHead>
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
                      <div className="text-sm text-slate-700">
                        {product.unit_total && product.unit_name ? (
                          <span>{product.unit_total} {product.unit_name}</span>
                        ) : (
                          <span className="text-slate-500">N/A</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.productBranches?.slice(0, 2).map((branchItem: any, index: number) => (
                          <Badge
                            key={index}
                            className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-0 text-xs rounded-lg"
                          >
                            {branchItem.branch?.branch_name || branchItem}
                          </Badge>
                        ))}
                        {product.productBranches && product.productBranches.length > 2 && (
                          <Badge className="bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-0 text-xs rounded-lg">
                            +{product.productBranches.length - 2}
                          </Badge>
                        )}
                        {(!product.productBranches || product.productBranches.length === 0) && (
                          <span className="text-xs text-slate-500">{t('products.detail.notAssigned')}</span>
                        )}
                      </div>
                    </TableCell>
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
                            <span className="sr-only">{t('products.table.openMenu')}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-xl rounded-xl"
                        >
                          <DropdownMenuLabel>{t('products.table.actions')}</DropdownMenuLabel>
                          <DropdownMenuItem 
                            className="hover:bg-slate-50/80 rounded-lg"
                            onClick={() => handleViewDetail(product)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {t('products.table.viewDetail')}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="hover:bg-slate-50/80 rounded-lg"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('products.table.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="hover:bg-slate-50/80 rounded-lg"
                            onClick={() => handleManageTags(product)}
                          >
                            <Tags className="mr-2 h-4 w-4" />
                            {t('products.table.manageTags')}
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
                                {t('products.table.deactivate')}
                              </>
                            ) : (
                              <>
                                <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                                {t('products.table.activate')}
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 hover:bg-red-50/80 rounded-lg"
                            onClick={() => handleDeleteProduct(product)}
                            disabled={deleteProductMutation.isPending}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('products.table.delete')}
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
                {t('products.pagination.showing')} {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, pagination.total)} {t('products.pagination.of')} {pagination.total} {t('products.pagination.products')}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg"
                >
                  {t('products.pagination.previous')}
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
                  {t('products.pagination.next')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

