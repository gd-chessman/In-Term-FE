"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Download,
  Calendar,
  Printer,
  FileText,
  Clock,
  Eye,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Package,
  FileCheck,
} from "lucide-react"

// Mock data with enhanced information
const printLogs = [
  {
    pl_id: 1,
    admin_name: "John Doe",
    admin_avatar: "/placeholder.svg?height=32&width=32",
    template_title: "Template Việt Nam - Chuẩn",
    template_country: "VN",
    product_name: "iPhone 15 Pro Max",
    product_code: "IP15PM001",
    product_category: "Smartphone",
    pl_print_time: "2024-01-15 10:30:00",
    pl_log_note: "In thành công 50 bản",
    status: "success",
    print_count: 50,
    duration: "2m 15s",
    file_size: "2.4 MB",
    printer_name: "HP LaserJet Pro M404n",
    ps_format: "pdf",
  },
  {
    pl_id: 2,
    admin_name: "Jane Smith",
    admin_avatar: "/placeholder.svg?height=32&width=32",
    template_title: "Template US - Standard",
    template_country: "US",
    product_name: "Samsung Galaxy S24 Ultra",
    product_code: "SGS24U001",
    product_category: "Smartphone",
    pl_print_time: "2024-01-15 10:25:00",
    pl_log_note: "In thành công 25 bản",
    status: "success",
    print_count: 25,
    duration: "1m 45s",
    file_size: "1.8 MB",
    printer_name: "Canon PIXMA G6020",
    ps_format: "pdf",
  },
  {
    pl_id: 3,
    admin_name: "Mike Johnson",
    admin_avatar: "/placeholder.svg?height=32&width=32",
    template_title: "Template Japan - 標準",
    template_country: "JP",
    product_name: "MacBook Pro M3",
    product_code: "MBP14M3001",
    product_category: "Laptop",
    pl_print_time: "2024-01-15 10:20:00",
    pl_log_note: "Lỗi máy in - Hết giấy",
    status: "error",
    print_count: 0,
    duration: "0m 30s",
    file_size: "3.2 MB",
    printer_name: "Epson EcoTank L3250",
    ps_format: "pdf",
  },
  {
    pl_id: 4,
    admin_name: "Sarah Wilson",
    admin_avatar: "/placeholder.svg?height=32&width=32",
    template_title: "Template Korea - 표준",
    template_country: "KR",
    product_name: "iPad Pro 12.9",
    product_code: "IPADPRO129",
    product_category: "Tablet",
    pl_print_time: "2024-01-15 10:15:00",
    pl_log_note: "In thành công 30 bản",
    status: "success",
    print_count: 30,
    duration: "1m 55s",
    file_size: "2.1 MB",
    printer_name: "Brother HL-L2350DW",
    ps_format: "pdf",
  },
  {
    pl_id: 5,
    admin_name: "David Brown",
    admin_avatar: "/placeholder.svg?height=32&width=32",
    template_title: "Template Việt Nam - Chuẩn",
    template_country: "VN",
    product_name: "AirPods Pro",
    product_code: "AIRPODSPRO",
    product_category: "Audio",
    pl_print_time: "2024-01-15 10:10:00",
    pl_log_note: "Đang xử lý...",
    status: "processing",
    print_count: 0,
    duration: "0m 45s",
    file_size: "1.5 MB",
    printer_name: "HP OfficeJet Pro 9015e",
    ps_format: "pdf",
  },
]

