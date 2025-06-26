"use client"

import { useState } from "react"
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

const printSelections = [
  {
    ps_id: 1,
    product_name: "iPhone 15 Pro Max",
    product_code: "IP15PM001",
    country_name: "Việt Nam",
    country_flag: "🇻🇳",
    ps_price_sale: 29990000,
    ps_type: "a4",
    ps_format: "pdf", // Thêm format
    ps_quality: "High", // Thêm quality
    ps_status: "active",
    created_at: "2024-01-15 10:30:00",
    print_count: 245,
    last_printed: "2024-01-20 14:30:00",
    category: "Điện thoại",
    priority: "high",
  },
  {
    ps_id: 2,
    product_name: "Samsung Galaxy S24 Ultra",
    product_code: "SGS24U001",
    country_name: "Việt Nam",
    country_flag: "🇻🇳",
    ps_price_sale: 31990000,
    ps_type: "a4",
    ps_format: "png", // Thêm format
    ps_quality: "300 DPI", // Thêm quality
    ps_status: "active",
    created_at: "2024-01-14 15:20:00",
    print_count: 189,
    last_printed: "2024-01-19 09:15:00",
    category: "Điện thoại",
    priority: "high",
  },
  {
    ps_id: 3,
    product_name: "MacBook Pro M3",
    product_code: "MBP14M3001",
    country_name: "Hoa Kỳ",
    country_flag: "🇺🇸",
    ps_price_sale: 1999,
    ps_type: "a3",
    ps_format: "jpg", // Thêm format
    ps_quality: "High", // Thêm quality
    ps_status: "inactive",
    created_at: "2024-01-13 09:45:00",
    print_count: 67,
    last_printed: "2024-01-18 16:45:00",
    category: "Laptop",
    priority: "medium",
  },
  {
    ps_id: 4,
    product_name: "iPad Pro 12.9",
    product_code: "IPADPRO129",
    country_name: "Nhật Bản",
    country_flag: "🇯🇵",
    ps_price_sale: 150000,
    ps_type: "a5",
    ps_format: "svg", // Thêm format
    ps_quality: "Optimized", // Thêm quality
    ps_status: "active",
    created_at: "2024-01-12 14:20:00",
    print_count: 134,
    last_printed: "2024-01-21 11:20:00",
    category: "Tablet",
    priority: "low",
  },
]

const products = [
  { product_id: 1, product_name: "iPhone 15 Pro Max", product_code: "IP15PM001", category: "Điện thoại" },
  { product_id: 2, product_name: "Samsung Galaxy S24 Ultra", product_code: "SGS24U001", category: "Điện thoại" },
  { product_id: 3, product_name: "MacBook Pro M3", product_code: "MBP14M3001", category: "Laptop" },
  { product_id: 4, product_name: "iPad Pro 12.9", product_code: "IPADPRO129", category: "Tablet" },
]

