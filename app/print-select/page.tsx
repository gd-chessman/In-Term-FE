"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createPrintSelect, getPrintSelects } from "@/services/PrintService"
import { getProducts } from "@/services/ProductService"
import { getCountries } from "@/services/CountryService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Printer,
  Package,
  FileText,
  Eye,
  Grid3X3,
  List,
  TrendingUp,
  Clock,
  DollarSign,
  Globe,
  Loader2,
} from "lucide-react"
import html2pdf from 'html2pdf.js'

// Mock data with enhanced information
const printFormats = [
  {
    id: "pdf",
    name: "PDF",
    icon: "📄",
    description: "Portable Document Format",
    quality: ["Standard", "High", "Print"],
  },
  {
    id: "png",
    name: "PNG",
    icon: "🖼️",
    description: "Portable Network Graphics",
    quality: ["72 DPI", "150 DPI", "300 DPI"],
  },
  {
    id: "jpg",
    name: "JPG",
    icon: "📸",
    description: "JPEG Image Format",
    quality: ["Low", "Medium", "High", "Maximum"],
  },
  { id: "svg", name: "SVG", icon: "🎨", description: "Scalable Vector Graphics", quality: ["Standard", "Optimized"] },
  { id: "eps", name: "EPS", icon: "📐", description: "Encapsulated PostScript", quality: ["Standard", "High"] },
  {
    id: "tiff",
    name: "TIFF",
    icon: "🖨️",
    description: "Tagged Image File Format",
    quality: ["LZW", "ZIP", "Uncompressed"],
  },
]

