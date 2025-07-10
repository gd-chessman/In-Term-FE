"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createPrintSelect, getPrintSelects, getPrintTemplates, deletePrintSelect, updatePrintSelect, runPrintSelect, getPrintStatistics } from "@/services/PrintService"
import { getProducts } from "@/services/ProductService"
import { getCountries } from "@/services/CountryService"
import { getTemplate, prepareTemplateData, generateMultipleProductsHTML } from "@/components/templates"
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

// Default print formats fallback
const defaultPrintFormats = [
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editFormData, setEditFormData] = useState({
    ps_product_id: "",
    ps_country_id: "",
    ps_price_sale: "",
    ps_time_sale_start: "",
    ps_time_sale_end: "",
    ps_status: "active",
    ps_option_1: "",
    ps_option_2: "",
    ps_option_3: "",
  })
  const [printingItems, setPrintingItems] = useState<number[]>([])
  const [printProgress, setPrintProgress] = useState(0)
  const [selectedPrintFormat, setSelectedPrintFormat] = useState("pdf")
  const [selectedPrintQuality, setSelectedPrintQuality] = useState("high")
  const [selectedPrintSize, setSelectedPrintSize] = useState("a4")
  const [printCopies, setPrintCopies] = useState(1)

  // Form state for creating print selection
  const [formData, setFormData] = useState({
    ps_product_id: "",
    ps_country_id: "",
    ps_price_sale: "",
    ps_time_sale_start: "",
    ps_time_sale_end: "",
    ps_status: "active",
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

  // Fetch print templates
  const { data: printTemplates = [] } = useQuery({
    queryKey: ["printTemplates"],
    queryFn: getPrintTemplates,
  })


  const { data: printStatistics, isLoading: printStatsLoading } = useQuery({
    queryKey: ["print-statistics"],
    queryFn: getPrintStatistics,
  })

  // Combine templates with default formats
  const printFormats = printTemplates.length > 0 
    ? printTemplates.map((template: any) => ({
        id: template.pt_id.toString(),
        name: template.pt_title,
        icon: "📄",
        description: `Template cho ${template.country?.country_name}`,
        quality: ["Standard", "High", "Print"],
        template: template
      }))
    : defaultPrintFormats

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
        ps_time_sale_start: "",
        ps_time_sale_end: "",
        ps_status: "active",
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

  // Delete print selection mutation
  const deleteMutation = useMutation({
    mutationFn: deletePrintSelect,
    onSuccess: () => {
      toast.success("Đã xóa sản phẩm khỏi danh sách in!")
      queryClient.invalidateQueries({ queryKey: ["printSelects"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa sản phẩm!")
    },
  })

  // Update print selection mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, item }: { id: number; item: any }) => updatePrintSelect(id, item),
    onSuccess: () => {
      toast.success("Đã cập nhật thông tin sản phẩm!")
      setIsEditDialogOpen(false)
      setEditingItem(null)
      setEditFormData({
        ps_product_id: "",
        ps_country_id: "",
        ps_price_sale: "",
        ps_time_sale_start: "",
        ps_time_sale_end: "",
        ps_status: "active",
        ps_option_1: "",
        ps_option_2: "",
        ps_option_3: "",
      })
      queryClient.invalidateQueries({ queryKey: ["printSelects"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật sản phẩm!")
    },
  })

  // Print mutation
  const printMutation = useMutation({
    mutationFn: async (printData: any) => {
      // Tạo file thật dựa trên dữ liệu
      const { items, format, quality, copies } = printData
      
      // Tìm template được chọn
      const selectedTemplate = printFormats.find((f: any) => f.id === format)?.template
      
      // Tạo nội dung file
      let fileContent = ''
      let fileName = `print_${new Date().toISOString().split('T')[0]}_${items.length}_items`
      
      // Nếu có template từ API hoặc format là pdf, tạo PDF
      if (selectedTemplate || format === 'pdf') {
        const html = generatePDFContent(items, quality, copies, selectedTemplate);
        fileName += '.pdf';
        await exportToPDF(html, fileName);
        return { success: true, fileName };
      } else if (format === 'txt') {
        fileContent = generateTextContent(items, quality, copies, selectedTemplate)
        fileName += '.txt'
        
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
      } else {
        // Các format khác (png, jpg, svg, eps, tiff) - tạo PDF với template mặc định
        const html = generatePDFContent(items, quality, copies, null);
        fileName += '.pdf';
        await exportToPDF(html, fileName);
        return { success: true, fileName };
      }
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
    
    if (!formData.ps_product_id || !formData.ps_country_id) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!")
      return
    }

    const submitData = {
      ps_product_id: parseInt(formData.ps_product_id),
      ps_country_id: parseInt(formData.ps_country_id),
      ps_price_sale: formData.ps_price_sale ? parseFloat(formData.ps_price_sale) : null,
      ps_time_sale_start: formData.ps_time_sale_start || null,
      ps_time_sale_end: formData.ps_time_sale_end || null,
      ps_status: formData.ps_status as "active" | "inactive",
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
    const formatInfo = printFormats.find((f: any) => f.id === format)
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

  const generateTextContent = (items: any[], quality: string, copies: number, template?: any) => {
    let content = ''
    
    if (template) {
      // Sử dụng template từ API
      content += `${template.pt_title}\n`
      content += `Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}\n`
      content += `Chất lượng: ${quality}\n`
      content += `Số bản in: ${copies}\n`
      content += `Tổng số sản phẩm: ${items.length}\n`
      content += `\n${'='.repeat(50)}\n\n`

      items.forEach((item, index) => {
        // Thay thế các biến trong template
        let itemContent = template.pt_content
          .replace(/{product_name}/g, item.product?.product_name || '')
          .replace(/{product_code}/g, item.product?.product_code || '')
          .replace(/{price}/g, formatPrice(item.ps_price_sale, item.country?.country_name))
          .replace(/{category_name}/g, item.product?.category?.category_name || '')
          .replace(/{print_date}/g, new Date().toLocaleDateString('vi-VN'))
          .replace(/{country_name}/g, item.country?.country_name || '')
          .replace(/{ps_num}/g, item.ps_num?.toString() || '')
          .replace(/{ps_type}/g, item.ps_type || '')
        
        content += `SẢN PHẨM ${index + 1}\n`
        content += itemContent
        content += `\n${'-'.repeat(30)}\n\n`
      })

      if (template.pt_footer) {
        content += `\n${template.pt_footer}\n`
      }
    } else {
      // Fallback to default format
      content += `THÔNG TIN IN SẢN PHẨM\n`
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
    }

    return content
  }

  const generatePDFContent = (items: any[], quality: string, copies: number, template?: any) => {
    // Sử dụng template system mới
    const templateData = items.map(item => prepareTemplateData(item, formatPrice))
    return generateMultipleProductsHTML(selectedPrintSize, templateData)
  }

  const exportToPDF = async (htmlContent: string, fileName: string) => {
    if (typeof window === 'undefined') return; // Chỉ chạy trên client
    const html2pdf = (await import('html2pdf.js')).default;
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
    const matchesType = selectedType === "all" || item.ps_status === selectedType
    const matchesStatus = selectedStatus === "all" || item.ps_status === selectedStatus

    return matchesSearch && matchesCountry && matchesType
  })

  const totalPrintCount = printSelections.reduce((sum: number, item: any) => sum + (item.print_numbers?.length || 0), 0)
  const activeCount = printSelections.filter((item: any) => item.ps_status === "active").length
  const totalItems = printSelections.length

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

  const handleDeleteItem = (item: any) => {
    setItemToDelete(item)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.ps_id)
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleEditItem = (item: any) => {
    setEditingItem(item)
    
    // Hàm chuyển đổi ngày tháng sang định dạng YYYY-MM-DD cho input type="date"
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return ""
      try {
        const date = new Date(dateString)
        return date.toISOString().split('T')[0] // Lấy phần YYYY-MM-DD
      } catch (error) {
        return ""
      }
    }
    
    // Pre-fill form data
    setEditFormData({
      ps_product_id: item.ps_product_id?.toString() || "",
      ps_country_id: item.ps_country_id?.toString() || "",
      ps_price_sale: Number(item.ps_price_sale).toString() || "",
      ps_time_sale_start: formatDateForInput(item.ps_time_sale_start),
      ps_time_sale_end: formatDateForInput(item.ps_time_sale_end),
      ps_status: item.ps_status || "active",
      ps_option_1: item.ps_option_1 || "",
      ps_option_2: item.ps_option_2 || "",
      ps_option_3: item.ps_option_3 || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingItem) return

    const updateData = {
      ps_product_id: parseInt(editFormData.ps_product_id),
      ps_country_id: parseInt(editFormData.ps_country_id),
      ps_price_sale: editFormData.ps_price_sale ? parseFloat(editFormData.ps_price_sale) : null,
      ps_time_sale_start: editFormData.ps_time_sale_start || null,
      ps_time_sale_end: editFormData.ps_time_sale_end || null,
      ps_status: editFormData.ps_status as "active" | "inactive",
      ps_option_1: editFormData.ps_option_1 || null,
      ps_option_2: editFormData.ps_option_2 || null,
      ps_option_3: editFormData.ps_option_3 || null,
    }

    updateMutation.mutate({
      id: editingItem.ps_id,
      item: updateData
    })
  }

  const executePrint = async () => {
    const itemsToPrint = printSelections.filter((item: any) => printingItems.includes(item.ps_id))
    
    // Xác định pId để ghi nhận in
    let pId: string
    if (printingItems.length === printSelections.length) {
      pId = "all"
    } else if (printingItems.length === 1) {
      const selectedItem = printSelections.find((item: any) => printingItems.includes(item.ps_id))
      pId = selectedItem?.ps_id?.toString() || "0"
    } else {
      pId = "all"
    }
    
    // Gọi API để ghi nhận in với body mới
    try {
      const selectedItem = printSelections.find((item: any) => printingItems.includes(item.ps_id))
      
      // Sử dụng khổ in được chọn thay vì map từ định dạng
      const getPlType = () => {
        return selectedPrintSize
      }
      
      const printLogData = {
        pId: pId,
        pl_num: printCopies,
        pl_type: getPlType(),
        pl_time_sale_start: selectedItem?.ps_time_sale_start || new Date().toISOString(),
        pl_time_sale_end: selectedItem?.ps_time_sale_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 ngày từ hiện tại
        pl_log_note: `In ${printCopies} bản với template ${selectedPrintSize.toUpperCase()} - Chất lượng ${selectedPrintQuality}`
      }
      
      await runPrintSelect(printLogData)
    } catch (error) {
      console.error("Lỗi ghi nhận in:", error)
    }
    
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
                      <Label htmlFor="country">Xuất xứ *</Label>
                      <Select value={formData.ps_country_id} onValueChange={(value) => setFormData({...formData, ps_country_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quốc gia" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country: any) => (
                            <SelectItem key={country.country_id} value={country.country_id.toString()}>
                              <div className="flex items-center space-x-2">
                                <span>{getCountryFlag(country.country_code)}</span>
                                <span>{country.country_name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price_sale">Giá khuyến mãi (tùy chọn)</Label>
                    <Input 
                      id="price_sale" 
                      type="number" 
                      placeholder="Nhập giá khuyến mãi (để trống để dùng giá mặc định)" 
                      value={formData.ps_price_sale}
                      onChange={(e) => setFormData({...formData, ps_price_sale: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ps_time_sale_start">Thời gian bắt đầu bán</Label>
                      <Input 
                        id="ps_time_sale_start" 
                        type="date"
                        placeholder="dd/mm/yyyy" 
                        value={formData.ps_time_sale_start}
                        onChange={(e) => setFormData({...formData, ps_time_sale_start: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ps_time_sale_end">Thời gian kết thúc bán</Label>
                      <Input 
                        id="ps_time_sale_end" 
                        type="date"
                        placeholder="dd/mm/yyyy" 
                        value={formData.ps_time_sale_end}
                        onChange={(e) => setFormData({...formData, ps_time_sale_end: e.target.value})}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="config" className="space-y-4">
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
            <div className="text-2xl font-bold text-purple-900">{printStatistics?.overview?.totalPrintLogs}</div>
            <p className="text-xs text-purple-600">Lượt in tổng cộng</p>
            <div className="mt-2">
              <Progress value={85} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Top sản phẩm</CardTitle>
            <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{printStatistics?.topProducts?.[0]?.total_prints || 0} <span className="text-xs text-orange-600">lượt in</span></div>
            <div className="text-xs text-orange-600 mt-1 truncate">
              {printStatistics?.topProducts?.[0]?.product_name || 'N/A'}
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
                        <span className="text-lg">{getCountryFlag(country.country_code)}</span>
                        <span>{country.country_name}</span>
                      </div>
                    </SelectItem>
                  ))}
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
                      {/* <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem> */}
                      <DropdownMenuItem onClick={() => handlePrintSingle(item)}>
                        <Printer className="mr-2 h-4 w-4" />
                        In ngay
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditItem(item)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteItem(item)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
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
                      {item.product?.category?.category_name}
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
                  <div className="text-xs text-muted-foreground">
                    Tổng {item.printCount || 0} lượt in
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Thời gian bán:</span>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <div>{item.ps_time_sale_start ? new Date(item.ps_time_sale_start).toLocaleDateString("vi-VN") : "Chưa thiết lập"}</div>
                    <div>→ {item.ps_time_sale_end ? new Date(item.ps_time_sale_end).toLocaleDateString("vi-VN") : "Chưa thiết lập"}</div>
                  </div>
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
                  <TableHead>Xuất xứ</TableHead>
                  <TableHead>Giá gốc</TableHead>
                  <TableHead>Giá khuyến mãi</TableHead>
                  <TableHead>Thời gian bán</TableHead>
                  <TableHead>Tùy chọn</TableHead>
                  <TableHead>Lượt in</TableHead>
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
                            {item.product?.category?.category_name}
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
                    <TableCell className="font-medium text-gray-600">
                      {formatPrice(item.product?.price, item.country?.country_name)}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatPrice(item.ps_price_sale, item.country?.country_name)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">
                          {item.ps_time_sale_start ? new Date(item.ps_time_sale_start).toLocaleDateString("vi-VN") : "Chưa thiết lập"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          → {item.ps_time_sale_end ? new Date(item.ps_time_sale_end).toLocaleDateString("vi-VN") : "Chưa thiết lập"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.templates?.ps_option_1 || "Không có"}
                        </Badge>
                        {item.templates?.ps_option_2 && (
                          <Badge variant="secondary" className="text-xs">
                            {item.templates.ps_option_2}
                          </Badge>
                        )}
                        {item.templates?.ps_option_3 && (
                          <Badge variant="secondary" className="text-xs">
                            {item.templates.ps_option_3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">
                          Tổng {item.printCount || 0} lượt in
                        </div>
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
                          {/* <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem> */}
                          <DropdownMenuItem onClick={() => handlePrintSingle(item)}>
                            <Printer className="mr-2 h-4 w-4" />
                            In ngay
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditItem(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteItem(item)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deleteMutation.isPending ? "Đang xóa..." : "Xóa khỏi danh sách"}
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
                    {printFormats.map((format: any) => (
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
                <Label htmlFor="print-size">Khổ in</Label>
                <Select value={selectedPrintSize} onValueChange={setSelectedPrintSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">
                      <div className="flex items-center space-x-2">
                        <span>📄</span>
                        <div>
                          <div className="font-medium">A4</div>
                          <div className="text-xs text-muted-foreground">210×297mm</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="a5">
                      <div className="flex items-center space-x-2">
                        <span>📄</span>
                        <div>
                          <div className="font-medium">A5</div>
                          <div className="text-xs text-muted-foreground">148×210mm</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="v1">
                      <div className="flex items-center space-x-2">
                        <span>📋</span>
                        <div>
                          <div className="font-medium">V1</div>
                          <div className="text-xs text-muted-foreground">Khổ tùy chỉnh 1</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="v2">
                      <div className="flex items-center space-x-2">
                        <span>📋</span>
                        <div>
                          <div className="font-medium">V2</div>
                          <div className="text-xs text-muted-foreground">Khổ tùy chỉnh 2</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="v3">
                      <div className="flex items-center space-x-2">
                        <span>📋</span>
                        <div>
                          <div className="font-medium">V3</div>
                          <div className="text-xs text-muted-foreground">Khổ tùy chỉnh 3</div>
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
                      .find((f: any) => f.id === selectedPrintFormat)
                      ?.quality.map((quality: any) => (
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

              <div className="space-y-2">
                <Label>Thông tin in</Label>
                <div className="text-sm text-muted-foreground">
                  <div>Định dạng: PDF</div>
                  <div>Template: {selectedPrintSize.toUpperCase()}</div>
                  <div>Chất lượng: {selectedPrintQuality}</div>
                </div>
              </div>
            </div>

            {/* Thêm vào Print Dialog, sau phần Print Settings */}
            <div className="space-y-2">
              <Label>Xem trước file sẽ tạo</Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Xem trước {printFormats.find((f: any) => f.id === selectedPrintFormat)?.template ? 'PDF' : selectedPrintFormat.toUpperCase()}
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
                        <Badge className="bg-blue-100 text-blue-800">
                          {printFormats.find((f: any) => f.id === selectedPrintFormat)?.template ? 'PDF' : selectedPrintFormat.toUpperCase()}
                        </Badge>
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
                            .map((item: any, index: number) => {
                              // Sử dụng template system mới
                              const templateData = prepareTemplateData(item, formatPrice)
                              const template = getTemplate(selectedPrintSize)
                              const previewHTML = template(templateData)
                              
                              return (
                                <div
                                  key={item.ps_id}
                                  className="max-w-2xl mx-auto bg-white shadow-lg border rounded-lg overflow-hidden"
                                >
                                  <div className="bg-gray-100 p-3 border-b">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="font-medium">Template {selectedPrintSize.toUpperCase()}</span>
                                      <span className="text-gray-500">Trang {index + 1} / {printingItems.length}</span>
                                    </div>
                                  </div>
                                  
                                  <div 
                                    className="bg-gray-50 p-4"
                                    style={{ 
                                      width: '250%', 
                                      height: '1000px', 
                                      overflow: 'auto',
                                      transform: 'scale(0.4)',
                                      transformOrigin: 'top left'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: previewHTML }}
                                  />
                                </div>
                              )
                            })}
                        </div>
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
            {/* <div className="bg-blue-50 p-4 rounded-lg space-y-3">
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
            </div> */}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-slate-900">Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Bạn có chắc chắn muốn xóa sản phẩm <strong>{itemToDelete?.product?.product_name}</strong> khỏi danh sách in?
              <br />
              <span className="text-red-600 font-semibold">⚠️ Hành động này không thể hoàn tác.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {/* Thông tin sản phẩm */}
          {itemToDelete && (
            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-md">
                <Package className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-800">{itemToDelete.product?.product_name}</div>
                <div className="text-sm text-slate-600">Mã: <code className="bg-white px-1 rounded text-slate-700">{itemToDelete.product?.product_code}</code></div>
                <div className="text-sm text-slate-600">Xuất xứ: {itemToDelete.country?.country_name}</div>
                <div className="text-sm text-slate-600">Khổ giấy: {itemToDelete.ps_type}</div>
              </div>
            </div>
          )}

          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel 
              className="rounded-xl"
              disabled={deleteMutation.isPending}
              onClick={() => setItemToDelete(null)}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa sản phẩm
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Chỉnh sửa thông tin in
            </DialogTitle>
            <DialogDescription>Cập nhật thông tin sản phẩm trong danh sách in</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                <TabsTrigger value="config">Cấu hình in</TabsTrigger>
                <TabsTrigger value="preview">Xem trước</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_product">Sản phẩm *</Label>
                    <Select 
                      value={editFormData.ps_product_id} 
                      onValueChange={(value) => setEditFormData({...editFormData, ps_product_id: value})}
                    >
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
                    <Label htmlFor="edit_country">Xuất xứ *</Label>
                    <Select 
                      value={editFormData.ps_country_id} 
                      onValueChange={(value) => setEditFormData({...editFormData, ps_country_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quốc gia" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country: any) => (
                          <SelectItem key={country.country_id} value={country.country_id.toString()}>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{getCountryFlag(country.country_code)}</span>
                              <span>{country.country_name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_price_sale">Giá khuyến mãi (tùy chọn)</Label>
                  <Input 
                    id="edit_price_sale" 
                    type="number" 
                    placeholder="Nhập giá bán (để trống để dùng giá mặc định)" 
                    value={editFormData.ps_price_sale}
                    onChange={(e) => setEditFormData({...editFormData, ps_price_sale: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_ps_time_sale_start">Thời gian bắt đầu bán</Label>
                    <Input 
                      id="edit_ps_time_sale_start" 
                      type="date"
                      placeholder="dd/mm/yyyy" 
                      value={editFormData.ps_time_sale_start}
                      onChange={(e) => setEditFormData({...editFormData, ps_time_sale_start: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_ps_time_sale_end">Thời gian kết thúc bán</Label>
                    <Input 
                      id="edit_ps_time_sale_end" 
                      type="date"
                      placeholder="dd/mm/yyyy" 
                      value={editFormData.ps_time_sale_end}
                      onChange={(e) => setEditFormData({...editFormData, ps_time_sale_end: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="config" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_status">Trạng thái *</Label>
                  <Select 
                    value={editFormData.ps_status} 
                    onValueChange={(value) => setEditFormData({...editFormData, ps_status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Tạm dừng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_ps_option_1">Tùy chọn 1 (tùy chọn)</Label>
                  <Input 
                    id="edit_ps_option_1" 
                    placeholder="Nhập tùy chọn 1" 
                    value={editFormData.ps_option_1}
                    onChange={(e) => setEditFormData({...editFormData, ps_option_1: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_ps_option_2">Tùy chọn 2 (tùy chọn)</Label>
                  <Input 
                    id="edit_ps_option_2" 
                    placeholder="Nhập tùy chọn 2" 
                    value={editFormData.ps_option_2}
                    onChange={(e) => setEditFormData({...editFormData, ps_option_2: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_ps_option_3">Tùy chọn 3 (tùy chọn)</Label>
                  <Input 
                    id="edit_ps_option_3" 
                    placeholder="Nhập tùy chọn 3" 
                    value={editFormData.ps_option_3}
                    onChange={(e) => setEditFormData({...editFormData, ps_option_3: e.target.value})}
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
                disabled={updateMutation.isPending}
                className="mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật thông tin"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
