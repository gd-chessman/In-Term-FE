"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { createPrintTemplate, getPrintTemplates, deletePrintTemplate, updatePrintTemplate } from "@/services/PrintService"
import { getCountries } from "@/services/CountryService"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  Eye,
  Copy,
  Download,
  TrendingUp,
  Globe,
  Printer,
  Code,
  Palette,
  BarChart3,
  Calendar,
  Loader2,
} from "lucide-react"


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

export default function PrintTemplatesPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [formData, setFormData] = useState({
    pt_country_id: "",
    pt_title: "",
    pt_brand: "",
    pt_origin_country: "",
    pt_product_code: "",
    pt_original_price: "",
    pt_unit_price: "",
    pt_currency: "",
    pt_vendor: "",
    pt_content: ""
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    pt_title: '',
    pt_country_id: '',
    pt_brand: '',
    pt_origin_country: '',
    pt_product_code: '',
    pt_original_price: '',
    pt_unit_price: '',
    pt_currency: '',
    pt_vendor: ''
  })
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false)
  const [isEditCurrencyDropdownOpen, setIsEditCurrencyDropdownOpen] = useState(false)

  const queryClient = useQueryClient()

  // Đọc search parameter từ URL khi component mount
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.currency-dropdown')) {
        setIsCurrencyDropdownOpen(false)
        setIsEditCurrencyDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch print templates
  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['print-templates'],
    queryFn: getPrintTemplates,
  })

  // Fetch countries
  const { data: countries = [], isLoading: isLoadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
  })

  // Currencies array - Đầy đủ các biểu tượng tiền tệ phổ biến
  const currencies = [
    // Các ký hiệu tiền tệ phổ biến nhất
    "$", "€", "¥", "£", "₫", "₩", "₹", "₽", "₪", "₦", "₨", "₺", "₼", "₾", "₿",
    // Các ký hiệu tiền tệ khác
    "؋", "L", "دج", "₡", "₢", "₣", "₤", "₥", "₧", "₭", "₮", "₯", "₰", "₱", "₲", "₳", "₴", "₵", "₶", "₷",
    "₸", "₻", "₼", "₽", "₾", "₿"
  ]

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: createPrintTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['print-templates'] })
      toast.success("Tạo template thành công!")
      setIsCreateDialogOpen(false)
      setFormData({
        pt_country_id: "",
        pt_title: "",
        pt_content: "",
        pt_brand: "",
        pt_origin_country: "",
        pt_product_code: "",
        pt_original_price: "",
        pt_unit_price: "",
        pt_currency: "",
        pt_vendor: "",
      })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo template")
    }
  })

  const deleteTemplateMutation = useMutation({
    mutationFn: deletePrintTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['print-templates'] })
      toast.success("Xóa template thành công!")
      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa template")
      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
    }
  })

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: ({ countryId, item }: { countryId: number, item: any }) => updatePrintTemplate(countryId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['print-templates'] })
      toast.success("Cập nhật template thành công!")
      setIsEditDialogOpen(false)
      setSelectedTemplate(null)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật template")
    }
  })

  const filteredTemplates = templates.filter((template: any) => {
    const matchesSearch =
      template.pt_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.pt_content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = selectedCountry === "all" || template.country?.country_code === selectedCountry
    return matchesSearch && matchesCountry
  })

  // Calculate stats from real data
  const totalUsage = templates.reduce((sum: number, t: any) => sum + (t.usage?.totalPrints || 0), 0)
  const mostUsedTemplate = templates.length > 0 ? templates.reduce((prev: any, current: any) =>
    (prev.usage?.totalPrints || 0) > (current.usage?.totalPrints || 0) ? prev : current,
  ) : { pt_title: "N/A", usage: { totalPrints: 0 } }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.pt_country_id || !formData.pt_title || !formData.pt_brand || !formData.pt_origin_country || !formData.pt_product_code || !formData.pt_original_price || !formData.pt_unit_price || !formData.pt_currency || !formData.pt_vendor) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }
    
    const payload = {
      pt_country_id: Number(formData.pt_country_id),
      pt_title: formData.pt_title.trim(),
      pt_brand: formData.pt_brand.trim(),
      pt_origin_country: formData.pt_origin_country.trim(),
      pt_product_code: formData.pt_product_code.trim(),
      pt_original_price: formData.pt_original_price.trim(),
      pt_unit_price: formData.pt_unit_price.trim(),
      pt_currency: formData.pt_currency.trim(),
      pt_vendor: formData.pt_vendor.trim(),
      pt_content: formData.pt_content.trim()
    }
    
    createTemplateMutation.mutate(payload)
  }

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDeleteTemplate = (template: any) => {
    setTemplateToDelete(template)
    setDeleteDialogOpen(true)
  }

  // Khi mở dialog chỉnh sửa, fill dữ liệu
  useEffect(() => {
    if (isEditDialogOpen && selectedTemplate) {
      setEditForm({
        pt_title: selectedTemplate.pt_title || '',
        pt_country_id: selectedTemplate.country?.country_id?.toString() || '',
        pt_brand: selectedTemplate.pt_brand || '',
        pt_origin_country: selectedTemplate.pt_origin_country || '',
        pt_product_code: selectedTemplate.pt_product_code || '',
        pt_original_price: selectedTemplate.pt_original_price || '',
        pt_unit_price: selectedTemplate.pt_unit_price || '',
        pt_currency: selectedTemplate.pt_currency || '',
        pt_vendor: selectedTemplate.pt_vendor || ''
      })
    }
  }, [isEditDialogOpen, selectedTemplate])

  // Xử lý submit cập nhật
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm.pt_title || !editForm.pt_country_id || !editForm.pt_brand || !editForm.pt_origin_country || !editForm.pt_product_code || !editForm.pt_original_price || !editForm.pt_unit_price || !editForm.pt_currency || !editForm.pt_vendor) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }
    updateTemplateMutation.mutate({
      countryId: selectedTemplate.country.country_id,
      item: {
        pt_title: editForm.pt_title.trim(),
        pt_country_id: Number(editForm.pt_country_id),
        pt_brand: editForm.pt_brand.trim(),
        pt_origin_country: editForm.pt_origin_country.trim(),
        pt_product_code: editForm.pt_product_code.trim(),
        pt_original_price: editForm.pt_original_price.trim(),
        pt_unit_price: editForm.pt_unit_price.trim(),
        pt_currency: editForm.pt_currency.trim(),
        pt_vendor: editForm.pt_vendor.trim()
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-600">Đang tải danh sách template...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 mb-2">Có lỗi xảy ra khi tải danh sách template</div>
          <Button onClick={() => queryClient.refetchQueries({ queryKey: ['print-templates'] })} variant="outline">
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Template In
          </h1>
          <p className="text-muted-foreground">Quản lý template in cho từng quốc gia</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Thêm Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Thêm Template mới
                </DialogTitle>
                <DialogDescription>Tạo template in mới cho quốc gia</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                    <TabsTrigger value="content">Từ ngữ sử dụng</TabsTrigger>
                    <TabsTrigger value="preview">Xem trước</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pt_title">Tiêu đề Template *</Label>
                        <Input 
                          id="pt_title" 
                          value={formData.pt_title}
                          onChange={(e) => handleInputChange('pt_title', e.target.value)}
                          placeholder="Nhập tiêu đề..." 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pt_country">Quốc gia *</Label>
                        <Select 
                          value={formData.pt_country_id} 
                          onValueChange={(value) => handleInputChange('pt_country_id', value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quốc gia" />
                          </SelectTrigger>
                                                  <SelectContent>
                          {isLoadingCountries ? (
                            <SelectItem value="" disabled>Đang tải...</SelectItem>
                          ) : (
                            countries.map((country: any) => (
                              <SelectItem key={country.country_id} value={country.country_id.toString()}>
                                <div className="flex items-center gap-2">
                                  <span>{getCountryFlag(country.country_code)}</span>
                                  <span>{country.country_name}</span>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="content" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pt_brand">Từ ngữ cho Thương hiệu *</Label>
                        <Input
                          id="pt_brand"
                          value={formData.pt_brand}
                          onChange={(e) => handleInputChange('pt_brand', e.target.value)}
                          placeholder="VD: Thương hiệu, Brand, Nhãn hiệu..."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pt_origin_country">Từ ngữ cho Xuất xứ *</Label>
                        <Input
                          id="pt_origin_country"
                          value={formData.pt_origin_country}
                          onChange={(e) => handleInputChange('pt_origin_country', e.target.value)}
                          placeholder="VD: Xuất xứ, Origin, Nguồn gốc..."
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pt_product_code">Từ ngữ cho Mã sản phẩm *</Label>
                        <Input
                          id="pt_product_code"
                          value={formData.pt_product_code}
                          onChange={(e) => handleInputChange('pt_product_code', e.target.value)}
                          placeholder="VD: Mã SP, Product Code, SKU..."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pt_original_price">Từ ngữ cho Giá gốc *</Label>
                        <Input
                          id="pt_original_price"
                          value={formData.pt_original_price}
                          onChange={(e) => handleInputChange('pt_original_price', e.target.value)}
                          placeholder="VD: Giá gốc, Original Price, MSRP..."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pt_unit_price">Từ ngữ cho Giá đơn vị *</Label>
                        <Input
                          id="pt_unit_price"
                          value={formData.pt_unit_price}
                          onChange={(e) => handleInputChange('pt_unit_price', e.target.value)}
                          placeholder="VD: Giá đơn vị, Unit Price, Price per unit..."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pt_currency">Ký hiệu tiền tệ *</Label>
                        <div className="relative currency-dropdown">
                          <Input
                            id="pt_currency"
                            value={formData.pt_currency}
                            onChange={(e) => handleInputChange('pt_currency', e.target.value)}
                            onFocus={() => setIsCurrencyDropdownOpen(true)}
                            placeholder="VD: $, €, ¥, ₫..."
                            required
                          />
                          {isCurrencyDropdownOpen && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                             {currencies.map((currency: string, index: number) => (
                            <div
                              key={index}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              onClick={() => {
                                handleInputChange('pt_currency', currency)
                                setIsCurrencyDropdownOpen(false)
                              }}
                            >
                              <span>{currency}</span>
                            </div>
                          ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pt_vendor">Từ ngữ cho Nhà cung cấp *</Label>
                        <Input
                          id="pt_vendor"
                          value={formData.pt_vendor}
                          onChange={(e) => handleInputChange('pt_vendor', e.target.value)}
                          placeholder="VD: Nhà cung cấp, Vendor, Supplier..."
                          required
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Các từ ngữ sẽ được sử dụng trong template:
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Thương hiệu:</Badge>
                          <span className="font-medium">{formData.pt_brand || "Chưa nhập"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Xuất xứ:</Badge>
                          <span className="font-medium">{formData.pt_origin_country || "Chưa nhập"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Mã SP:</Badge>
                          <span className="font-medium">{formData.pt_product_code || "Chưa nhập"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Giá gốc:</Badge>
                          <span className="font-medium">{formData.pt_original_price || "Chưa nhập"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Giá đơn vị:</Badge>
                          <span className="font-medium">{formData.pt_unit_price || "Chưa nhập"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Tiền tệ:</Badge>
                          <span className="font-medium">{formData.pt_currency || "Chưa chọn"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Nhà cung cấp:</Badge>
                          <span className="font-medium">{formData.pt_vendor || "Chưa nhập"}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="preview" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px]">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Xem trước Template:
                      </h4>
                      <div className="bg-white p-4 rounded border text-sm space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">Thương hiệu:</Badge>
                              <span className="font-medium">{formData.pt_brand || "Chưa nhập"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">Xuất xứ:</Badge>
                              <span className="font-medium">{formData.pt_origin_country || "Chưa nhập"}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">Mã SP:</Badge>
                              <span className="font-medium">{formData.pt_product_code || "Chưa nhập"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">Giá gốc:</Badge>
                              <span className="font-medium">{formData.pt_original_price || "Chưa nhập"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">Giá đơn vị:</Badge>
                              <span className="font-medium">{formData.pt_unit_price || "Chưa nhập"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">Tiền tệ:</Badge>
                              <span className="font-medium">{formData.pt_currency || "Chưa chọn"}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <DialogFooter className="mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createTemplateMutation.isPending}
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                  >
                    {createTemplateMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Đang tạo...
                      </>
                    ) : (
                      'Tạo Template'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Template</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{templates.length}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Tất cả template
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng lượt sử dụng</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Tổng lượt sử dụng</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phổ biến nhất</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{mostUsedTemplate.usage?.totalPrints || 0}</div>
            <p className="text-xs text-muted-foreground truncate">{mostUsedTemplate.pt_title}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quốc gia</CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <Globe className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{countries.length}</div>
            <p className="text-xs text-muted-foreground">Đang hỗ trợ</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="backdrop-blur-sm bg-white/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Tìm kiếm & Lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề, nội dung..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Chọn quốc gia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Tất cả quốc gia</span>
                    </div>
                  </SelectItem>
                  {countries.map((country: any) => (
                    <SelectItem key={country.country_id} value={country.country_code}>
                      <div className="flex items-center gap-2">
                        <span>{getCountryFlag(country.country_code)}</span>
                        <span>{country.country_name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="flex-1 sm:flex-none"
                >
                  <Palette className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="flex-1 sm:flex-none"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Display */}
      {viewMode === "cards" ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template: any) => (
            <Card
              key={template.pt_id}
              className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getCountryFlag(template.country?.country_code)}</div>
                    <div>
                      <CardTitle className="text-lg leading-tight">{template.pt_title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {template.country?.country_name}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg relative z-10"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-xl rounded-xl z-50">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedTemplate(template)
                          setIsPreviewDialogOpen(true)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Xem trước
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedTemplate(template)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteTemplate(template)}
                        disabled={deleteTemplateMutation.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deleteTemplateMutation.isPending && templateToDelete?.pt_id === template.pt_id ? 'Đang xóa...' : 'Xóa'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-2">Từ ngữ sử dụng:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">Thương hiệu:</Badge>
                      <span className="font-medium truncate">{template.pt_brand || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">Xuất xứ:</Badge>
                      <span className="font-medium truncate">{template.pt_origin_country || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">Mã SP:</Badge>
                      <span className="font-medium truncate">{template.pt_product_code || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">Giá gốc:</Badge>
                      <span className="font-medium truncate">{template.pt_original_price || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">Giá đơn vị:</Badge>
                      <span className="font-medium truncate">{template.pt_unit_price || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">Tiền tệ:</Badge>
                      <span className="font-medium truncate">{template.pt_currency || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">Nhà cung cấp:</Badge>
                      <span className="font-medium truncate">{template.pt_vendor || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Printer className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{template.usage?.totalPrints || 0}</span>
                    <span className="text-muted-foreground">lượt sử dụng</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(template.updated_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mức độ sử dụng</span>
                    <span>{template.usage?.usagePercentage || 0}%</span>
                  </div>
                  <Progress value={template.usage?.usagePercentage || 0} className="h-2" />
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      template.usage?.usageLevel === 'high' ? 'bg-green-500' : 
                      template.usage?.usageLevel === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-muted-foreground capitalize">
                      {template.usage?.usageLevel === 'high' ? 'Cao' : 
                       template.usage?.usageLevel === 'medium' ? 'Trung bình' : 'Thấp'}
                    </span>
                  </div>
                </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{template.country?.country_name}</span>
                      <Badge variant="outline" className="text-xs">
                        {template.country?.country_code}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Template</CardTitle>
            <CardDescription>Tổng cộng {filteredTemplates.length} template</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template</TableHead>
                  <TableHead>Quốc gia</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Lượt sử dụng</TableHead>
                  <TableHead>Cập nhật</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template: any) => (
                  <TableRow key={template.pt_id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="text-lg">{getCountryFlag(template.country?.country_code)}</div>
                        <div>
                          <div className="font-medium">{template.pt_title}</div>
                          <div className="text-sm text-muted-foreground">ID: {template.pt_id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{template.country?.country_name}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">Thương hiệu:</Badge>
                            <span className="font-medium truncate">{template.pt_brand || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">Xuất xứ:</Badge>
                            <span className="font-medium truncate">{template.pt_origin_country || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">Mã SP:</Badge>
                            <span className="font-medium truncate">{template.pt_product_code || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">Giá gốc:</Badge>
                            <span className="font-medium truncate">{template.pt_original_price || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">Giá đơn vị:</Badge>
                            <span className="font-medium truncate">{template.pt_unit_price || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">Tiền tệ:</Badge>
                            <span className="font-medium truncate">{template.pt_currency || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">Nhà cung cấp:</Badge>
                            <span className="font-medium truncate">{template.pt_vendor || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">{template.usage?.totalPrints || 0}</Badge>
                        <div className="w-16">
                          <Progress value={template.usage?.usagePercentage || 0} className="h-1" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          template.usage?.usageLevel === 'high' ? 'bg-green-500' : 
                          template.usage?.usageLevel === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-xs text-muted-foreground capitalize">
                          {template.usage?.usageLevel === 'high' ? 'Cao' : 
                           template.usage?.usageLevel === 'medium' ? 'Trung bình' : 'Thấp'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(template.updated_at).toLocaleDateString("vi-VN")}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(template.updated_at).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-xl rounded-xl z-50">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTemplate(template)
                              setIsPreviewDialogOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem trước
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTemplate(template)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Sao chép
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteTemplate(template)}
                            disabled={deleteTemplateMutation.isPending}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deleteTemplateMutation.isPending && templateToDelete?.pt_id === template.pt_id ? 'Đang xóa...' : 'Xóa'}
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

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              Xem trước Template
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <span>{getCountryFlag(selectedTemplate?.pt_country_code)}</span>
              {selectedTemplate?.pt_title} - {selectedTemplate?.pt_country_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground">Lượt sử dụng:</span>
                <div className="font-medium">{selectedTemplate?.usage?.totalPrints || 0}</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Mức độ sử dụng:</span>
                <div className="font-medium flex items-center gap-2">
                  <span>{selectedTemplate?.usage?.usagePercentage || 0}%</span>
                  <div className={`w-2 h-2 rounded-full ${
                    selectedTemplate?.usage?.usageLevel === 'high' ? 'bg-green-500' : 
                    selectedTemplate?.usage?.usageLevel === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs capitalize">
                    {selectedTemplate?.usage?.usageLevel === 'high' ? 'Cao' : 
                     selectedTemplate?.usage?.usageLevel === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Từ ngữ sử dụng trong Template:
              </h4>
              <div className="bg-white p-4 rounded border text-sm space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Thương hiệu:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_brand || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Xuất xứ:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_origin_country || "N/A"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Mã SP:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_product_code || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Giá gốc:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_original_price || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Giá đơn vị:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_unit_price || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Tiền tệ:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_currency || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Nhà cung cấp:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_vendor || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Các từ ngữ được sử dụng:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Thương hiệu:</Badge>
                  <span className="font-medium">{selectedTemplate?.pt_brand || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Xuất xứ:</Badge>
                  <span className="font-medium">{selectedTemplate?.pt_origin_country || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Mã SP:</Badge>
                  <span className="font-medium">{selectedTemplate?.pt_product_code || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Giá gốc:</Badge>
                  <span className="font-medium">{selectedTemplate?.pt_original_price || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Giá đơn vị:</Badge>
                  <span className="font-medium">{selectedTemplate?.pt_unit_price || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Tiền tệ:</Badge>
                  <span className="font-medium">{selectedTemplate?.pt_currency || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Nhà cung cấp:</Badge>
                  <span className="font-medium">{selectedTemplate?.pt_vendor || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Đóng
            </Button>
            <Button
              onClick={() => {
                setIsPreviewDialogOpen(false)
                setIsEditDialogOpen(true)
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-500" />
              Chỉnh sửa Template
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <span>{getCountryFlag(selectedTemplate?.pt_country_code)}</span>
              {selectedTemplate?.pt_title}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                <TabsTrigger value="content">Từ ngữ sử dụng</TabsTrigger>
                <TabsTrigger value="analytics">Thống kê</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_title">Tiêu đề Template</Label>
                    <Input id="edit_title" value={editForm.pt_title} onChange={e => setEditForm(f => ({...f, pt_title: e.target.value}))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_country">Quốc gia</Label>
                    <Select value={editForm.pt_country_id} onValueChange={v => setEditForm(f => ({...f, pt_country_id: v}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries?.map((country: any) => (
                          <SelectItem key={country.country_id} value={country.country_id.toString()}>
                            <div className="flex items-center gap-2">
                              <span>{getCountryFlag(country.country_code)}</span>
                              <span>{country.country_name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_brand">Từ ngữ cho Thương hiệu</Label>
                    <Input
                      id="edit_brand"
                      value={editForm.pt_brand}
                      onChange={e => setEditForm(f => ({...f, pt_brand: e.target.value}))}
                      placeholder="VD: Thương hiệu, Brand, Nhãn hiệu..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_origin_country">Từ ngữ cho Xuất xứ</Label>
                    <Input
                      id="edit_origin_country"
                      value={editForm.pt_origin_country}
                      onChange={e => setEditForm(f => ({...f, pt_origin_country: e.target.value}))}
                      placeholder="VD: Xuất xứ, Origin, Nguồn gốc..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_product_code">Từ ngữ cho Mã sản phẩm</Label>
                    <Input
                      id="edit_product_code"
                      value={editForm.pt_product_code}
                      onChange={e => setEditForm(f => ({...f, pt_product_code: e.target.value}))}
                      placeholder="VD: Mã SP, Product Code, SKU..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_original_price">Từ ngữ cho Giá gốc</Label>
                    <Input
                      id="edit_original_price"
                      value={editForm.pt_original_price}
                      onChange={e => setEditForm(f => ({...f, pt_original_price: e.target.value}))}
                      placeholder="VD: Giá gốc, Original Price, MSRP..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_unit_price">Từ ngữ cho Giá đơn vị</Label>
                    <Input
                      id="edit_unit_price"
                      value={editForm.pt_unit_price}
                      onChange={e => setEditForm(f => ({...f, pt_unit_price: e.target.value}))}
                      placeholder="VD: Giá đơn vị, Unit Price, Price per unit..."
                    />
                  </div>
                                    <div className="space-y-2">
                    <Label htmlFor="edit_currency">Ký hiệu tiền tệ</Label>
                    <div className="relative currency-dropdown">
                      <Input
                        id="edit_currency"
                        value={editForm.pt_currency}
                        onChange={e => setEditForm(f => ({...f, pt_currency: e.target.value}))}
                        onFocus={() => setIsEditCurrencyDropdownOpen(true)}
                        placeholder="VD: $, €, ¥, ₫..."
                      />
                      {isEditCurrencyDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                          {currencies.map((currency: string, index: number) => (
                            <div
                              key={index}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              onClick={() => {
                                setEditForm(f => ({...f, pt_currency: currency}))
                                setIsEditCurrencyDropdownOpen(false)
                              }}
                            >
                              <span>{currency}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_vendor">Từ ngữ cho Nhà cung cấp</Label>
                    <Input
                      id="edit_vendor"
                      value={editForm.pt_vendor}
                      onChange={e => setEditForm(f => ({...f, pt_vendor: e.target.value}))}
                      placeholder="VD: Nhà cung cấp, Vendor, Supplier..."
                    />
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Các từ ngữ sẽ được sử dụng trong template:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Thương hiệu:</Badge>
                      <span className="font-medium">{editForm.pt_brand || "Chưa nhập"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Xuất xứ:</Badge>
                      <span className="font-medium">{editForm.pt_origin_country || "Chưa nhập"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Mã SP:</Badge>
                      <span className="font-medium">{editForm.pt_product_code || "Chưa nhập"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Giá gốc:</Badge>
                      <span className="font-medium">{editForm.pt_original_price || "Chưa nhập"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Giá đơn vị:</Badge>
                      <span className="font-medium">{editForm.pt_unit_price || "Chưa nhập"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Tiền tệ:</Badge>
                      <span className="font-medium">{editForm.pt_currency || "Chưa chọn"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Nhà cung cấp:</Badge>
                      <span className="font-medium">{editForm.pt_vendor || "Chưa nhập"}</span>
                    </div>
                  </div>
                </div>

              </TabsContent>
              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Lượt sử dụng</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{selectedTemplate?.usage?.totalPrints || 0}</div>
                      <Progress value={selectedTemplate?.usage?.usagePercentage || 0} className="mt-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Mức độ sử dụng</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm font-medium flex items-center gap-2">
                        <span>{selectedTemplate?.usage?.usagePercentage || 0}%</span>
                        <div className={`w-2 h-2 rounded-full ${
                          selectedTemplate?.usage?.usageLevel === 'high' ? 'bg-green-500' : 
                          selectedTemplate?.usage?.usageLevel === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 capitalize">
                        {selectedTemplate?.usage?.usageLevel === 'high' ? 'Cao' : 
                         selectedTemplate?.usage?.usageLevel === 'medium' ? 'Trung bình' : 'Thấp'}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-2">
                  <Label>Các từ ngữ được sử dụng</Label>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Thương hiệu:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_brand || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Xuất xứ:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_origin_country || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Mã SP:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_product_code || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Giá gốc:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_original_price || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Giá đơn vị:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_unit_price || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Tiền tệ:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_currency || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Nhà cung cấp:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_vendor || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={updateTemplateMutation.isPending} className="bg-gradient-to-r from-blue-500 to-purple-600">
                {updateTemplateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu thay đổi'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-slate-900">Xác nhận xóa template</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Bạn có chắc chắn muốn xóa template <strong>"{templateToDelete?.pt_title}"</strong>?
              <br /><br />
              <span className="text-amber-600 font-medium">⚠️ Lưu ý:</span> Template này đang được sử dụng cho quốc gia {templateToDelete?.country?.country_name}. Việc xóa template có thể ảnh hưởng đến quá trình in ấn.
              <br /><br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow-md">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="font-semibold text-red-800">{templateToDelete?.pt_title}</div>
              <div className="text-sm text-red-600">
                Quốc gia: {templateToDelete?.country?.country_name} {getCountryFlag(templateToDelete?.country?.country_code)}
              </div>
              <div className="text-sm text-red-600">
                Lượt sử dụng: {templateToDelete?.usage?.totalPrints || 0} ({templateToDelete?.usage?.usagePercentage || 0}%)
              </div>
            </div>
          </div>
          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel 
              className="rounded-xl"
              disabled={deleteTemplateMutation.isPending}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => templateToDelete && deleteTemplateMutation.mutate(templateToDelete.pt_country_id)}
              disabled={deleteTemplateMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              {deleteTemplateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa Template
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