export default function PrintSelectPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<"cards" | "table">("table")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false)
  const [printingItems, setPrintingItems] = useState<number[]>([])
  const [printProgress, setPrintProgress] = useState(0)
  const [selectedPrintFormat, setSelectedPrintFormat] = useState("pdf")
  const [selectedPrintQuality, setSelectedPrintQuality] = useState("high")
  const [printCopies, setPrintCopies] = useState(1)

  // Form state for creating print selection
  const [formData, setFormData] = useState({
    ps_product_id: "",
    ps_country_id: "",
    ps_price_sale: "",
    ps_type: "",
    ps_status: "active",
    ps_num: "1",
    ps_option_1: "",
    ps_option_2: "",
    ps_option_3: "",
  })

  const queryClient = useQueryClient()

  // Fetch print selections, products and countries
  const { data: printSelections = [], isLoading: isLoadingPrintSelections } = useQuery({
    queryKey: ["printSelects"],
    queryFn: getPrintSelects,
  })

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })

  const { data: countries = [] } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  })

  // Create print selection mutation
  const createMutation = useMutation({
    mutationFn: createPrintSelect,
    onSuccess: () => {
      toast.success("Thêm sản phẩm vào danh sách in thành công!")
      setIsCreateDialogOpen(false)
      setFormData({
        ps_product_id: "",
        ps_country_id: "",
        ps_price_sale: "",
        ps_type: "",
        ps_status: "active",
        ps_num: "1",
        ps_option_1: "",
        ps_option_2: "",
        ps_option_3: "",
      })
      // Refresh data if needed
      queryClient.invalidateQueries({ queryKey: ["printSelects"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi thêm sản phẩm!")
    },
  })

  // Print mutation
  const printMutation = useMutation({
    mutationFn: async (printData: any) => {
      // Tạo file thật dựa trên dữ liệu
      const { items, format, quality, copies } = printData
      
      // Tạo nội dung file
      let fileContent = ''
      let fileName = `print_${new Date().toISOString().split('T')[0]}_${items.length}_items`
      
      if (format === 'pdf') {
        const html = generatePDFContent(items, quality, copies);
        fileName += '.pdf';
        exportToPDF(html, fileName);
        return { success: true, fileName };
      } else if (format === 'txt') {
        fileContent = generateTextContent(items, quality, copies)
        fileName += '.txt'
      } else {
        // Mặc định tạo file text
        fileContent = generateTextContent(items, quality, copies)
        fileName += '.txt'
      }
      
      // Tạo và tải xuống file text
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return { success: true, fileName }
    },
    onSuccess: (data) => {
      toast.success(`File đã được tạo và tải xuống: ${data.fileName}`)
      setIsPrintDialogOpen(false)
      setPrintProgress(0)
      setPrintingItems([])
    },
    onError: (error: any) => {
      toast.error("Có lỗi xảy ra khi tạo file!")
      setPrintProgress(0)
    },
  })

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.ps_product_id || !formData.ps_country_id || !formData.ps_type) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!")
      return
    }

    const submitData = {
      ps_product_id: parseInt(formData.ps_product_id),
      ps_country_id: parseInt(formData.ps_country_id),
      ps_price_sale: formData.ps_price_sale ? parseFloat(formData.ps_price_sale) : null,
      ps_type: formData.ps_type as "a0" | "a1" | "a2" | "a5" | "a6" | "a7",
      ps_status: formData.ps_status as "active" | "inactive",
      ps_num: parseInt(formData.ps_num),
      ps_option_1: formData.ps_option_1 || null,
      ps_option_2: formData.ps_option_2 || null,
      ps_option_3: formData.ps_option_3 || null,
    }

    createMutation.mutate(submitData)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">Hoạt động</Badge>
      case "inactive":
        return <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0">Tạm dừng</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">Cao</Badge>
      case "medium":
        return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">Trung bình</Badge>
      case "low":
        return <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">Thấp</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const typeMap: { [key: string]: { label: string; color: string } } = {
      a0: { label: "A0 (841×1189mm)", color: "from-purple-500 to-indigo-500" },
      a1: { label: "A1 (594×841mm)", color: "from-blue-500 to-cyan-500" },
      a2: { label: "A2 (420×594mm)", color: "from-green-500 to-teal-500" },
      a3: { label: "A3 (297×420mm)", color: "from-yellow-500 to-orange-500" },
      a4: { label: "A4 (210×297mm)", color: "from-pink-500 to-rose-500" },
      a5: { label: "A5 (148×210mm)", color: "from-indigo-500 to-purple-500" },
      a6: { label: "A6 (105×148mm)", color: "from-teal-500 to-green-500" },
      a7: { label: "A7 (74×105mm)", color: "from-orange-500 to-red-500" },
    }
    const typeInfo = typeMap[type] || { label: type, color: "from-gray-500 to-gray-600" }
    return <Badge className={`bg-gradient-to-r ${typeInfo.color} text-white border-0`}>{typeInfo.label}</Badge>
  }

  const getFormatBadge = (format: string) => {
    const formatInfo = printFormats.find((f) => f.id === format)
    if (!formatInfo) return <Badge variant="outline">{format}</Badge>

    return (
      <Badge className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-indigo-200">
        <span className="mr-1">{formatInfo.icon}</span>
        {formatInfo.name}
      </Badge>
    )
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

  const generateTextContent = (items: any[], quality: string, copies: number) => {
    let content = `THÔNG TIN IN SẢN PHẨM\n`
    content += `Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}\n`
    content += `Chất lượng: ${quality}\n`
    content += `Số bản in: ${copies}\n`
    content += `Tổng số sản phẩm: ${items.length}\n`
    content += `\n${'='.repeat(50)}\n\n`

    items.forEach((item, index) => {
      content += `SẢN PHẨM ${index + 1}\n`
      content += `Tên sản phẩm: ${item.product?.product_name}\n`
      content += `Mã sản phẩm: ${item.product?.product_code}\n`
      content += `Quốc gia: ${item.country?.country_name}\n`
      content += `Giá bán: ${formatPrice(item.ps_price_sale, item.country?.country_name)}\n`
      content += `Khổ giấy: ${item.ps_type}\n`
      content += `Số lượng: ${item.ps_num}\n`
      content += `Trạng thái: ${item.ps_status}\n`
      if (item.templates?.ps_option_1) {
        content += `Tùy chọn 1: ${item.templates.ps_option_1}\n`
      }
      if (item.templates?.ps_option_2) {
        content += `Tùy chọn 2: ${item.templates.ps_option_2}\n`
      }
      if (item.templates?.ps_option_3) {
        content += `Tùy chọn 3: ${item.templates.ps_option_3}\n`
      }
      content += `\n${'-'.repeat(30)}\n\n`
    })

    return content
  }

  const generatePDFContent = (items: any[], quality: string, copies: number) => {
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Thông tin in sản phẩm</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .product { border: 1px solid #ddd; margin: 20px 0; padding: 15px; border-radius: 5px; }
        .product-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px; }
        .product-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>THÔNG TIN IN SẢN PHẨM</h1>
        <p>Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}</p>
        <p>Chất lượng: ${quality} | Số bản in: ${copies}</p>
      </div>
    `

    items.forEach((item, index) => {
      html += `
      <div class="product">
        <div class="product-title">SẢN PHẨM ${index + 1}</div>
        <div class="product-info">
          <div><span class="label">Tên sản phẩm:</span> <span class="value">${item.product?.product_name}</span></div>
          <div><span class="label">Mã sản phẩm:</span> <span class="value">${item.product?.product_code}</span></div>
          <div><span class="label">Quốc gia:</span> <span class="value">${item.country?.country_name}</span></div>
          <div><span class="label">Giá bán:</span> <span class="value">${formatPrice(item.ps_price_sale, item.country?.country_name)}</span></div>
          <div><span class="label">Khổ giấy:</span> <span class="value">${item.ps_type}</span></div>
          <div><span class="label">Số lượng:</span> <span class="value">${item.ps_num}</span></div>
          <div><span class="label">Trạng thái:</span> <span class="value">${item.ps_status}</span></div>
          ${item.templates?.ps_option_1 ? `<div><span class="label">Tùy chọn 1:</span> <span class="value">${item.templates.ps_option_1}</span></div>` : ''}
          ${item.templates?.ps_option_2 ? `<div><span class="label">Tùy chọn 2:</span> <span class="value">${item.templates.ps_option_2}</span></div>` : ''}
          ${item.templates?.ps_option_3 ? `<div><span class="label">Tùy chọn 3:</span> <span class="value">${item.templates.ps_option_3}</span></div>` : ''}
        </div>
      </div>
      `
    })

    html += `
      <div class="footer">
        <p>© 2024 Company Name. All rights reserved.</p>
      </div>
    </body>
    </html>
    `

    return html
  }

  const exportToPDF = (htmlContent: string, fileName: string) => {
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    document.body.appendChild(element);

    html2pdf()
      .set({
        margin: 10,
        filename: fileName,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(element)
      .save()
      .then(() => {
        document.body.removeChild(element);
      });
  }

  const formatPrice = (price: number, country: any) => {
    if (country === "Việt Nam") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price)
    } else if (country === "Hoa Kỳ") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
    } else if (country === "Nhật Bản") {
      return new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
      }).format(price)
    }
    return price.toString()
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(printSelections.map((item: any) => item.ps_id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    }
  }

  const filteredItems = printSelections.filter((item: any) => {
    const matchesSearch =
      item.product?.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product?.product_code?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = selectedCountry === "all" || item.country?.country_name === selectedCountry
    const matchesType = selectedType === "all" || item.ps_type === selectedType
    const matchesStatus = selectedStatus === "all" || item.ps_status === selectedStatus

    return matchesSearch && matchesCountry && matchesType && matchesStatus
  })

  const totalPrintCount = printSelections.reduce((sum: number, item: any) => sum + (item.ps_num || 0), 0)
  const activeCount = printSelections.filter((item: any) => item.ps_status === "active").length
  const a4Count = printSelections.filter((item: any) => item.ps_type === "a4").length

  const handlePrintSingle = (item: any) => {
    setPrintingItems([item.ps_id])
    setIsPrintDialogOpen(true)
  }

  const handlePrintSelected = () => {
    if (selectedItems.length === 0) return
    setPrintingItems(selectedItems)
    setIsPrintDialogOpen(true)
  }

  const handlePrintAll = () => {
    setPrintingItems(filteredItems.map((item: any) => item.ps_id))
    setIsPrintDialogOpen(true)
  }

  const executePrint = async () => {
    const itemsToPrint = printSelections.filter((item: any) => printingItems.includes(item.ps_id))
    
    const printData = {
      items: itemsToPrint,
      format: selectedPrintFormat,
      quality: selectedPrintQuality,
      copies: printCopies,
      totalPages: printingItems.length * printCopies
    }

    printMutation.mutate(printData)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Chọn sản phẩm In
          </h1>
          <p className="text-muted-foreground">Quản lý danh sách sản phẩm được chọn để in với giao diện hiện đại</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className={viewMode === "cards" ? "shadow-sm" : ""}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className={viewMode === "table" ? "shadow-sm" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={handlePrintAll}
            className="border-green-200 text-green-600 hover:bg-green-50 w-full sm:w-auto"
          >
            <Printer className="mr-2 h-4 w-4" />
            In tất cả ({filteredItems.length})
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Thêm sản phẩm vào danh sách in
                </DialogTitle>
                <DialogDescription>Chọn sản phẩm và cấu hình thông tin in ấn</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                  <TabsTrigger value="config">Cấu hình in</TabsTrigger>
                  <TabsTrigger value="preview">Xem trước</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product">Sản phẩm *</Label>
                      <Select value={formData.ps_product_id} onValueChange={(value) => setFormData({...formData, ps_product_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn sản phẩm" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product: any) => (
                            <SelectItem key={product.product_id} value={product.product_id.toString()}>
                              <div className="flex items-center space-x-2">
                                <span>{product.product_name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {product.category?.category_name}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Quốc gia *</Label>
                      <Select value={formData.ps_country_id} onValueChange={(value) => setFormData({...formData, ps_country_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quốc gia" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country: any) => (
                            <SelectItem key={country.country_id} value={country.country_id.toString()}>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{country.country_flag}</span>
                                <span>{country.country_name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {country.currency}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price_sale">Giá bán (tùy chọn)</Label>
                    <Input 
                      id="price_sale" 
                      type="number" 
                      placeholder="Nhập giá bán (để trống để dùng giá mặc định)" 
                      value={formData.ps_price_sale}
                      onChange={(e) => setFormData({...formData, ps_price_sale: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ps_num">Số lượng *</Label>
                    <Input 
                      id="ps_num" 
                      type="number" 
                      min="1"
                      max="999999"
                      placeholder="Nhập số lượng" 
                      value={formData.ps_num}
                      onChange={(e) => setFormData({...formData, ps_num: e.target.value})}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="config" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Khổ giấy *</Label>
                      <Select value={formData.ps_type} onValueChange={(value) => setFormData({...formData, ps_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn khổ giấy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a0">A0 (841×1189mm)</SelectItem>
                          <SelectItem value="a1">A1 (594×841mm)</SelectItem>
                          <SelectItem value="a2">A2 (420×594mm)</SelectItem>
                          <SelectItem value="a5">A5 (148×210mm)</SelectItem>
                          <SelectItem value="a6">A6 (105×148mm)</SelectItem>
                          <SelectItem value="a7">A7 (74×105mm)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Trạng thái *</Label>
                      <Select value={formData.ps_status} onValueChange={(value) => setFormData({...formData, ps_status: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Hoạt động</SelectItem>
                          <SelectItem value="inactive">Tạm dừng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ps_option_1">Tùy chọn 1 (tùy chọn)</Label>
                    <Input 
                      id="ps_option_1" 
                      placeholder="Nhập tùy chọn 1" 
                      value={formData.ps_option_1}
                      onChange={(e) => setFormData({...formData, ps_option_1: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ps_option_2">Tùy chọn 2 (tùy chọn)</Label>
                    <Input 
                      id="ps_option_2" 
                      placeholder="Nhập tùy chọn 2" 
                      value={formData.ps_option_2}
                      onChange={(e) => setFormData({...formData, ps_option_2: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ps_option_3">Tùy chọn 3 (tùy chọn)</Label>
                    <Input 
                      id="ps_option_3" 
                      placeholder="Nhập tùy chọn 3" 
                      value={formData.ps_option_3}
                      onChange={(e) => setFormData({...formData, ps_option_3: e.target.value})}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="preview" className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <h4 className="font-medium">Xem trước thông tin sản phẩm</h4>
                    <div className="text-sm text-muted-foreground">
                      Thông tin sản phẩm sẽ được hiển thị ở đây sau khi bạn điền đầy đủ các trường bên trên.
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleCreateSubmit}
                  disabled={createMutation.isPending}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    "Thêm vào danh sách"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {selectedItems.length > 0 && (
            <Button
              onClick={handlePrintSelected}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 w-full sm:w-auto"
            >
              <Printer className="mr-2 h-4 w-4" />
              In đã chọn ({selectedItems.length})
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Tổng sản phẩm</CardTitle>
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{printSelections.length}</div>
            <p className="text-xs text-blue-600">Trong danh sách in</p>
            <div className="mt-2">
              <Progress value={75} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Đang hoạt động</CardTitle>
            <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{activeCount}</div>
            <p className="text-xs text-green-600">Sẵn sàng in</p>
            <div className="mt-2">
              <Progress value={(activeCount / printSelections.length) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Tổng lượt in</CardTitle>
            <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Printer className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{totalPrintCount.toLocaleString()}</div>
            <p className="text-xs text-purple-600">Lượt in tổng cộng</p>
            <div className="mt-2">
              <Progress value={85} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Đã chọn</CardTitle>
            <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{selectedItems.length}</div>
            <p className="text-xs text-orange-600">Để in ngay</p>
            <div className="mt-2">
              <Progress
                value={selectedItems.length > 0 ? (selectedItems.length / printSelections.length) * 100 : 0}
                className="h-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="backdrop-blur-sm bg-white/80 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-blue-600" />
            <span>Tìm kiếm & Lọc nâng cao</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên sản phẩm, mã sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quốc gia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả quốc gia</SelectItem>
                  {countries.map((country: any) => (
                    <SelectItem key={country.country_id} value={country.country_name}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{country.country_flag}</span>
                        <span>{country.country_name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Khổ giấy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả khổ</SelectItem>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="a3">A3</SelectItem>
                  <SelectItem value="a5">A5</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Tạm dừng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoadingPrintSelections && (
        <Card className="backdrop-blur-sm bg-white/90">
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Đang tải dữ liệu...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards View */}
      {viewMode === "cards" && !isLoadingPrintSelections && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item: any) => (
            <Card
              key={item.ps_id}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-purple-50"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedItems.includes(item.ps_id)}
                      onCheckedChange={(checked) => handleSelectItem(item.ps_id, checked as boolean)}
                    />
                    <div className="text-3xl">{item.country_flag}</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrintSingle(item)}>
                        <Printer className="mr-2 h-4 w-4" />
                        In ngay
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {item.product?.product_name}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    <code className="bg-muted px-2 py-1 rounded text-xs">{item.product?.product_code}</code>
                    <Badge variant="outline" className="text-xs">
                      Số lượng: {item.ps_num}
                    </Badge>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.country?.country_name}</span>
                  </div>
                  {getStatusBadge(item.ps_status)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(item.ps_price_sale, item.country?.country_name)}
                    </span>
                  </div>
                  {getTypeBadge(item.ps_type)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Tùy chọn:</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {item.templates?.ps_option_1 || "Không có"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ngày tạo:</span>
                    <span className="font-medium">{new Date(item.created_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Cập nhật: {new Date(item.updated_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Enhanced Table View */}
      {viewMode === "table" && !isLoadingPrintSelections && (
        <Card className="backdrop-blur-sm bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <List className="h-5 w-5 text-blue-600" />
              <span>Danh sách sản phẩm chọn in</span>
            </CardTitle>
            <CardDescription>
              Hiển thị {filteredItems.length} / {printSelections.length} sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Quốc gia</TableHead>
                  <TableHead>Giá bán</TableHead>
                  <TableHead>Khổ giấy</TableHead>
                  <TableHead>Tùy chọn</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item: any) => (
                  <TableRow
                    key={item.ps_id}
                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.ps_id)}
                        onCheckedChange={(checked) => handleSelectItem(item.ps_id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{item.product?.product_name}</div>
                        <div className="flex items-center space-x-2">
                          <code className="bg-muted px-2 py-1 rounded text-xs">{item.product?.product_code}</code>
                          <Badge variant="outline" className="text-xs">
                            Số lượng: {item.ps_num}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{item.country?.country_code ? getCountryFlag(item.country.country_code) : "🌍"}</span>
                        <span>{item.country?.country_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatPrice(item.ps_price_sale, item.country?.country_name)}
                    </TableCell>
                    <TableCell>{getTypeBadge(item.ps_type)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.templates?.ps_option_1 || "Không có"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{item.ps_num}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.ps_status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(item.created_at).toLocaleDateString("vi-VN")}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.updated_at).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
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
                          <DropdownMenuItem onClick={() => handlePrintSingle(item)}>
                            <Printer className="mr-2 h-4 w-4" />
                            In ngay
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa khỏi danh sách
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

      {/* Print Dialog */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-green-500" />
              In sản phẩm ({printingItems.length} sản phẩm)
            </DialogTitle>
            <DialogDescription>Cấu hình và thực hiện in cho các sản phẩm đã chọn</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Print Items Preview */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sản phẩm sẽ in:</Label>
              <div className="max-h-32 overflow-y-auto space-y-2 bg-gray-50 p-3 rounded-lg">
                {printSelections
                  .filter((item: any) => printingItems.includes(item.ps_id))
                  .map((item: any) => (
                    <div key={item.ps_id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{item.country?.country_code ? getCountryFlag(item.country.country_code) : "🌍"}</span>
                        <span className="font-medium">{item.product?.product_name}</span>
                        <code className="bg-white px-2 py-1 rounded text-xs">{item.product?.product_code}</code>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.templates?.ps_option_1 || "Không có"}
                        </Badge>
                        {getTypeBadge(item.ps_type)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Print Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="print-format">Định dạng in</Label>
                <Select value={selectedPrintFormat} onValueChange={setSelectedPrintFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {printFormats.map((format) => (
                      <SelectItem key={format.id} value={format.id}>
                        <div className="flex items-center space-x-2">
                          <span>{format.icon}</span>
                          <div>
                            <div className="font-medium">{format.name}</div>
                            <div className="text-xs text-muted-foreground">{format.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem value="txt">
                      <div className="flex items-center space-x-2">
                        <span>📄</span>
                        <div>
                          <div className="font-medium">TXT</div>
                          <div className="text-xs text-muted-foreground">Plain Text Format</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="print-quality">Chất lượng</Label>
                <Select value={selectedPrintQuality} onValueChange={setSelectedPrintQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {printFormats
                      .find((f) => f.id === selectedPrintFormat)
                      ?.quality.map((quality) => (
                        <SelectItem key={quality} value={quality.toLowerCase()}>
                          {quality}
                        </SelectItem>
                      )) || []}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="print-copies">Số bản in</Label>
                <Input
                  id="print-copies"
                  type="number"
                  min="1"
                  max="100"
                  value={printCopies}
                  onChange={(e) => setPrintCopies(Number.parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tổng số trang</Label>
                <div className="text-2xl font-bold text-blue-600">{printingItems.length * printCopies}</div>
              </div>
            </div>

            {/* Thêm vào Print Dialog, sau phần Print Settings */}
            <div className="space-y-2">
              <Label>Xem trước file sẽ tạo</Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Xem trước {selectedPrintFormat.toUpperCase()}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-600" />
                      Xem trước file {selectedPrintFormat.toUpperCase()}
                    </DialogTitle>
                    <DialogDescription>Preview file sẽ được tạo với {printingItems.length} sản phẩm</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* File Preview */}
                    <div className="border rounded-lg overflow-hidden bg-gray-50">
                      <div className="bg-white p-4 border-b flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-100 text-blue-800">{selectedPrintFormat.toUpperCase()}</Badge>
                          <span className="text-sm text-muted-foreground">Chất lượng: {selectedPrintQuality}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {printCopies} bản × {printingItems.length} sản phẩm = {printCopies * printingItems.length}{" "}
                          trang
                        </div>
                      </div>

                      {/* Preview Content */}
                      <div className="p-6 bg-white min-h-[400px] max-h-[500px] overflow-auto">
                        <div className="space-y-6">
                          {printSelections
                            .filter((item: any) => printingItems.includes(item.ps_id))
                            .map((item: any, index: number) => (
                              <div
                                key={item.ps_id}
                                className="max-w-2xl mx-auto bg-white shadow-lg border rounded-lg p-8"
                              >
                                <div className="space-y-4">
                                  <div className="text-center border-b pb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">THÔNG TIN SẢN PHẨM</h2>
                                    <p className="text-sm text-gray-600 mt-2">
                                      {item.country?.country_code ? getCountryFlag(item.country.country_code) : "🌍"} Template {item.country?.country_name}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Tên sản phẩm:</label>
                                        <p className="text-lg font-semibold text-gray-800">{item.product?.product_name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Mã sản phẩm:</label>
                                        <p className="font-mono text-gray-800">{item.product?.product_code}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Số lượng:</label>
                                        <p className="text-gray-800">{item.ps_num}</p>
                                      </div>
                                    </div>

                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Giá bán:</label>
                                        <p className="text-xl font-bold text-green-600">
                                          {formatPrice(item.ps_price_sale, item.country?.country_name)}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Ngày in:</label>
                                        <p className="text-gray-800">{new Date().toLocaleDateString("vi-VN")}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Định dạng:</label>
                                        <p className="text-gray-800">
                                          {selectedPrintFormat.toUpperCase()} - {selectedPrintQuality}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-center py-6 border-t">
                                    <div className="inline-block p-4 border-2 border-dashed border-gray-300 rounded">
                                      <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                        QR CODE
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Mã QR sản phẩm</p>
                                  </div>

                                  <div className="text-center text-xs text-gray-500 border-t pt-4">
                                    © 2024 Company Name. All rights reserved.
                                  </div>
                                </div>

                                {index < printingItems.length - 1 && (
                                  <div className="text-center text-xs text-gray-400 mt-4 border-t pt-2">
                                    Trang {index + 1} / {printingItems.length}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Format specific info */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Thông tin file {selectedPrintFormat.toUpperCase()}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Chất lượng:</span> {selectedPrintQuality}
                        </div>
                        <div>
                          <span className="text-blue-700">Ước tính dung lượng:</span>{" "}
                          {(printingItems.length * printCopies * 0.5).toFixed(1)} MB
                        </div>
                        {selectedPrintFormat === "pdf" && (
                          <>
                            <div>
                              <span className="text-blue-700">Có thể tìm kiếm:</span> Có
                            </div>
                            <div>
                              <span className="text-blue-700">Vector graphics:</span> Có
                            </div>
                          </>
                        )}
                        {selectedPrintFormat === "png" && (
                          <>
                            <div>
                              <span className="text-blue-700">Độ phân giải:</span> {selectedPrintQuality}
                            </div>
                            <div>
                              <span className="text-blue-700">Nền trong suốt:</span> Có
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Print Progress */}
            {printMutation.isPending && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Đang xử lý in...</span>
                  <span>Vui lòng chờ</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            )}

            {/* Print Options */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-blue-900">Tùy chọn in nâng cao</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox id="print-background" />
                  <Label htmlFor="print-background">In background</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="print-borders" />
                  <Label htmlFor="print-borders">In viền</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="print-colors" defaultChecked />
                  <Label htmlFor="print-colors">In màu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="print-duplex" />
                  <Label htmlFor="print-duplex">In 2 mặt</Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Ước tính: {(printingItems.length * printCopies * 0.5).toFixed(1)} MB</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsPrintDialogOpen(false)}>
                Hủy
              </Button>
              <Button
                onClick={executePrint}
                disabled={printMutation.isPending}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {printMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang in...
                  </>
                ) : (
                  <>
                    <Printer className="mr-2 h-4 w-4" />
                    Bắt đầu in
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