const countries = [
  { country_id: 1, country_name: "Việt Nam", country_flag: "🇻🇳", currency: "VND" },
  { country_id: 2, country_name: "Hoa Kỳ", country_flag: "🇺🇸", currency: "USD" },
  { country_id: 3, country_name: "Nhật Bản", country_flag: "🇯🇵", currency: "JPY" },
  { country_id: 4, country_name: "Hàn Quốc", country_flag: "🇰🇷", currency: "KRW" },
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

  const formatPrice = (price: number, country: string) => {
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
      setSelectedItems(printSelections.map((item) => item.ps_id))
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

  const filteredItems = printSelections.filter((item) => {
    const matchesSearch =
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = selectedCountry === "all" || item.country_name === selectedCountry
    const matchesType = selectedType === "all" || item.ps_type === selectedType
    const matchesStatus = selectedStatus === "all" || item.ps_status === selectedStatus

    return matchesSearch && matchesCountry && matchesType && matchesStatus
  })

  const totalPrintCount = printSelections.reduce((sum, item) => sum + item.print_count, 0)
  const activeCount = printSelections.filter((item) => item.ps_status === "active").length
  const a4Count = printSelections.filter((item) => item.ps_type === "a4").length

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
    setPrintingItems(filteredItems.map((item) => item.ps_id))
    setIsPrintDialogOpen(true)
  }

  const executePrint = async () => {
    setPrintProgress(0)
    const itemsToPrint = printSelections.filter((item) => printingItems.includes(item.ps_id))

    for (let i = 0; i < itemsToPrint.length; i++) {
      // Simulate printing process
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setPrintProgress(((i + 1) / itemsToPrint.length) * 100)
    }

    // Reset after completion
    setTimeout(() => {
      setIsPrintDialogOpen(false)
      setPrintProgress(0)
      setPrintingItems([])
    }, 1000)
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
                      <Label htmlFor="product">Sản phẩm</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn sản phẩm" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.product_id} value={product.product_id.toString()}>
                              <div className="flex items-center space-x-2">
                                <span>{product.product_name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {product.category}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Quốc gia</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quốc gia" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
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
                    <Label htmlFor="price_sale">Giá bán</Label>
                    <Input id="price_sale" type="number" placeholder="Nhập giá bán" />
                  </div>
                </TabsContent>
                <TabsContent value="config" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Khổ giấy</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn khổ giấy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a0">A0 (841×1189mm)</SelectItem>
                          <SelectItem value="a1">A1 (594×841mm)</SelectItem>
                          <SelectItem value="a2">A2 (420×594mm)</SelectItem>
                          <SelectItem value="a3">A3 (297×420mm)</SelectItem>
                          <SelectItem value="a4">A4 (210×297mm)</SelectItem>
                          <SelectItem value="a5">A5 (148×210mm)</SelectItem>
                          <SelectItem value="a6">A6 (105×148mm)</SelectItem>
                          <SelectItem value="a7">A7 (74×105mm)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Độ ưu tiên</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn độ ưu tiên" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Cao</SelectItem>
                          <SelectItem value="medium">Trung bình</SelectItem>
                          <SelectItem value="low">Thấp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="format">Định dạng in</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn định dạng" />
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
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quality">Chất lượng</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chất lượng" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="high">High Quality</SelectItem>
                          <SelectItem value="print">Print Quality</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Tạm dừng</SelectItem>
                      </SelectContent>
                    </Select>
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
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Thêm vào danh sách
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
                  {countries.map((country) => (
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

      {/* Cards View */}
      {viewMode === "cards" && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
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
                    {item.product_name}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    <code className="bg-muted px-2 py-1 rounded text-xs">{item.product_code}</code>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.country_name}</span>
                  </div>
                  {getStatusBadge(item.ps_status)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(item.ps_price_sale, item.country_name)}
                    </span>
                  </div>
                  {getTypeBadge(item.ps_type)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Định dạng:</span>
                  </div>
                  {getFormatBadge(item.ps_format)}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Chất lượng:</span>
                  <Badge variant="secondary" className="text-xs">
                    {item.ps_quality}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Lượt in:</span>
                    <span className="font-medium">{item.print_count}</span>
                  </div>
                  <Progress value={(item.print_count / 300) * 100} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  {getPriorityBadge(item.priority)}
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(item.last_printed).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Enhanced Table View */}
      {viewMode === "table" && (
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
                  <TableHead>Định dạng</TableHead>
                  <TableHead>Lượt in</TableHead>
                  <TableHead>Ưu tiên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Lần cuối in</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
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
                        <div className="font-medium">{item.product_name}</div>
                        <div className="flex items-center space-x-2">
                          <code className="bg-muted px-2 py-1 rounded text-xs">{item.product_code}</code>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{item.country_flag}</span>
                        <span>{item.country_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatPrice(item.ps_price_sale, item.country_name)}
                    </TableCell>
                    <TableCell>{getTypeBadge(item.ps_type)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getFormatBadge(item.ps_format)}
                        <div className="text-xs text-muted-foreground">{item.ps_quality}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{item.print_count}</div>
                        <Progress value={(item.print_count / 300) * 100} className="h-1 w-16" />
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                    <TableCell>{getStatusBadge(item.ps_status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(item.last_printed).toLocaleDateString("vi-VN")}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.last_printed).toLocaleTimeString("vi-VN", {
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
                  .filter((item) => printingItems.includes(item.ps_id))
                  .map((item) => (
                    <div key={item.ps_id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{item.country_flag}</span>
                        <span className="font-medium">{item.product_name}</span>
                        <code className="bg-white px-2 py-1 rounded text-xs">{item.product_code}</code>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getFormatBadge(item.ps_format)}
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
                            .filter((item) => printingItems.includes(item.ps_id))
                            .map((item, index) => (
                              <div
                                key={item.ps_id}
                                className="max-w-2xl mx-auto bg-white shadow-lg border rounded-lg p-8"
                              >
                                <div className="space-y-4">
                                  <div className="text-center border-b pb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">THÔNG TIN SẢN PHẨM</h2>
                                    <p className="text-sm text-gray-600 mt-2">
                                      {item.country_flag} Template {item.country_name}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Tên sản phẩm:</label>
                                        <p className="text-lg font-semibold text-gray-800">{item.product_name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Mã sản phẩm:</label>
                                        <p className="font-mono text-gray-800">{item.product_code}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Danh mục:</label>
                                        <p className="text-gray-800">{item.category}</p>
                                      </div>
                                    </div>

                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Giá bán:</label>
                                        <p className="text-xl font-bold text-green-600">
                                          {formatPrice(item.ps_price_sale, item.country_name)}
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
            {printProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Đang in...</span>
                  <span>{Math.round(printProgress)}%</span>
                </div>
                <Progress value={printProgress} className="h-2" />
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
                disabled={printProgress > 0}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {printProgress > 0 ? (
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
