"use client"

import React, { useState, useRef, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { createPrintSelect, getPrintSelects, getPrintTemplates, deletePrintSelect, updatePrintSelect, runPrintSelect, getPrintStatistics, updatePrintSelectNum } from "@/services/PrintService"
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
// import { formatPrice } from "@/utils/common"
import { useLang } from "@/lang/useLang"



export default function PrintSelectPage() {
  const { t } = useLang()
  const searchParams = useSearchParams()
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
    ps_template_id: "",
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
  const [selectedPrintFormat, setSelectedPrintFormat] = useState("")

  const [selectedPrintSize, setSelectedPrintSize] = useState("a4")
  const [printCopies, setPrintCopies] = useState(1)
  const [selectedPrintCopies, setSelectedPrintCopies] = useState(1)
  const [printNote, setPrintNote] = useState("")
  const [isEditNumDialogOpen, setIsEditNumDialogOpen] = useState(false)
  const [editingNumData, setEditingNumData] = useState({
    pn_select_id: 0,
    pn_type: "",
    pn_num: 0
  })
  const [editingAllNums, setEditingAllNums] = useState({
    pn_select_id: 0,
    a4: 1,
    a5: 1,
    v1: 1,
    v2: 1,
    v3: 1,
    i4: 1
  })
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [focusCountryField, setFocusCountryField] = useState(false)
  const [focusPriceField, setFocusPriceField] = useState(false)
  const [focusTimeField, setFocusTimeField] = useState(false)
  const [focusOptionField, setFocusOptionField] = useState(false)
  const [isCountrySelectOpen, setIsCountrySelectOpen] = useState(false)
  const [activeEditTab, setActiveEditTab] = useState("basic")
  const countrySelectRef = useRef<HTMLButtonElement>(null)


  // Form state for creating print selection
  const [formData, setFormData] = useState({
    ps_product_id: "",
    ps_template_id: "",
    ps_price_sale: "",
    ps_time_sale_start: "",
    ps_time_sale_end: "",
    ps_status: "active",
    ps_option_1: "",
    ps_option_2: "",
    ps_option_3: "",
  })

  const queryClient = useQueryClient()

  // Đọc search parameter từ URL khi component mount
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

  // Fetch print selections, products and countries
  const { data: printSelections = [], isLoading: isLoadingPrintSelections } = useQuery({
    queryKey: ["printSelects"],
    queryFn: getPrintSelects,
  })

  const { data: productsData = { products: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } } } = useQuery({
    queryKey: ["products", productSearchTerm],
    queryFn: () => getProducts({
      limit: 100,
      search: productSearchTerm || undefined
    }),
  })

  const products = productsData.products || []

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

  // Create print formats from templates
  const printFormats = printTemplates.map((template: any) => ({
    id: template.pt_id.toString(),
    name: template.pt_title,
    icon: "📄",
    description: t('printSelect.templateFor', { country: template.country?.country_name }),
    template: template
  }))

  // Create print selection mutation
  const createMutation = useMutation({
    mutationFn: createPrintSelect,
    onSuccess: () => {
      toast.success(t('printSelect.toasts.addSuccess'))
      setIsCreateDialogOpen(false)
      setFormData({
        ps_product_id: "",
        ps_template_id: "",
        ps_price_sale: "",
        ps_time_sale_start: "",
        ps_time_sale_end: "",
        ps_status: "active",
        ps_option_1: "",
        ps_option_2: "",
        ps_option_3: "",
      })
      setProductSearchTerm("")
      // Refresh data if needed
      queryClient.invalidateQueries({ queryKey: ["printSelects"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('printSelect.toasts.addError'))
    },
  })

  // Delete print selection mutation
  const deleteMutation = useMutation({
    mutationFn: deletePrintSelect,
    onSuccess: () => {
      toast.success(t('printSelect.toasts.deleteSuccess'))
      queryClient.invalidateQueries({ queryKey: ["printSelects"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('printSelect.toasts.deleteError'))
    },
  })

  // Update print selection mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, item }: { id: number; item: any }) => updatePrintSelect(id, item),
    onSuccess: () => {
      toast.success(t('printSelect.toasts.updateSuccess'))
      setIsEditDialogOpen(false)
      setEditingItem(null)
      setEditFormData({
        ps_product_id: "",
        ps_template_id: "",
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
      toast.error(error?.response?.data?.message || t('printSelect.toasts.updateError'))
    },
  })

  // Update print number mutation
  const updateNumMutation = useMutation({
    mutationFn: updatePrintSelectNum,
    onSuccess: () => {
      toast.success(t('printSelect.toasts.updateNumSuccess'))
      setIsEditNumDialogOpen(false)
      setEditingNumData({
        pn_select_id: 0,
        pn_type: "",
        pn_num: 0
      })
      queryClient.invalidateQueries({ queryKey: ["printSelects"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('printSelect.toasts.updateNumError'))
    },
  })

  // Print mutation - In trực tiếp với máy in
  const printMutation = useMutation({
    mutationFn: async (printData: any) => {
      const { items, format, quality, copies } = printData
      
      // Debug log
      console.log('Debug - mutation copies:', copies)
      console.log('Debug - mutation items:', items)
      
      // Tìm template được chọn
      const selectedTemplate = printFormats.find((f: any) => f.id === format)?.template
      
      // Tạo nội dung HTML để in
      const html = generatePDFContent(items, quality, copies, selectedTemplate);
      
      // Tạo iframe ẩn để in
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'absolute';
      printFrame.style.left = '-9999px';
      printFrame.style.top = '-9999px';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = 'none';
      
      document.body.appendChild(printFrame);
      
      // Ghi nội dung HTML vào iframe
      const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(html);
        frameDoc.close();
        
        // Đợi một chút để nội dung load xong
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In trực tiếp
        printFrame.contentWindow?.print();
        
        // Xóa iframe sau khi in
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 2000);
      }
      
      return { success: true, message: t('printSelect.toasts.printSuccess') };
    },
    onSuccess: (data) => {
      toast.success(t('printSelect.toasts.printSuccessWithCheck'))
      setIsPrintDialogOpen(false)
      setPrintProgress(0)
      setPrintingItems([])
    },
    onError: (error: any) => {
      toast.error(t('printSelect.toasts.printError'))
    },
  })

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.ps_product_id || !formData.ps_template_id) {
      toast.error(t('printSelect.toasts.requiredFields'))
      return
    }

    const submitData = {
      ps_product_id: parseInt(formData.ps_product_id),
      ps_template_id: parseInt(formData.ps_template_id),
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
        return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">{t('printSelect.status.active')}</Badge>
      case "inactive":
        return <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0">{t('printSelect.status.inactive')}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">{t('printSelect.priority.high')}</Badge>
      case "medium":
        return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">{t('printSelect.priority.medium')}</Badge>
      case "low":
        return <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">{t('printSelect.priority.low')}</Badge>
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

  // Hàm format giá với currency symbol đúng vị trí
  const formatPriceWithCurrency = (price: number, currencySymbol: string = '$') => {
    if (!price) return '0'
    
    // Danh sách các currency symbol đặt trước giá
    const prefixCurrencies = ['$', '€', '£', '¥', '₩', '₽', '₹', '₪', '₦', '₨', '₱', '₴', '₸', '₺', '₼', '₾', '₿', '¢', '₡', '₢', '₣', '₤', '₥', '₧', '₭', '₮', '₯', '₰', '₲', '₳', '₵', '₶', '₷', '₻']
    
    const formattedPrice = price.toLocaleString('en-US')
    
    // Kiểm tra xem currency symbol có nên đặt trước hay sau giá
    if (prefixCurrencies.includes(currencySymbol)) {
      return `${currencySymbol}${formattedPrice}` // VD: $1,234.56, €1,234.56
    } else {
      return `${formattedPrice} ${currencySymbol}` // VD: 1,234.56 VND, 1,234.56 CZK
    }
  }



  const generatePDFContent = (items: any[], quality: string, copies: number, template?: any) => {
    // Debug log
    console.log('Debug - generatePDFContent copies:', copies)
    console.log('Debug - generatePDFContent items length:', items.length)
    
    // Tạo nội dung HTML với số bản in đúng cho từng sản phẩm
    let htmlContent = ''
    
    items.forEach((item, itemIndex) => {
      // Lấy số lượng in cho sản phẩm này
      const itemCopies = item.printNums?.find((pn: any) => pn.pn_type === selectedPrintSize)?.pn_num || 1
      console.log(`Debug - item ${itemIndex + 1} has ${itemCopies} copies`)
      
      // Tạo template data cho sản phẩm này
      const templateData = prepareTemplateData(item)
      
      // Tạo nhiều bản in cho sản phẩm này
      for (let copyIndex = 0; copyIndex < itemCopies; copyIndex++) {
        console.log(`Debug - generating item ${itemIndex + 1}, copy ${copyIndex + 1}/${itemCopies}`)
        htmlContent += generateMultipleProductsHTML(selectedPrintSize, [templateData])
        
        // Thêm page break giữa các bản in (trừ bản cuối của sản phẩm cuối)
        if (copyIndex < itemCopies - 1 || itemIndex < items.length - 1) {
          htmlContent += '<div style="page-break-after: always;"></div>'
        }
      }
    })
    
    console.log('Debug - total HTML length:', htmlContent.length)
    return htmlContent
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
    if (item.ps_status !== "active") {
      toast.error(t('printSelect.toasts.cannotPrintProduct', { 
        productName: item.product?.product_name,
        status: item.ps_status === "inactive" ? t('printSelect.status.inactive') : item.ps_status 
      }))
      return
    }
    
    setPrintingItems([item.ps_id])
    // Lấy số lượng in từ cấu hình theo khổ giấy được chọn
    const printNum = item.printNums?.find((pn: any) => pn.pn_type === selectedPrintSize)?.pn_num || 1
    setSelectedPrintCopies(printNum)
    setPrintNote("") // Reset ghi chú
    setIsPrintDialogOpen(true)
  }

  const handlePrintSelected = () => {
    if (selectedItems.length === 0) return
    
    // Kiểm tra trạng thái của tất cả sản phẩm được chọn
    const selectedItemsData = printSelections.filter((item: any) => selectedItems.includes(item.ps_id))
    const inactiveItems = selectedItemsData.filter((item: any) => item.ps_status !== "active")
    
    if (inactiveItems.length > 0) {
      const inactiveNames = inactiveItems.map((item: any) => item.product?.product_name).join(", ")
      toast.error(`Không thể in các sản phẩm sau vì trạng thái không hoạt động: ${inactiveNames}`)
      return
    }
    
    setPrintingItems(selectedItems)
    // Lấy số lượng in từ cấu hình của sản phẩm đầu tiên được chọn
    const firstSelectedItem = printSelections.find((item: any) => selectedItems.includes(item.ps_id))
    const printNum = firstSelectedItem?.printNums?.find((pn: any) => pn.pn_type === selectedPrintSize)?.pn_num || 1
    setSelectedPrintCopies(printNum)
    setPrintNote("") // Reset ghi chú
    setIsPrintDialogOpen(true)
  }

  const handlePrintAll = () => {
    // Kiểm tra trạng thái của tất cả sản phẩm được lọc
    const activeItems = filteredItems.filter((item: any) => item.ps_status === "active")
    const inactiveItems = filteredItems.filter((item: any) => item.ps_status !== "active")
    
    if (inactiveItems.length > 0) {
      const inactiveNames = inactiveItems.map((item: any) => item.product?.product_name).join(", ")
      toast.error(`Không thể in các sản phẩm sau vì trạng thái không hoạt động: ${inactiveNames}`)
      return
    }
    
    setPrintingItems(filteredItems.map((item: any) => item.ps_id))
    // Tính tổng số lượng in thực tế của tất cả sản phẩm
    const totalCopies = filteredItems.reduce((total: number, item: any) => {
      const printNum = item.printNums?.find((pn: any) => pn.pn_type === selectedPrintSize)?.pn_num || 1
      return total + printNum
    }, 0)
    setSelectedPrintCopies(totalCopies)
    setPrintNote("") // Reset ghi chú
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
      ps_template_id: item.ps_template_id?.toString() || "",
      ps_price_sale: Number(item.ps_price_sale).toString() || "",
      ps_time_sale_start: formatDateForInput(item.ps_time_sale_start),
      ps_time_sale_end: formatDateForInput(item.ps_time_sale_end),
      ps_status: item.ps_status || "active",
      ps_option_1: item.templates?.ps_option_1 || "",
      ps_option_2: item.templates?.ps_option_2 || "",
      ps_option_3: item.templates?.ps_option_3 || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleEditItemFromCountry = (item: any) => {
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
      ps_template_id: item.ps_template_id?.toString() || "",
      ps_price_sale: Number(item.ps_price_sale).toString() || "",
      ps_time_sale_start: formatDateForInput(item.ps_time_sale_start),
      ps_time_sale_end: formatDateForInput(item.ps_time_sale_end),
      ps_status: item.ps_status || "active",
      ps_option_1: item.templates?.ps_option_1 || "",
      ps_option_2: item.templates?.ps_option_2 || "",
      ps_option_3: item.templates?.ps_option_3 || "",
    })
    setFocusCountryField(true)
    setActiveEditTab("basic")
    setIsEditDialogOpen(true)
  }

  const handleEditItemFromPrice = (item: any) => {
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
      ps_template_id: item.ps_template_id?.toString() || "",
      ps_price_sale: Number(item.ps_price_sale).toString() || "",
      ps_time_sale_start: formatDateForInput(item.ps_time_sale_start),
      ps_time_sale_end: formatDateForInput(item.ps_time_sale_end),
      ps_status: item.ps_status || "active",
      ps_option_1: item.templates?.ps_option_1 || "",
      ps_option_2: item.templates?.ps_option_2 || "",
      ps_option_3: item.templates?.ps_option_3 || "",
    })
    setFocusPriceField(true)
    setActiveEditTab("basic")
    setIsEditDialogOpen(true)
  }

  const handleEditItemFromTime = (item: any) => {
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
      ps_template_id: item.ps_template_id?.toString() || "",
      ps_price_sale: Number(item.ps_price_sale).toString() || "",
      ps_time_sale_start: formatDateForInput(item.ps_time_sale_start),
      ps_time_sale_end: formatDateForInput(item.ps_time_sale_end),
      ps_status: item.ps_status || "active",
      ps_option_1: item.templates?.ps_option_1 || "",
      ps_option_2: item.templates?.ps_option_2 || "",
      ps_option_3: item.templates?.ps_option_3 || "",
    })
    setFocusTimeField(true)
    setActiveEditTab("basic")
    setIsEditDialogOpen(true)
  }

  const handleEditItemFromOption = (item: any) => {
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
      ps_template_id: item.ps_template_id?.toString() || "",
      ps_price_sale: Number(item.ps_price_sale).toString() || "",
      ps_time_sale_start: formatDateForInput(item.ps_time_sale_start),
      ps_time_sale_end: formatDateForInput(item.ps_time_sale_end),
      ps_status: item.ps_status || "active",
      ps_option_1: item.templates?.ps_option_1 || "",
      ps_option_2: item.templates?.ps_option_2 || "",
      ps_option_3: item.templates?.ps_option_3 || "",
    })
    setFocusOptionField(true)
    setActiveEditTab("config")
    setIsEditDialogOpen(true)
  }

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingItem) return

    const updateData = {
      ps_product_id: parseInt(editFormData.ps_product_id),
      ps_template_id: parseInt(editFormData.ps_template_id),
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

  const handleEditNum = (item: any, type: string) => {
    // Luôn mở dialog với tất cả 5 trường
    setEditingAllNums({
      pn_select_id: item.ps_id,
      a4: item.printNums?.find((pn: any) => pn.pn_type === 'a4')?.pn_num || 1,
      a5: item.printNums?.find((pn: any) => pn.pn_type === 'a5')?.pn_num || 1,
      v1: item.printNums?.find((pn: any) => pn.pn_type === 'v1')?.pn_num || 1,
      v2: item.printNums?.find((pn: any) => pn.pn_type === 'v2')?.pn_num || 1,
      v3: item.printNums?.find((pn: any) => pn.pn_type === 'v3')?.pn_num || 1,
      i4: item.printNums?.find((pn: any) => pn.pn_type === 'i4')?.pn_num || 1
    })
    setIsEditNumDialogOpen(true)
  }

  const handleUpdateNumSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingNumData.pn_num < 1) {
      toast.error(t('printSelect.toasts.minQuantity'))
      return
    }

    updateNumMutation.mutate(editingNumData)
  }

  // Hàm tính tổng số trang thực tế
  const calculateTotalPages = () => {
    const itemsToPrint = printSelections.filter((item: any) => printingItems.includes(item.ps_id))
    return itemsToPrint.reduce((total: number, item: any) => {
      const printNum = item.printNums?.find((pn: any) => pn.pn_type === selectedPrintSize)?.pn_num || 1
      return total + printNum
    }, 0)
  }

  // Effect để tự động cập nhật số lượng in và định dạng in khi thay đổi khổ giấy hoặc sản phẩm
  React.useEffect(() => {
    if (printingItems.length > 0) {
      const firstItem = printSelections.find((item: any) => printingItems.includes(item.ps_id))
      if (firstItem) {
        // Cập nhật số lượng in
        const printNum = firstItem.printNums?.find((pn: any) => pn.pn_type === selectedPrintSize)?.pn_num || 1
        setSelectedPrintCopies(printNum)
        
        // Tự động chọn định dạng in dựa trên mẫu in quốc gia của sản phẩm
        const matchingTemplate = printTemplates.find((template: any) => template.pt_country_id === firstItem.ps_country_id)
        if (matchingTemplate) {
          setSelectedPrintFormat(matchingTemplate.pt_id.toString())
        }
      }
    }
  }, [selectedPrintSize, printingItems, printSelections, printTemplates])

  // Effect để focus vào trường Mẫu in quốc gia khi mở dialog từ click vào cột quốc gia
  useEffect(() => {
    if (isEditDialogOpen && focusCountryField) {
      setTimeout(() => {
        setIsCountrySelectOpen(true)
        setFocusCountryField(false)
      }, 300)
    }
  }, [isEditDialogOpen, focusCountryField])

  // Effect để focus vào trường Giá khuyến mãi
  useEffect(() => {
    if (isEditDialogOpen && focusPriceField) {
      setTimeout(() => {
        const priceInput = document.getElementById('edit_price_sale') as HTMLInputElement
        if (priceInput) {
          priceInput.focus()
          priceInput.select()
        }
        setFocusPriceField(false)
      }, 300)
    }
  }, [isEditDialogOpen, focusPriceField])

  // Effect để focus vào trường Thời gian bán
  useEffect(() => {
    if (isEditDialogOpen && focusTimeField) {
      setTimeout(() => {
        const timeInput = document.getElementById('edit_ps_time_sale_start') as HTMLInputElement
        if (timeInput) {
          timeInput.focus()
        }
        setFocusTimeField(false)
      }, 300)
    }
  }, [isEditDialogOpen, focusTimeField])

  // Effect để focus vào trường Tùy chọn
  useEffect(() => {
    if (isEditDialogOpen && focusOptionField) {
      setTimeout(() => {
        // Đợi tab config được render xong
        const optionInput = document.getElementById('edit_ps_option_1') as HTMLInputElement
        if (optionInput) {
          optionInput.focus()
          optionInput.select()
        }
        setFocusOptionField(false)
      }, 600)
    }
  }, [isEditDialogOpen, focusOptionField, activeEditTab])

  const handleUpdateAllNumsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Kiểm tra số lượng âm
    if (editingAllNums.a4 < 0 || editingAllNums.a5 < 0 || editingAllNums.v1 < 0 || 
        editingAllNums.v2 < 0 || editingAllNums.v3 < 0 || editingAllNums.i4 < 0) {
      toast.error(t('printSelect.toasts.negativeQuantity'))
      return
    }

    // Update each type
    const updates = []
    if (editingAllNums.a4 > 0) updates.push({ pn_select_id: editingAllNums.pn_select_id, pn_type: 'a4', pn_num: editingAllNums.a4 })
    if (editingAllNums.a5 > 0) updates.push({ pn_select_id: editingAllNums.pn_select_id, pn_type: 'a5', pn_num: editingAllNums.a5 })
    if (editingAllNums.v1 > 0) updates.push({ pn_select_id: editingAllNums.pn_select_id, pn_type: 'v1', pn_num: editingAllNums.v1 })
    if (editingAllNums.v2 > 0) updates.push({ pn_select_id: editingAllNums.pn_select_id, pn_type: 'v2', pn_num: editingAllNums.v2 })
    if (editingAllNums.v3 > 0) updates.push({ pn_select_id: editingAllNums.pn_select_id, pn_type: 'v3', pn_num: editingAllNums.v3 })
    if (editingAllNums.i4 > 0) updates.push({ pn_select_id: editingAllNums.pn_select_id, pn_type: 'i4', pn_num: editingAllNums.i4 })

    // Execute all updates
    Promise.all(updates.map(update => updateNumMutation.mutateAsync(update)))
      .then(() => {
        toast.success(t('printSelect.toasts.updateAllNumSuccess'))
        setIsEditNumDialogOpen(false)
        setEditingAllNums({
        pn_select_id: 0,
        a4: 1,
        a5: 1,
        v1: 1,
        v2: 1,
        v3: 1,
        i4: 1
      })
        queryClient.invalidateQueries({ queryKey: ["printSelects"] })
      })
      .catch((error) => {
        toast.error(t('printSelect.toasts.updateAllNumError'))
      })
  }



  const executePrint = async () => {
    const itemsToPrint = printSelections.filter((item: any) => printingItems.includes(item.ps_id))
    
    // Debug log
    console.log('Debug - selectedPrintCopies:', selectedPrintCopies)
    console.log('Debug - printingItems:', printingItems)
    console.log('Debug - itemsToPrint:', itemsToPrint)
    
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
        pl_num: selectedPrintCopies,
        pl_type: getPlType(),
        pl_time_sale_start: selectedItem?.ps_time_sale_start || new Date().toISOString(),
        pl_time_sale_end: selectedItem?.ps_time_sale_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 ngày từ hiện tại
        pl_log_note: t('printSelect.printLogNote', { 
          copies: selectedPrintCopies, 
          template: selectedPrintSize.toUpperCase(),
          note: printNote ? ` - ${t('printSelect.printLogNote.note')}: ${printNote}` : ''
        })
      }
      
      await runPrintSelect(printLogData)
    } catch (error) {
      console.error("Lỗi ghi nhận in:", error)
    }
    
    const printData = {
      items: itemsToPrint,
      format: selectedPrintFormat,
      copies: selectedPrintCopies,
      totalPages: calculateTotalPages()
    }

    console.log('Debug - printData:', printData)
    printMutation.mutate(printData)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('printSelect.title')}
          </h1>
          <p className="text-muted-foreground">{t('printSelect.subtitle')}</p>
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
            disabled={filteredItems.filter((item: any) => item.ps_status === "active").length === 0}
            className="border-green-200 text-green-600 hover:bg-green-50 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="mr-2 h-4 w-4" />
            {t('printSelect.printAll', { 
              active: filteredItems.filter((item: any) => item.ps_status === "active").length,
              total: filteredItems.length 
            })}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                {t('printSelect.addProduct.addProduct')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('printSelect.addProduct.title')}
                </DialogTitle>
                <DialogDescription>{t('printSelect.addProduct.description')}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">{t('printSelect.addProduct.tabs.basic')}</TabsTrigger>
                  <TabsTrigger value="config">{t('printSelect.addProduct.tabs.config')}</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product">{t('printSelect.addProduct.fields.product')} *</Label>
                      <Select value={formData.ps_product_id} onValueChange={(value) => setFormData({...formData, ps_product_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('printSelect.addProduct.fields.selectProduct')} />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="p-2">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder={t('printSelect.addProduct.fields.searchProduct')}
                                value={productSearchTerm}
                                onChange={(e) => setProductSearchTerm(e.target.value)}
                                className="pl-8 h-8 text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="max-h-[200px] overflow-y-auto">
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
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">{t('printSelect.addProduct.fields.countryTemplate')} *</Label>
                      <Select value={formData.ps_template_id} onValueChange={(value) => setFormData({...formData, ps_template_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('printSelect.addProduct.fields.selectCountryTemplate')} />
                        </SelectTrigger>
                        <SelectContent>
                          {printTemplates.map((template: any) => (
                            <SelectItem key={template.pt_id} value={template.pt_id.toString()}>
                              <div className="flex items-center space-x-2">
                                <span>{getCountryFlag(template.country?.country_code)}</span>
                                <span>{template.pt_title}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price_sale">{t('printSelect.addProduct.fields.salePrice')}</Label>
                    <Input 
                      id="price_sale" 
                      type="number" 
                      placeholder={t('printSelect.addProduct.fields.enterSalePrice')} 
                      value={formData.ps_price_sale}
                      step="0.01"
                      onChange={(e) => setFormData({...formData, ps_price_sale: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ps_time_sale_start">{t('printSelect.addProduct.fields.saleStartTime')}</Label>
                      <Input 
                        id="ps_time_sale_start" 
                        type="date"
                        placeholder="dd/mm/yyyy" 
                        value={formData.ps_time_sale_start}
                        onChange={(e) => setFormData({...formData, ps_time_sale_start: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ps_time_sale_end">{t('printSelect.addProduct.fields.saleEndTime')}</Label>
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
                    <Label htmlFor="status">{t('printSelect.addProduct.fields.status')} *</Label>
                    <Select value={formData.ps_status} onValueChange={(value) => setFormData({...formData, ps_status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('printSelect.addProduct.fields.selectStatus')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">{t('printSelect.addProduct.fields.active')}</SelectItem>
                        <SelectItem value="inactive">{t('printSelect.addProduct.fields.inactive')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ps_option_1">{t('printSelect.addProduct.fields.option1')}</Label>
                    <Input 
                      id="ps_option_1" 
                      placeholder={t('printSelect.addProduct.fields.enterOption1')} 
                      value={formData.ps_option_1}
                      onChange={(e) => setFormData({...formData, ps_option_1: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ps_option_2">{t('printSelect.addProduct.fields.option2')}</Label>
                    <Input 
                      id="ps_option_2" 
                      placeholder={t('printSelect.addProduct.fields.enterOption2')} 
                      value={formData.ps_option_2}
                      onChange={(e) => setFormData({...formData, ps_option_2: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ps_option_3">{t('printSelect.addProduct.fields.option3')}</Label>
                    <Input 
                      id="ps_option_3" 
                      placeholder={t('printSelect.addProduct.fields.enterOption3')} 
                      value={formData.ps_option_3}
                      onChange={(e) => setFormData({...formData, ps_option_3: e.target.value})}
                    />
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
                      {t('printSelect.addProduct.buttons.adding')}
                    </>
                  ) : (
                    t('printSelect.addProduct.buttons.addToList')
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {selectedItems.length > 0 && (
            <Button
              onClick={handlePrintSelected}
              disabled={selectedItems.filter((id: number) => {
                const item = printSelections.find((item: any) => item.ps_id === id)
                return item?.ps_status !== "active"
              }).length > 0}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer className="mr-2 h-4 w-4" />
              {t('printSelect.buttons.printSelected')} ({selectedItems.filter((id: number) => {
                const item = printSelections.find((item: any) => item.ps_id === id)
                return item?.ps_status === "active"
              }).length}/{selectedItems.length})
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">{t('printSelect.stats.totalProducts')}</CardTitle>
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{printSelections.length}</div>
            <p className="text-xs text-blue-600">{t('printSelect.stats.inPrintList')}</p>
            <div className="mt-2">
              <Progress value={75} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">{t('printSelect.stats.active')}</CardTitle>
            <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{activeCount}</div>
            <p className="text-xs text-green-600">{t('printSelect.stats.readyToPrint')}</p>
            <div className="mt-2">
              <Progress value={(activeCount / printSelections.length) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">{t('printSelect.stats.totalPrints')}</CardTitle>
            <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Printer className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{printStatistics?.overview?.totalPrintLogs}</div>
            <p className="text-xs text-purple-600">{t('printSelect.stats.totalPrintCount')}</p>
            <div className="mt-2">
              <Progress value={85} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">{t('printSelect.stats.topProduct')}</CardTitle>
            <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{printStatistics?.topProducts?.[0]?.total_prints || 0} <span className="text-xs text-orange-600">{t('printSelect.stats.printCount')}</span></div>
            <div className="text-xs text-orange-600 mt-1 truncate">
              {printStatistics?.topProducts?.[0]?.product_name || t('printSelect.na')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="backdrop-blur-sm bg-white/80 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-blue-600" />
            <span>{t('printSelect.search.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('printSelect.search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder={t('printSelect.search.selectCountry')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('printSelect.search.allCountries')}</SelectItem>
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
                  <SelectValue placeholder={t('printSelect.search.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('printSelect.search.all')}</SelectItem>
                  <SelectItem value="active">{t('printSelect.search.active')}</SelectItem>
                  <SelectItem value="inactive">{t('printSelect.search.inactive')}</SelectItem>
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
              <span>{t('printSelect.loading')}</span>
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
                      <DropdownMenuLabel>{t('printSelect.actions.actions')}</DropdownMenuLabel>
                      {/* <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem> */}
                      <DropdownMenuItem 
                        onClick={() => handlePrintSingle(item)}
                        disabled={item.ps_status !== "active"}
                        className={item.ps_status !== "active" ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        {item.ps_status === "active" ? t('printSelect.actions.printNow') : t('printSelect.actions.cannotPrint')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditItem(item)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t('printSelect.actions.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteItem(item)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deleteMutation.isPending ? t('printSelect.actions.deleting') : t('printSelect.actions.delete')}
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
                      <span className="text-lg font-bold text-green-600">
                        {formatPriceWithCurrency(item.ps_price_sale, item.templates?.pt_currency)}
                      </span>
                      </div>
                </div>

                {/* Print Statistics */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">{t('printSelect.card.printConfig')}</div>
                  
                  {/* Small table for print numbers */}
                  <div className="bg-gray-50 rounded-lg p-2">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-1">{t('printSelect.card.paperSize')}</th>
                          <th className="text-right py-1">{t('printSelect.card.quantity')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-1">
                            <span className="text-blue-600 font-medium">A4</span>
                          </td>
                          <td 
                            className="text-right py-1 cursor-pointer hover:bg-blue-50 rounded px-1 transition-colors"
                            onClick={() => handleEditNum(item, 'a4')}
                          >
                            {item.printNums?.find((pn: any) => pn.pn_type === 'a4')?.pn_num || 1}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-1">
                            <span className="text-green-600 font-medium">A5</span>
                          </td>
                          <td 
                            className="text-right py-1 cursor-pointer hover:bg-green-50 rounded px-1 transition-colors"
                            onClick={() => handleEditNum(item, 'a5')}
                          >
                            {item.printNums?.find((pn: any) => pn.pn_type === 'a5')?.pn_num || 1}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-1">
                            <span className="text-purple-600 font-medium">V1</span>
                          </td>
                          <td 
                            className="text-right py-1 cursor-pointer hover:bg-purple-50 rounded px-1 transition-colors"
                            onClick={() => handleEditNum(item, 'v1')}
                          >
                            {item.printNums?.find((pn: any) => pn.pn_type === 'v1')?.pn_num || 1}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-1">
                            <span className="text-orange-600 font-medium">V2</span>
                          </td>
                          <td 
                            className="text-right py-1 cursor-pointer hover:bg-orange-50 rounded px-1 transition-colors"
                            onClick={() => handleEditNum(item, 'v2')}
                          >
                            {item.printNums?.find((pn: any) => pn.pn_type === 'v2')?.pn_num || 1}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1">
                            <span className="text-red-600 font-medium">V3</span>
                          </td>
                          <td 
                            className="text-right py-1 cursor-pointer hover:bg-red-50 rounded px-1 transition-colors"
                            onClick={() => handleEditNum(item, 'v3')}
                          >
                            {item.printNums?.find((pn: any) => pn.pn_type === 'v3')?.pn_num || 1}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('printSelect.card.saleTime')}:</span>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <div>{item.ps_time_sale_start ? new Date(item.ps_time_sale_start).toLocaleDateString("vi-VN") : t('printSelect.productList.notSet')}</div>
                    <div>→ {item.ps_time_sale_end ? new Date(item.ps_time_sale_end).toLocaleDateString("vi-VN") : t('printSelect.productList.notSet')}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('printSelect.card.createdAt')}:</span>
                    <span className="font-medium">{new Date(item.created_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{t('printSelect.card.updated')}: {new Date(item.updated_at).toLocaleDateString("vi-VN")}</span>
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
              <span>{t('printSelect.productList.title')}</span>
            </CardTitle>
            <CardDescription>
              {t('printSelect.productList.description', { filtered: filteredItems.length, total: printSelections.length })}
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
                  <TableHead>{t('printSelect.productList.headers.product')}</TableHead>
                  <TableHead>{t('printSelect.productList.headers.countryTemplate')}</TableHead>
                  <TableHead>{t('printSelect.productList.headers.originalPrice')}</TableHead>
                  <TableHead>{t('printSelect.productList.headers.salePrice')}</TableHead>
                  <TableHead>{t('printSelect.productList.headers.saleTime')}</TableHead>
                  <TableHead>{t('printSelect.productList.headers.options')}</TableHead>
                  <TableHead>{t('printSelect.productList.headers.printConfig')}</TableHead>
                  <TableHead>{t('printSelect.productList.headers.status')}</TableHead>
                  <TableHead>{t('printSelect.productList.headers.createdAt')}</TableHead>
                  <TableHead className="text-right">{t('printSelect.productList.headers.actions')}</TableHead>
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
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div 
                        className="flex items-center space-x-2 cursor-pointer hover:bg-blue-50 rounded px-2 py-1 transition-colors"
                        onClick={() => handleEditItemFromCountry(item)}
                      >
                        <span>{item.templates?.pt_title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-600">
                      {formatPriceWithCurrency(item.product?.price, item.templates?.pt_currency)}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      <div 
                        className="cursor-pointer hover:bg-green-50 rounded px-2 py-1 transition-colors"
                        onClick={() => handleEditItemFromPrice(item)}
                      >
                        {formatPriceWithCurrency(item.ps_price_sale, item.templates?.pt_currency)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div 
                        className="space-y-1 cursor-pointer hover:bg-blue-50 rounded px-2 py-1 transition-colors"
                        onClick={() => handleEditItemFromTime(item)}
                      >
                        <div className="text-xs text-muted-foreground">
                          {item.ps_time_sale_start ? new Date(item.ps_time_sale_start).toLocaleDateString("vi-VN") : t('printSelect.productList.notSet')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          → {item.ps_time_sale_end ? new Date(item.ps_time_sale_end).toLocaleDateString("vi-VN") : t('printSelect.productList.notSet')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div 
                        className="space-y-1 cursor-pointer hover:bg-purple-50 rounded px-2 py-1 transition-colors"
                        onClick={() => handleEditItemFromOption(item)}
                      >
                        <Badge variant="secondary" className="text-xs">
                          {item.templates?.ps_option_1 || t('printSelect.productList.noOptions')}
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
                      <div className="grid grid-cols-6 gap-1 text-xs">
                        <div className="text-center">
                          <div className="font-medium text-blue-600">A4</div>
                          <div 
                            className="text-muted-foreground cursor-pointer hover:bg-blue-50 rounded px-1 py-1 transition-colors"
                            onClick={() => handleEditNum(item, 'a4')}
                          >
                            {item.printNums?.find((pn: any) => pn.pn_type === 'a4')?.pn_num || 1}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-green-600">A5</div>
                          <div 
                            className="text-muted-foreground cursor-pointer hover:bg-green-50 rounded px-1 py-1 transition-colors"
                            onClick={() => handleEditNum(item, 'a5')}
                          >
                            {item.printNums?.find((pn: any) => pn.pn_type === 'a5')?.pn_num || 1}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-purple-600">V1</div>
                          <div 
                            className="text-muted-foreground cursor-pointer hover:bg-purple-50 rounded px-1 py-1 transition-colors"
                            onClick={() => handleEditNum(item, 'v1')}
                          >
                            {item.printNums?.find((pn: any) => pn.pn_type === 'v1')?.pn_num || 1}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-orange-600">V2</div>
                          <div 
                            className="text-muted-foreground cursor-pointer hover:bg-orange-50 rounded px-1 py-1 transition-colors"
                            onClick={() => handleEditNum(item, 'v2')}
                          >
                            {item.printNums?.find((pn: any) => pn.pn_type === 'v2')?.pn_num || 1}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-red-600">V3</div>
                          <div 
                            className="text-muted-foreground cursor-pointer hover:bg-red-50 rounded px-1 py-1 transition-colors"
                            onClick={() => handleEditNum(item, 'v3')}
                          >
                            {item.printNums?.find((pn: any) => pn.pn_type === 'v3')?.pn_num || 1}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-indigo-600">I4</div>
                          <div 
                            className="text-muted-foreground cursor-pointer hover:bg-indigo-50 rounded px-1 py-1 transition-colors"
                            onClick={() => handleEditNum(item, 'i4')}
                          >
                            {item.printNums?.find((pn: any) => pn.pn_type === 'i4')?.pn_num || 1}
                          </div>
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
                            <span className="sr-only">{t('printSelect.productList.openMenu')}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t('printSelect.actions.actions')}</DropdownMenuLabel>
                          {/* <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem> */}
                          <DropdownMenuItem 
                            onClick={() => handlePrintSingle(item)}
                            disabled={item.ps_status !== "active"}
                            className={item.ps_status !== "active" ? "opacity-50 cursor-not-allowed" : ""}
                          >
                            <Printer className="mr-2 h-4 w-4" />
                            {item.ps_status === "active" ? t('printSelect.actions.printNow') : t('printSelect.actions.cannotPrint')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditItem(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t('printSelect.actions.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteItem(item)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deleteMutation.isPending ? t('printSelect.actions.deleting') : t('printSelect.actions.delete')}
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
              {t('printSelect.printDialog.title', { count: printingItems.length })}
            </DialogTitle>
            <DialogDescription>{t('printSelect.printDialog.description')}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Print Items Preview */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">{t('printSelect.printDialog.itemsToPrint')}</Label>
              
              {/* Warning for inactive items */}
              {(() => {
                const itemsToPrint = printSelections.filter((item: any) => printingItems.includes(item.ps_id))
                const inactiveItems = itemsToPrint.filter((item: any) => item.ps_status !== "active")
                if (inactiveItems.length > 0) {
                  return (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-600">⚠️</span>
                        <span className="text-sm font-medium text-yellow-800">
                          {t('printSelect.printDialog.warning.inactiveItems', { count: inactiveItems.length })}
                        </span>
                      </div>
                      <div className="text-xs text-yellow-700 mt-1">
                        {t('printSelect.printDialog.warning.onlyActive')}
                      </div>
                    </div>
                  )
                }
                return null
              })()}
              <div className="max-h-32 overflow-y-auto space-y-2 bg-gray-50 p-3 rounded-lg">
                {printSelections
                  .filter((item: any) => printingItems.includes(item.ps_id))
                  .map((item: any) => (
                    <div key={item.ps_id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{item.country?.country_code ? getCountryFlag(item.country.country_code) : "🌍"}</span>
                        <span className="font-medium">{item.product?.product_name}</span>
                        <code className="bg-white px-2 py-1 rounded text-xs">{item.product?.product_code}</code>
                        {item.ps_status !== "active" && (
                          <Badge variant="destructive" className="text-xs">
                            {t('printSelect.printDialog.paused')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.templates?.ps_option_1 || t('printSelect.productList.noOptions')}
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
                <Label htmlFor="print-format">{t('printSelect.printDialog.settings.template')}</Label>
                <div className="flex items-center space-x-2 h-10 px-3 bg-gray-50 rounded-md border text-sm">
                  {(() => {
                    const itemsToPrint = printSelections.filter((item: any) => printingItems.includes(item.ps_id))
                    
                    // Kiểm tra xem có bao nhiêu mẫu in khác nhau
                    const uniqueTemplates = new Set()
                    itemsToPrint.forEach((item: any) => {
                      const template = printTemplates.find((t: any) => t.pt_country_id === item.ps_country_id)
                      if (template) {
                        uniqueTemplates.add(template.pt_id)
                      }
                    })
                    
                    if (uniqueTemplates.size === 1) {
                      // Chỉ có 1 mẫu in duy nhất
                      const firstItem = itemsToPrint[0]
                      const matchingTemplate = printTemplates.find((template: any) => template.pt_country_id === firstItem.ps_country_id)
                      if (matchingTemplate) {
                        return (
                          <>
                            <span className="text-base">{getCountryFlag(matchingTemplate.country?.country_code)}</span>
                            <div className="truncate">
                              <div className="font-medium truncate">{matchingTemplate.pt_title}</div>
                              <div className="text-xs text-muted-foreground truncate">{t('printSelect.printDialog.settings.templateFor', { country: matchingTemplate.country?.country_name })}</div>
                            </div>
                          </>
                        )
                      }
                    } else if (uniqueTemplates.size > 1) {
                      // Có nhiều mẫu in khác nhau
                      return (
                        <>
                          <span className="text-base">📋</span>
                          <div className="truncate">
                            <div className="font-medium truncate">{t('printSelect.printDialog.settings.multipleTemplates', { count: uniqueTemplates.size })}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {t('printSelect.printDialog.settings.productsWithTemplates', { products: itemsToPrint.length, templates: uniqueTemplates.size })}
                            </div>
                          </div>
                        </>
                      )
                    }
                    
                    return (
                      <div className="text-muted-foreground">
                        {t('printSelect.printDialog.settings.noTemplateFound')}
                      </div>
                    )
                  })()}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="print-size">{t('printSelect.printDialog.settings.printSize')}</Label>
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
                          <div className="text-xs text-muted-foreground">{t('printSelect.printDialog.settings.customSize1')}</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="v2">
                      <div className="flex items-center space-x-2">
                        <span>📋</span>
                        <div>
                          <div className="font-medium">V2</div>
                          <div className="text-xs text-muted-foreground">{t('printSelect.printDialog.settings.customSize2')}</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="v3">
                      <div className="flex items-center space-x-2">
                        <span>📋</span>
                        <div>
                          <div className="font-medium">V3</div>
                          <div className="text-xs text-muted-foreground">{t('printSelect.printDialog.settings.customSize3')}</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="i4">
                      <div className="flex items-center space-x-2">
                        <span>🏷️</span>
                        <div>
                          <div className="font-medium">I4</div>
                          <div className="text-xs text-muted-foreground">{t('printSelect.printDialog.settings.labelTemplate')}</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>



              <div className="space-y-2">
                <Label htmlFor="print-copies">{t('printSelect.printDialog.settings.copies')}</Label>
                <Input
                  id="print-copies"
                  type="number"
                  min="1"
                  max="100"
                  value={selectedPrintCopies}
                  onChange={(e) => setSelectedPrintCopies(Number.parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">
                  {t('printSelect.printDialog.settings.quantityFromConfig', { size: selectedPrintSize.toUpperCase() })}
                </p>
              </div>
              <div className="space-y-2">
                <Label>{t('printSelect.printDialog.settings.printInfo')}</Label>
                <div className="text-sm text-muted-foreground">
                  <div>{t('printSelect.printDialog.settings.template')}: {selectedPrintSize.toUpperCase()}</div>
                  <div>{t('printSelect.printDialog.settings.totalPages')}: {calculateTotalPages()}</div>
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="print-note">{t('printSelect.printDialog.settings.printNote')}</Label>
                <Input
                  id="print-note"
                  placeholder={t('printSelect.printDialog.settings.enterPrintNote')}
                  value={printNote}
                  onChange={(e) => setPrintNote(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {t('printSelect.printDialog.settings.noteWillBeSaved')}
                </p>
              </div>
            </div>

            {/* Thêm vào Print Dialog, sau phần Print Settings */}
            <div className="space-y-2">
              <Label>{t('printSelect.printDialog.settings.previewContent')}</Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {t('printSelect.printDialog.settings.previewPrintContent')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Printer className="w-5 h-5 mr-2 text-green-600" />
                      {t('printSelect.printDialog.settings.previewPrintContent')}
                    </DialogTitle>
                    <DialogDescription>{t('printSelect.printDialog.settings.previewDescription', { count: printingItems.length })}</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* File Preview */}
                    <div className="border rounded-lg overflow-hidden bg-gray-50">
                                          <div className="bg-white p-4 border-b flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {printFormats.find((f: any) => f.id === selectedPrintFormat)?.template ? 'PDF' : selectedPrintFormat.toUpperCase()}
                        </Badge>

                      </div>
                      <div className="text-sm text-muted-foreground">
                        Tổng cộng {calculateTotalPages()} trang từ {printingItems.length} sản phẩm
                      </div>
                    </div>

                      {/* Preview Content */}
                      <div className="p-6 bg-white min-h-[400px] max-h-[500px] overflow-auto">
                        <div className="space-y-6">
                          {printSelections
                            .filter((item: any) => printingItems.includes(item.ps_id))
                            .map((item: any, itemIndex: number) => {
                              // Sử dụng template system mới
                              const selectedTemplate = printFormats.find((f: any) => f.id === selectedPrintFormat)?.template
                              const templateData = prepareTemplateData(item)
                              const template = getTemplate(selectedPrintSize)
                              const previewHTML = template(templateData)
                              
                              // Tạo nhiều bản in theo số lượng copies
                              const copies = []
                              for (let copyIndex = 0; copyIndex < selectedPrintCopies; copyIndex++) {
                                copies.push(
                                  <div
                                    key={`${item.ps_id}-copy-${copyIndex}`}
                                    className="max-w-2xl mx-auto bg-white shadow-lg border rounded-lg overflow-hidden mb-4"
                                  >
                                    <div className="bg-gray-100 p-3 border-b">
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{t('printSelect.printDialog.preview.template', { size: selectedPrintSize.toUpperCase() })}</span>
                                        <span className="text-gray-500">
                                          {t('printSelect.printDialog.preview.productCopy', { 
                                            product: itemIndex + 1, 
                                            total: printingItems.length, 
                                            copy: copyIndex + 1, 
                                            copies: selectedPrintCopies 
                                          })}
                                        </span>
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
                              }
                              
                              return copies
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
                  <span>{t('printSelect.printDialog.progress.processing')}</span>
                  <span>{t('printSelect.printDialog.progress.pleaseWait')}</span>
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
              <Printer className="h-4 w-4" />
              <span>{t('printSelect.printDialog.footer.total')}: {calculateTotalPages()} {t('printSelect.printDialog.footer.pages')}</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsPrintDialogOpen(false)}>
                {t('printSelect.printDialog.footer.cancel')}
              </Button>
              <Button
                onClick={executePrint}
                disabled={printMutation.isPending || (() => {
                  const itemsToPrint = printSelections.filter((item: any) => printingItems.includes(item.ps_id))
                  return itemsToPrint.some((item: any) => item.ps_status !== "active")
                })()}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {printMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('printSelect.printDialog.buttons.printing')}
                  </>
                ) : (
                  <>
                    <Printer className="mr-2 h-4 w-4" />
                    {t('printSelect.printDialog.buttons.startPrint')}
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
            <AlertDialogTitle className="text-xl font-semibold text-slate-900">{t('printSelect.deleteDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              {t('printSelect.deleteDialog.description', { productName: itemToDelete?.product?.product_name })}
              <br />
              <span className="text-red-600 font-semibold">{t('printSelect.deleteDialog.warning')}</span>
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
                <div className="text-sm text-slate-600">{t('printSelect.deleteDialog.info.code')}: <code className="bg-white px-1 rounded text-slate-700">{itemToDelete.product?.product_code}</code></div>
                <div className="text-sm text-slate-600">{t('printSelect.deleteDialog.info.origin')}: {itemToDelete.country?.country_name}</div>
                <div className="text-sm text-slate-600">{t('printSelect.deleteDialog.info.paperSize')}: {itemToDelete.ps_type}</div>
              </div>
            </div>
          )}

          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel 
              className="rounded-xl"
              disabled={deleteMutation.isPending}
              onClick={() => setItemToDelete(null)}
            >
              {t('printSelect.deleteDialog.buttons.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('printSelect.deleteDialog.buttons.deleting')}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('printSelect.deleteDialog.buttons.deleteProduct')}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open)
        if (!open) {
          setActiveEditTab("basic")
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('printSelect.editInfo.title')}
            </DialogTitle>
            <DialogDescription>{t('printSelect.editInfo.description')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit}>
            <Tabs value={activeEditTab} onValueChange={setActiveEditTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">{t('printSelect.editInfo.tabs.basic')}</TabsTrigger>
                <TabsTrigger value="config">{t('printSelect.editInfo.tabs.config')}</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_product">{t('printSelect.editInfo.fields.product')} *</Label>
                    <Select 
                      value={editFormData.ps_product_id} 
                      onValueChange={(value) => setEditFormData({...editFormData, ps_product_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('printSelect.editInfo.fields.selectProduct')} />
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
                    <Label htmlFor="edit_country">{t('printSelect.editInfo.fields.countryTemplate')} *</Label>
                    <Select 
                      value={editFormData.ps_template_id} 
                      onValueChange={(value) => setEditFormData({...editFormData, ps_template_id: value})}
                      open={isCountrySelectOpen}
                      onOpenChange={setIsCountrySelectOpen}
                    >
                      <SelectTrigger ref={countrySelectRef} id="edit-country-select">
                        <SelectValue placeholder={t('printSelect.editInfo.fields.selectCountryTemplate')} />
                      </SelectTrigger>
                      <SelectContent>
                        {printTemplates.map((template: any) => (
                          <SelectItem key={template.pt_id} value={template.pt_id.toString()}>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{getCountryFlag(template.country?.country_code)}</span>
                              <span>{template.pt_title}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_price_sale">{t('printSelect.editInfo.fields.salePrice')}</Label>
                  <Input 
                    id="edit_price_sale" 
                    type="number" 
                    placeholder={t('printSelect.editInfo.fields.enterSalePrice')} 
                    value={editFormData.ps_price_sale}
                    step="0.01"
                    onChange={(e) => setEditFormData({...editFormData, ps_price_sale: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_ps_time_sale_start">{t('printSelect.editInfo.fields.saleStartTime')}</Label>
                    <Input 
                      id="edit_ps_time_sale_start" 
                      type="date"
                      placeholder="dd/mm/yyyy" 
                      value={editFormData.ps_time_sale_start}
                      onChange={(e) => setEditFormData({...editFormData, ps_time_sale_start: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_ps_time_sale_end">{t('printSelect.editInfo.fields.saleEndTime')}</Label>
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
                  <Label htmlFor="edit_status">{t('printSelect.editInfo.fields.status')} *</Label>
                  <Select 
                    value={editFormData.ps_status} 
                    onValueChange={(value) => setEditFormData({...editFormData, ps_status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('printSelect.editInfo.fields.selectStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('printSelect.editInfo.fields.active')}</SelectItem>
                      <SelectItem value="inactive">{t('printSelect.editInfo.fields.inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_ps_option_1">{t('printSelect.editInfo.fields.option1')}</Label>
                  <Input 
                    id="edit_ps_option_1" 
                    placeholder={t('printSelect.editInfo.fields.enterOption1')} 
                    value={editFormData.ps_option_1}
                    onChange={(e) => setEditFormData({...editFormData, ps_option_1: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_ps_option_2">{t('printSelect.editInfo.fields.option2')}</Label>
                  <Input 
                    id="edit_ps_option_2" 
                    placeholder={t('printSelect.editInfo.fields.enterOption2')} 
                    value={editFormData.ps_option_2}
                    onChange={(e) => setEditFormData({...editFormData, ps_option_2: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_ps_option_3">{t('printSelect.editInfo.fields.option3')}</Label>
                  <Input 
                    id="edit_ps_option_3" 
                    placeholder={t('printSelect.editInfo.fields.enterOption3')} 
                    value={editFormData.ps_option_3}
                    onChange={(e) => setEditFormData({...editFormData, ps_option_3: e.target.value})}
                  />
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
                    {t('printSelect.editInfo.buttons.updating')}
                  </>
                ) : (
                  t('printSelect.editInfo.buttons.updateInfo')
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Print Number Dialog */}
      <Dialog open={isEditNumDialogOpen} onOpenChange={setIsEditNumDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-500" />
              {t('printSelect.editNum.title')}
            </DialogTitle>
            <DialogDescription>
              {t('printSelect.editNum.description')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateAllNumsSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="a4_num" className="text-blue-600 font-medium">A4</Label>
                <Input
                  id="a4_num"
                  type="number"
                  min="0"
                  value={editingAllNums.a4}
                  onChange={(e) => setEditingAllNums({
                    ...editingAllNums,
                    a4: parseInt(e.target.value) || 0
                  })}
                  placeholder={t('printSelect.editNum.placeholders.a4')}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="a5_num" className="text-green-600 font-medium">A5</Label>
                <Input
                  id="a5_num"
                  type="number"
                  min="0"
                  value={editingAllNums.a5}
                  onChange={(e) => setEditingAllNums({
                    ...editingAllNums,
                    a5: parseInt(e.target.value) || 0
                  })}
                  placeholder={t('printSelect.editNum.placeholders.a5')}
                  className="border-green-200 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v1_num" className="text-purple-600 font-medium">V1</Label>
                <Input
                  id="v1_num"
                  type="number"
                  min="0"
                  value={editingAllNums.v1}
                  onChange={(e) => setEditingAllNums({
                    ...editingAllNums,
                    v1: parseInt(e.target.value) || 0
                  })}
                  placeholder={t('printSelect.editNum.placeholders.v1')}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v2_num" className="text-orange-600 font-medium">V2</Label>
                <Input
                  id="v2_num"
                  type="number"
                  min="0"
                  value={editingAllNums.v2}
                  onChange={(e) => setEditingAllNums({
                    ...editingAllNums,
                    v2: parseInt(e.target.value) || 0
                  })}
                  placeholder={t('printSelect.editNum.placeholders.v2')}
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v3_num" className="text-red-600 font-medium">V3</Label>
                <Input
                  id="v3_num"
                  type="number"
                  min="0"
                  value={editingAllNums.v3}
                  onChange={(e) => setEditingAllNums({
                    ...editingAllNums,
                    v3: parseInt(e.target.value) || 0
                  })}
                  placeholder={t('printSelect.editNum.placeholders.v3')}
                  className="border-red-200 focus:border-red-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="i4_num" className="text-indigo-600 font-medium">I4</Label>
                <Input
                  id="i4_num"
                  type="number"
                  min="0"
                  value={editingAllNums.i4}
                  onChange={(e) => setEditingAllNums({
                    ...editingAllNums,
                    i4: parseInt(e.target.value) || 0
                  })}
                  placeholder={t('printSelect.editNum.placeholders.i4')}
                  className="border-indigo-200 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-800">
                <div><strong>{t('printSelect.editNum.info.product')}:</strong> {printSelections.find((item: any) => item.ps_id === editingAllNums.pn_select_id)?.product?.product_name}</div>
                <div><strong>{t('printSelect.editNum.info.origin')}:</strong> {printSelections.find((item: any) => item.ps_id === editingAllNums.pn_select_id)?.country?.country_name}</div>
                <div><strong>{t('printSelect.editNum.info.totalQuantity')}:</strong> {editingAllNums.a4 + editingAllNums.a5 + editingAllNums.v1 + editingAllNums.v2 + editingAllNums.v3 + editingAllNums.i4} {t('printSelect.editNum.info.copies')}</div>
              </div>
            </div>
          </form>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditNumDialogOpen(false)}
              disabled={updateNumMutation.isPending}
            >
              {t('printSelect.editNum.buttons.cancel')}
            </Button>
            <Button
              onClick={handleUpdateAllNumsSubmit}
              disabled={updateNumMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {updateNumMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('printSelect.editNum.buttons.updating')}
                </>
              ) : (
                t('printSelect.editNum.buttons.updateAll')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