export default function PrintLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "timeline">("table")
  const [selectedLog, setSelectedLog] = useState<any>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Thành công
          </Badge>
        )
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Lỗi
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Đang xử lý
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <XCircle className="w-3 h-3 mr-1" />
            Đã hủy
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const printTime = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - printTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Vừa xong"
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`
  }

  const getCountryFlag = (countryCode: string) => {
    const flags: { [key: string]: string } = {
      VN: "🇻🇳",
      US: "🇺🇸",
      JP: "🇯🇵",
      KR: "🇰🇷",
    }
    return flags[countryCode] || "🏳️"
  }

  const successRate = Math.round((printLogs.filter((log) => log.status === "success").length / printLogs.length) * 100)
  const totalPrintCount = printLogs.reduce((sum, log) => sum + log.print_count, 0)

  // Thay thế function generatePDFFromHTML bằng function mới sử dụng jsPDF với font hỗ trợ tiếng Việt

  const generatePDF = async (log: any) => {
    // Import jsPDF dynamically
    const { jsPDF } = await import("jspdf")

    // Tạo HTML element ẩn với tiếng Việt
    const htmlContent = document.createElement("div")
    htmlContent.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 794px;
      height: 1123px;
      background: white;
      font-family: 'Arial', sans-serif;
      padding: 40px;
      box-sizing: border-box;
    `

    htmlContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px;">
        <h1 style="font-size: 28px; font-weight: bold; color: #1e40af; margin: 0 0 8px 0;">THÔNG TIN SẢN PHẨM</h1>
        <div style="font-size: 16px; color: #6b7280;">${getCountryFlag(log.template_country)} ${log.template_title}</div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
        <div>
          <div style="margin-bottom: 24px;">
            <div style="font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 6px;">TÊN SẢN PHẨM</div>
            <div style="font-size: 16px; color: #111827; font-weight: 500;">${log.product_name}</div>
          </div>
          
          <div style="margin-bottom: 24px;">
            <div style="font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 6px;">MÃ SẢN PHẨM</div>
            <div style="font-family: monospace; background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 14px;">${log.product_code}</div>
          </div>
          
          <div style="margin-bottom: 24px;">
            <div style="font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 6px;">DANH MỤC</div>
            <div style="font-size: 16px; color: #111827; font-weight: 500;">${log.product_category}</div>
          </div>
          
          <div style="margin-bottom: 24px;">
            <div style="font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 6px;">TRẠNG THÁI</div>
            <div style="background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block;">ĐÃ IN THÀNH CÔNG</div>
          </div>
        </div>
        
        <div>
          <div style="margin-bottom: 24px;">
            <div style="font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 6px;">GIÁ BÁN</div>
            <div style="font-size: 24px; color: #059669; font-weight: 700;">${
              log.template_country === "VN"
                ? "29,990,000 VND"
                : log.template_country === "US"
                  ? "$1,999"
                  : log.template_country === "JP"
                    ? "¥299,900"
                    : "₩2,999,000"
            }</div>
          </div>
          
          <div style="margin-bottom: 24px;">
            <div style="font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 6px;">NGÀY IN</div>
            <div style="font-size: 16px; color: #111827; font-weight: 500;">${new Date(
              log.pl_print_time,
            ).toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</div>
          </div>
          
          <div style="margin-bottom: 24px;">
            <div style="font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 6px;">SỐ LƯỢNG IN</div>
            <div style="font-size: 16px; color: #111827; font-weight: 500;">${log.print_count} bản</div>
          </div>
          
          <div style="margin-bottom: 24px;">
            <div style="font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 6px;">THỜI GIAN XỬ LÝ</div>
            <div style="font-size: 16px; color: #111827; font-weight: 500;">${log.duration}</div>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin: 40px 0; padding: 30px; border: 2px dashed #d1d5db; border-radius: 12px; background: #f9fafb;">
        <div style="width: 120px; height: 120px; background: #e5e7eb; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: 600; color: #6b7280; font-size: 14px;">QR CODE</div>
        <div style="color: #6b7280; font-size: 12px;">Mã QR sản phẩm ${log.product_code}</div>
      </div>
      
      <div style="background: #f8fafc; padding: 24px; border-radius: 12px; border-left: 4px solid #3b82f6; margin: 30px 0;">
        <h3 style="font-size: 16px; font-weight: 600; color: #1e40af; margin: 0 0 16px 0;">THÔNG TIN IN ẤN</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <div style="color: #6b7280; font-weight: 500; font-size: 13px;">Kích thước file:</div>
            <div style="color: #111827; font-weight: 600; margin-top: 2px;">${log.file_size}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-weight: 500; font-size: 13px;">Máy in:</div>
            <div style="color: #111827; font-weight: 600; margin-top: 2px;">${log.printer_name}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-weight: 500; font-size: 13px;">Admin thực hiện:</div>
            <div style="color: #111827; font-weight: 600; margin-top: 2px;">${log.admin_name}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-weight: 500; font-size: 13px;">Ghi chú:</div>
            <div style="color: #111827; font-weight: 600; margin-top: 2px;">${log.pl_log_note}</div>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
        <p>© 2024 Company Name. Tất cả quyền được bảo lưu.</p>
        <p>Tài liệu được tạo tự động vào ${new Date().toLocaleString("vi-VN")}</p>
      </div>
    `

    // Thêm vào DOM để render
    document.body.appendChild(htmlContent)

    try {
      // Import html2canvas dynamically
      const html2canvas = (await import("html2canvas")).default

      // Chuyển HTML thành canvas
      const canvas = await html2canvas(htmlContent, {
        width: 794,
        height: 1123,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      // Tạo PDF từ canvas
      const doc = new jsPDF("p", "mm", "a4")
      const imgData = canvas.toDataURL("image/png")

      // Thêm image vào PDF
      doc.addImage(imgData, "PNG", 0, 0, 210, 297)

      // Save PDF
      const fileName = `${log.product_code}_${log.template_country}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error("Lỗi tạo PDF:", error)
      // Fallback về cách cũ nếu html2canvas không hoạt động
      alert("Không thể tạo PDF với tiếng Việt. Vui lòng thử lại!")
    } finally {
      // Xóa element khỏi DOM
      document.body.removeChild(htmlContent)
    }
  }

  const generateImage = async (log: any, format: "png" | "jpg" = "png") => {
    // Create canvas
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Set canvas size (A4 proportions)
    canvas.width = 794 // A4 width in pixels at 96 DPI
    canvas.height = 1123 // A4 height in pixels at 96 DPI

    // White background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Header
    ctx.fillStyle = "#2d3748"
    ctx.font = "bold 32px Arial"
    ctx.textAlign = "center"
    ctx.fillText("THÔNG TIN SẢN PHẨM", canvas.width / 2, 60)

    // Template info
    ctx.fillStyle = "#718096"
    ctx.font = "18px Arial"
    ctx.fillText(`${getCountryFlag(log.template_country)} ${log.template_title}`, canvas.width / 2, 90)

    // Line
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(50, 120)
    ctx.lineTo(canvas.width - 50, 120)
    ctx.stroke()

    // Product info - Left side
    let yPos = 170
    ctx.textAlign = "left"
    ctx.fillStyle = "#4a5568"
    ctx.font = "bold 20px Arial"

    ctx.fillText("Tên sản phẩm:", 60, yPos)
    ctx.font = "18px Arial"
    ctx.fillStyle = "#2d3748"
    ctx.fillText(log.product_name, 60, yPos + 30)

    yPos += 80
    ctx.font = "bold 20px Arial"
    ctx.fillStyle = "#4a5568"
    ctx.fillText("Mã sản phẩm:", 60, yPos)
    ctx.font = "18px Arial"
    ctx.fillStyle = "#2d3748"
    ctx.fillText(log.product_code, 60, yPos + 30)

    yPos += 80
    ctx.font = "bold 20px Arial"
    ctx.fillStyle = "#4a5568"
    ctx.fillText("Danh mục:", 60, yPos)
    ctx.font = "18px Arial"
    ctx.fillStyle = "#2d3748"
    ctx.fillText(log.product_category, 60, yPos + 30)

    // Right side
    yPos = 170
    ctx.font = "bold 20px Arial"
    ctx.fillStyle = "#4a5568"
    ctx.fillText("Giá bán:", 420, yPos)
    ctx.font = "bold 24px Arial"
    ctx.fillStyle = "#22c55e"
    const price =
      log.template_country === "VN"
        ? "29,990,000 VND"
        : log.template_country === "US"
          ? "$1,999"
          : log.template_country === "JP"
            ? "¥299,900"
            : "₩2,999,000"
    ctx.fillText(price, 420, yPos + 35)

    yPos += 80
    ctx.font = "bold 20px Arial"
    ctx.fillStyle = "#4a5568"
    ctx.fillText("Ngày in:", 420, yPos)
    ctx.font = "18px Arial"
    ctx.fillStyle = "#2d3748"
    ctx.fillText(new Date(log.pl_print_time).toLocaleDateString("vi-VN"), 420, yPos + 30)

    yPos += 80
    ctx.font = "bold 20px Arial"
    ctx.fillStyle = "#4a5568"
    ctx.fillText("Số lượng in:", 420, yPos)
    ctx.font = "18px Arial"
    ctx.fillStyle = "#2d3748"
    ctx.fillText(`${log.print_count} bản`, 420, yPos + 30)

    // QR Code placeholder
    yPos += 100
    ctx.strokeStyle = "#cbd5e0"
    ctx.lineWidth = 2
    ctx.strokeRect(canvas.width / 2 - 60, yPos, 120, 120)
    ctx.fillStyle = "#a0aec0"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("QR CODE", canvas.width / 2, yPos + 65)
    ctx.font = "12px Arial"
    ctx.fillText("Mã QR sản phẩm", canvas.width / 2, yPos + 140)

    // Print info
    yPos += 180
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(50, yPos)
    ctx.lineTo(canvas.width - 50, yPos)
    ctx.stroke()

    yPos += 30
    ctx.textAlign = "left"
    ctx.fillStyle = "#718096"
    ctx.font = "14px Arial"
    ctx.fillText("Thông tin in:", 60, yPos)
    ctx.fillText(`Thời gian xử lý: ${log.duration}`, 60, yPos + 25)
    ctx.fillText(`Kích thước file: ${log.file_size}`, 60, yPos + 50)
    ctx.fillText(`Máy in: ${log.printer_name}`, 420, yPos + 25)
    ctx.fillText(`Admin: ${log.admin_name}`, 420, yPos + 50)

    // Footer
    yPos += 80
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(50, yPos)
    ctx.lineTo(canvas.width - 50, yPos)
    ctx.stroke()

    ctx.fillStyle = "#a0aec0"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText("© 2024 Company Name. Tất cả quyền được bảo lưu.", canvas.width / 2, yPos + 25)

    // Convert to blob and download
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `${log.product_code}_${log.template_country}.${format}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
      },
      `image/${format}`,
      0.9,
    )
  }

  // Cập nhật function downloadFile để sử dụng generatePDF thay vì generatePDFFromHTML
  const downloadFile = async (log: any) => {
    const format = log.ps_format || "pdf"

    switch (format) {
      case "pdf":
        await generatePDF(log)
        break
      case "png":
        await generateImage(log, "png")
        break
      case "jpg":
      case "jpeg":
        await generateImage(log, "jpg")
        break
      default:
        // Fallback to JSON for other formats
        const jsonData = {
          product: {
            name: log.product_name,
            code: log.product_code,
            category: log.product_category,
          },
          template: {
            title: log.template_title,
            country: log.template_country,
            flag: getCountryFlag(log.template_country),
          },
          price: {
            amount:
              log.template_country === "VN"
                ? 29990000
                : log.template_country === "US"
                  ? 1999
                  : log.template_country === "JP"
                    ? 299900
                    : 2999000,
            currency:
              log.template_country === "VN"
                ? "VND"
                : log.template_country === "US"
                  ? "USD"
                  : log.template_country === "JP"
                    ? "JPY"
                    : "KRW",
            formatted:
              log.template_country === "VN"
                ? "29,990,000 VND"
                : log.template_country === "US"
                  ? "$1,999"
                  : log.template_country === "JP"
                    ? "¥299,900"
                    : "₩2,999,000",
          },
          print_info: {
            date: log.pl_print_time,
            count: log.print_count,
            duration: log.duration,
            file_size: log.file_size,
            printer: log.printer_name,
            admin: log.admin_name,
          },
          metadata: {
            generated_at: new Date().toISOString(),
            format: format,
            version: "1.0",
          },
        }

        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${log.product_code}_${log.template_country}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        break
    }
  }

  const downloadMultipleFiles = async (logs: any[]) => {
    for (let i = 0; i < logs.length; i++) {
      await downloadFile(logs[i])
      // Delay between downloads
      if (i < logs.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Lịch sử In
          </h1>
          <p className="text-muted-foreground">Theo dõi tất cả hoạt động in ấn trong hệ thống</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="bg-green-50 border-green-200 hover:bg-green-100 w-full sm:w-auto"
            onClick={() => downloadMultipleFiles(printLogs.filter((log) => log.status === "success"))}
          >
            <Download className="mr-2 h-4 w-4 text-green-600" />
            Tải tất cả PDF
          </Button>
          <Button variant="outline" className="bg-blue-50 border-blue-200 hover:bg-blue-100 w-full sm:w-auto">
            <Calendar className="mr-2 h-4 w-4 text-blue-600" />
            Chọn khoảng thời gian
          </Button>
          <Button variant="outline" className="bg-purple-50 border-purple-200 hover:bg-purple-100 w-full sm:w-auto">
            <BarChart3 className="mr-2 h-4 w-4 text-purple-600" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Tổng lượt in</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Printer className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{printLogs.length}</div>
            <div className="flex items-center text-xs text-blue-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              Hôm nay
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Thành công</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {printLogs.filter((log) => log.status === "success").length}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-green-600">{successRate}% tổng số</span>
              <Progress value={successRate} className="w-16 h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Lỗi</CardTitle>
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {printLogs.filter((log) => log.status === "error").length}
            </div>
            <p className="text-xs text-red-600 mt-1">Cần xử lý</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Đang xử lý</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {printLogs.filter((log) => log.status === "processing").length}
            </div>
            <p className="text-xs text-yellow-600 mt-1">Đang chờ</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Admin hoạt động</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <User className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {new Set(printLogs.map((log) => log.admin_name)).size}
            </div>
            <p className="text-xs text-purple-600 mt-1">Đã in hôm nay</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700">Tổng bản in</CardTitle>
            <div className="p-2 bg-indigo-100 rounded-full">
              <FileCheck className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900">{totalPrintCount}</div>
            <p className="text-xs text-indigo-600 mt-1">Bản in thành công</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="backdrop-blur-sm bg-white/80 border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Tìm kiếm & Lọc</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <FileText className="w-4 h-4 mr-1" />
                Bảng
              </Button>
              <Button
                variant={viewMode === "timeline" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("timeline")}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Clock className="w-4 h-4 mr-1" />
                Timeline
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo admin, sản phẩm, template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-white/50 backdrop-blur-sm"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[150px] bg-white/50 backdrop-blur-sm">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="success">Thành công</SelectItem>
                <SelectItem value="error">Lỗi</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px] bg-white/50 backdrop-blur-sm">
                <SelectValue placeholder="Admin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {Array.from(new Set(printLogs.map((log) => log.admin_name))).map((admin) => (
                  <SelectItem key={admin} value={admin}>
                    {admin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px] bg-white/50 backdrop-blur-sm">
                <SelectValue placeholder="Quốc gia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="VN">{getCountryFlag("VN")} Việt Nam</SelectItem>
                <SelectItem value="US">{getCountryFlag("US")} United States</SelectItem>
                <SelectItem value="JP">{getCountryFlag("JP")} Japan</SelectItem>
                <SelectItem value="KR">{getCountryFlag("KR")} Korea</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Print Logs Display */}
      {viewMode === "table" ? (
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Lịch sử in chi tiết
            </CardTitle>
            <CardDescription>Hiển thị {printLogs.length} hoạt động in gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {printLogs.map((log) => (
                  <TableRow key={log.pl_id} className="hover:bg-blue-50/50 transition-all duration-200">
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{new Date(log.pl_print_time).toLocaleString("vi-VN")}</div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {getTimeAgo(log.pl_print_time)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={log.admin_avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-blue-500 text-white text-xs">
                            {log.admin_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{log.admin_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-gray-100 rounded">
                          <Package className="w-3 h-3 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{log.product_name}</div>
                          <div className="text-sm text-muted-foreground font-mono">{log.product_code}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCountryFlag(log.template_country)}</span>
                        <div className="max-w-xs truncate text-sm">{log.template_title}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{log.print_count}</span>
                        {log.print_count > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {log.duration}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                Chi tiết lịch sử in #{log.pl_id}
                              </DialogTitle>
                              <DialogDescription>Thông tin chi tiết về hoạt động in này</DialogDescription>
                            </DialogHeader>
                            {selectedLog && (
                              <Tabs defaultValue="details" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="details">Chi tiết</TabsTrigger>
                                  <TabsTrigger value="technical">Kỹ thuật</TabsTrigger>
                                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                                </TabsList>
                                <TabsContent value="details" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Admin thực hiện</label>
                                      <div className="flex items-center space-x-2">
                                        <Avatar className="h-8 w-8">
                                          <AvatarImage src={selectedLog.admin_avatar || "/placeholder.svg"} />
                                          <AvatarFallback className="bg-blue-500 text-white text-xs">
                                            {selectedLog.admin_name
                                              .split(" ")
                                              .map((n: string) => n[0])
                                              .join("")}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span>{selectedLog.admin_name}</span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Trạng thái</label>
                                      <div>{getStatusBadge(selectedLog.status)}</div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Sản phẩm</label>
                                      <div>
                                        <div className="font-medium">{selectedLog.product_name}</div>
                                        <div className="text-sm text-muted-foreground font-mono">
                                          {selectedLog.product_code}
                                        </div>
                                        <Badge variant="outline" className="mt-1">
                                          {selectedLog.product_category}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Template</label>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-lg">{getCountryFlag(selectedLog.template_country)}</span>
                                        <span className="text-sm">{selectedLog.template_title}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Ghi chú</label>
                                    <div className="p-3 bg-gray-50 rounded-md text-sm">{selectedLog.pl_log_note}</div>
                                  </div>
                                </TabsContent>
                                <TabsContent value="technical" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Số lượng in</label>
                                      <div className="text-2xl font-bold text-blue-600">{selectedLog.print_count}</div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Thời gian xử lý</label>
                                      <div className="text-lg font-semibold">{selectedLog.duration}</div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Kích thước file</label>
                                      <div className="text-lg font-semibold">{selectedLog.file_size}</div>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Máy in</label>
                                      <div className="flex items-center space-x-2">
                                        <Printer className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm">{selectedLog.printer_name}</span>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                                <TabsContent value="timeline" className="space-y-4">
                                  <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                      <div className="text-sm">
                                        <span className="font-medium">Bắt đầu in:</span> {selectedLog.pl_print_time}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      <div className="text-sm">
                                        <span className="font-medium">Hoàn thành:</span>{" "}
                                        {selectedLog.status === "success" ? "Thành công" : "Có lỗi xảy ra"}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                      <div className="text-sm">
                                        <span className="font-medium">Tổng thời gian:</span> {selectedLog.duration}
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* Nút download trực tiếp */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => downloadFile(log)}
                          title={`In file ${log.ps_format?.toUpperCase() || "PDF"} tiếng Việt`}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-600" />
              Timeline View
            </CardTitle>
            <CardDescription>Xem hoạt động in theo thời gian</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {printLogs.map((log, index) => (
                <div
                  key={log.pl_id}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-white hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        log.status === "success"
                          ? "bg-green-500"
                          : log.status === "error"
                            ? "bg-red-500"
                            : log.status === "processing"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                      }`}
                    ></div>
                    {index < printLogs.length - 1 && <div className="w-px h-16 bg-gray-200 mt-2"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={log.admin_avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-blue-500 text-white text-xs">
                            {log.admin_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{log.admin_name}</div>
                          <div className="text-sm text-muted-foreground">{getTimeAgo(log.pl_print_time)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(log.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => downloadFile(log)}
                          title={`In file ${log.ps_format?.toUpperCase() || "PDF"} tiếng Việt`}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">{getCountryFlag(log.template_country)}</span>
                        <span>{log.product_name}</span>
                      </div>
                      <div className="text-muted-foreground">•</div>
                      <div>{log.print_count} bản in</div>
                      <div className="text-muted-foreground">•</div>
                      <div>{log.duration}</div>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{log.pl_log_note}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
