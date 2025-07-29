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
import { useLang } from "@/lang/useLang"


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
  const { t } = useLang()
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
      toast.success(t('printTemplates.toasts.createSuccess.message'))
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
      toast.error(error?.response?.data?.message || t('printTemplates.toasts.createError.message'))
    }
  })

  const deleteTemplateMutation = useMutation({
    mutationFn: deletePrintTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['print-templates'] })
      toast.success(t('printTemplates.toasts.deleteSuccess.message'))
      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('printTemplates.toasts.deleteError.message'))
      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
    }
  })

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: ({ countryId, item }: { countryId: number, item: any }) => updatePrintTemplate(countryId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['print-templates'] })
      toast.success(t('printTemplates.toasts.updateSuccess.message'))
      setIsEditDialogOpen(false)
      setSelectedTemplate(null)
      setEditForm({
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
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('printTemplates.toasts.updateError.message'))
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
      toast.error(t('printTemplates.toasts.validation.requiredFields'))
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
      toast.error(t('printTemplates.toasts.validation.requiredFields'))
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
          <span className="text-slate-600">{t('printTemplates.loading')}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 mb-2">{t('printTemplates.error')}</div>
          <Button onClick={() => queryClient.refetchQueries({ queryKey: ['print-templates'] })} variant="outline">
            {t('printTemplates.retry')}
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
            {t('printTemplates.title')}
          </h1>
          <p className="text-muted-foreground">{t('printTemplates.subtitle')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                {t('printTemplates.create.button')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  {t('printTemplates.create.title')}
                </DialogTitle>
                <DialogDescription>{t('printTemplates.create.subtitle')}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">{t('printTemplates.create.tabs.basic')}</TabsTrigger>
                    <TabsTrigger value="content">{t('printTemplates.create.tabs.content')}</TabsTrigger>
                    <TabsTrigger value="preview">{t('printTemplates.create.tabs.preview')}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pt_title">{t('printTemplates.create.fields.title')} *</Label>
                        <Input 
                          id="pt_title" 
                          value={formData.pt_title}
                          onChange={(e) => handleInputChange('pt_title', e.target.value)}
                          placeholder={t('printTemplates.create.placeholders.title')} 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pt_country">{t('printTemplates.create.fields.country')} *</Label>
                        <Select 
                          value={formData.pt_country_id} 
                          onValueChange={(value) => handleInputChange('pt_country_id', value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('printTemplates.search.filter.selectCountry')} />
                          </SelectTrigger>
                                                  <SelectContent>
                          {isLoadingCountries ? (
                            <SelectItem value="" disabled>{t('printTemplates.loading')}</SelectItem>
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
                        <Label htmlFor="pt_brand">{t('printTemplates.create.fields.brand')} *</Label>
                        <Input
                          id="pt_brand"
                          value={formData.pt_brand}
                          onChange={(e) => handleInputChange('pt_brand', e.target.value)}
                          placeholder={t('printTemplates.create.placeholders.brand')}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pt_origin_country">{t('printTemplates.create.fields.originCountry')} *</Label>
                        <Input
                          id="pt_origin_country"
                          value={formData.pt_origin_country}
                          onChange={(e) => handleInputChange('pt_origin_country', e.target.value)}
                          placeholder={t('printTemplates.create.placeholders.originCountry')}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pt_product_code">{t('printTemplates.create.fields.productCode')} *</Label>
                        <Input
                          id="pt_product_code"
                          value={formData.pt_product_code}
                          onChange={(e) => handleInputChange('pt_product_code', e.target.value)}
                          placeholder={t('printTemplates.create.placeholders.productCode')}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pt_original_price">{t('printTemplates.create.fields.originalPrice')} *</Label>
                        <Input
                          id="pt_original_price"
                          value={formData.pt_original_price}
                          onChange={(e) => handleInputChange('pt_original_price', e.target.value)}
                          placeholder={t('printTemplates.create.placeholders.originalPrice')}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pt_unit_price">{t('printTemplates.create.fields.unitPrice')} *</Label>
                        <Input
                          id="pt_unit_price"
                          value={formData.pt_unit_price}
                          onChange={(e) => handleInputChange('pt_unit_price', e.target.value)}
                          placeholder={t('printTemplates.create.placeholders.unitPrice')}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pt_currency">{t('printTemplates.create.fields.currency')} *</Label>
                        <div className="relative currency-dropdown">
                          <Input
                            id="pt_currency"
                            value={formData.pt_currency}
                            onChange={(e) => handleInputChange('pt_currency', e.target.value)}
                            onFocus={() => setIsCurrencyDropdownOpen(true)}
                            placeholder={t('printTemplates.create.placeholders.currency')}
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
                        <Label htmlFor="pt_vendor">{t('printTemplates.create.fields.vendor')} *</Label>
                        <Input
                          id="pt_vendor"
                          value={formData.pt_vendor}
                          onChange={(e) => handleInputChange('pt_vendor', e.target.value)}
                          placeholder={t('printTemplates.create.placeholders.vendor')}
                          required
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        {t('printTemplates.preview.wordsUsed')}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.brand')}:</Badge>
                          <span className="font-medium">{formData.pt_brand || t('printTemplates.na')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.originCountry')}:</Badge>
                          <span className="font-medium">{formData.pt_origin_country || t('printTemplates.na')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.productCode')}:</Badge>
                          <span className="font-medium">{formData.pt_product_code || t('printTemplates.na')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.originalPrice')}:</Badge>
                          <span className="font-medium">{formData.pt_original_price || t('printTemplates.na')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.unitPrice')}:</Badge>
                          <span className="font-medium">{formData.pt_unit_price || t('printTemplates.na')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.currency')}:</Badge>
                          <span className="font-medium">{formData.pt_currency || t('printTemplates.na')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.vendor')}:</Badge>
                          <span className="font-medium">{formData.pt_vendor || t('printTemplates.na')}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="preview" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px]">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        {t('printTemplates.preview.previewTemplate')}
                      </h4>
                      <div className="bg-white p-4 rounded border text-sm space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.brand')}:</Badge>
                              <span className="font-medium">{formData.pt_brand || t('printTemplates.preview.notEntered')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.originCountry')}:</Badge>
                              <span className="font-medium">{formData.pt_origin_country || t('printTemplates.preview.notEntered')}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.productCode')}:</Badge>
                              <span className="font-medium">{formData.pt_product_code || t('printTemplates.preview.notEntered')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.originalPrice')}:</Badge>
                              <span className="font-medium">{formData.pt_original_price || t('printTemplates.preview.notEntered')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.unitPrice')}:</Badge>
                              <span className="font-medium">{formData.pt_unit_price || t('printTemplates.preview.notEntered')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.currency')}:</Badge>
                              <span className="font-medium">{formData.pt_currency || t('printTemplates.preview.notSelected')}</span>
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
                    {t('printTemplates.create.cancel')}
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createTemplateMutation.isPending}
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                  >
                    {createTemplateMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {t('printTemplates.create.creating')}
                      </>
                    ) : (
                      t('printTemplates.create.createTemplate')
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
            <CardTitle className="text-sm font-medium">{t('printTemplates.stats.totalTemplates')}</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{templates.length}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {t('printTemplates.stats.allTemplates')}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('printTemplates.stats.totalUsage')}</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t('printTemplates.stats.totalUsage')}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('printTemplates.stats.mostPopular')}</CardTitle>
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
            <CardTitle className="text-sm font-medium">{t('printTemplates.stats.totalCountries')}</CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <Globe className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{countries.length}</div>
            <p className="text-xs text-muted-foreground">{t('printTemplates.stats.supportedCountries')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="backdrop-blur-sm bg-white/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t('printTemplates.searchAndFilter')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('printTemplates.search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder={t('printTemplates.filter.selectCountry')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>{t('printTemplates.search.allCountries')}</span>
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
                      <DropdownMenuLabel>{t('printTemplates.table.actions.actions')}</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedTemplate(template)
                          setIsPreviewDialogOpen(true)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {t('printTemplates.preview.preview')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedTemplate(template)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {t('printTemplates.edit.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteTemplate(template)}
                        disabled={deleteTemplateMutation.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deleteTemplateMutation.isPending && templateToDelete?.pt_id === template.pt_id ? t('printTemplates.delete.deleting') : t('printTemplates.delete.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-2">{t('printTemplates.preview.wordsUsed')}:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.brand')}:</Badge>
                      <span className="font-medium truncate">{template.pt_brand || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.originCountry')}:</Badge>
                      <span className="font-medium truncate">{template.pt_origin_country || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.productCode')}:</Badge>
                      <span className="font-medium truncate">{template.pt_product_code || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.originalPrice')}:</Badge>
                      <span className="font-medium truncate">{template.pt_original_price || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.unitPrice')}:</Badge>
                      <span className="font-medium truncate">{template.pt_unit_price || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.currency')}:</Badge>
                      <span className="font-medium truncate">{template.pt_currency || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.vendor')}:</Badge>
                      <span className="font-medium truncate">{template.pt_vendor || t('printTemplates.na')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Printer className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{template.usage?.totalPrints || 0}</span>
                    <span className="text-muted-foreground">{t('printTemplates.stats.usageCount')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(template.updated_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t('printTemplates.stats.usageLevel')}</span>
                    <span>{template.usage?.usagePercentage || 0}%</span>
                  </div>
                  <Progress value={template.usage?.usagePercentage || 0} className="h-2" />
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      template.usage?.usageLevel === 'high' ? 'bg-green-500' : 
                      template.usage?.usageLevel === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-muted-foreground capitalize">
                      {template.usage?.usageLevel === 'high' ? t('printTemplates.stats.high') : 
                       template.usage?.usageLevel === 'medium' ? t('printTemplates.stats.medium') : t('printTemplates.stats.low')}
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
            <CardTitle>{t('printTemplates.list.templateList')}</CardTitle>
            <CardDescription>{t('printTemplates.list.totalTemplates', { count: filteredTemplates.length })}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('printTemplates.list.template')}</TableHead>
                  <TableHead>{t('printTemplates.list.country')}</TableHead>
                  <TableHead>{t('printTemplates.list.content')}</TableHead>
                  <TableHead>{t('printTemplates.list.usageCount')}</TableHead>
                  <TableHead>{t('printTemplates.list.updatedAt')}</TableHead>
                  <TableHead className="text-right">{t('printTemplates.list.actions')}</TableHead>
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
                          <div className="text-sm text-muted-foreground">{t('printTemplates.id')}: {template.pt_id}</div>
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
                            <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.brand')}:</Badge>
                            <span className="font-medium truncate">{template.pt_brand || t('printTemplates.na')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.originCountry')}:</Badge>
                            <span className="font-medium truncate">{template.pt_origin_country || t('printTemplates.na')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.productCode')}:</Badge>
                            <span className="font-medium truncate">{template.pt_product_code || t('printTemplates.na')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.originalPrice')}:</Badge>
                            <span className="font-medium truncate">{template.pt_original_price || t('printTemplates.na')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.unitPrice')}:</Badge>
                            <span className="font-medium truncate">{template.pt_unit_price || t('printTemplates.na')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.currency')}:</Badge>
                            <span className="font-medium truncate">{template.pt_currency || t('printTemplates.na')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.vendor')}:</Badge>
                            <span className="font-medium truncate">{template.pt_vendor || t('printTemplates.na')}</span>
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
                          {template.usage?.usageLevel === 'high' ? t('printTemplates.stats.high') : 
                           template.usage?.usageLevel === 'medium' ? t('printTemplates.stats.medium') : t('printTemplates.stats.low')}
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
                          <DropdownMenuLabel>{t('printTemplates.table.actions.actions')}</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTemplate(template)
                              setIsPreviewDialogOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {t('printTemplates.preview.preview')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTemplate(template)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('printTemplates.edit.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            {t('printTemplates.copy')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteTemplate(template)}
                            disabled={deleteTemplateMutation.isPending}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deleteTemplateMutation.isPending && templateToDelete?.pt_id === template.pt_id ? t('printTemplates.delete.deleting') : t('printTemplates.delete.delete')}
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
              {t('printTemplates.preview.previewTemplate')}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <span>{getCountryFlag(selectedTemplate?.pt_country_code)}</span>
              {selectedTemplate?.pt_title} - {selectedTemplate?.pt_country_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground">{t('printTemplates.preview.usageCount')}:</span>
                <div className="font-medium">{selectedTemplate?.usage?.totalPrints || 0}</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">{t('printTemplates.preview.usageLevel')}:</span>
                <div className="font-medium flex items-center gap-2">
                  <span>{selectedTemplate?.usage?.usagePercentage || 0}%</span>
                  <div className={`w-2 h-2 rounded-full ${
                    selectedTemplate?.usage?.usageLevel === 'high' ? 'bg-green-500' : 
                    selectedTemplate?.usage?.usageLevel === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs capitalize">
                    {selectedTemplate?.usage?.usageLevel === 'high' ? t('printTemplates.stats.high') : 
                     selectedTemplate?.usage?.usageLevel === 'medium' ? t('printTemplates.stats.medium') : t('printTemplates.stats.low')}
                  </span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('printTemplates.preview.wordsUsedInTemplate')}
              </h4>
              <div className="bg-white p-4 rounded border text-sm space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.brand')}:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_brand || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.originCountry')}:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_origin_country || t('printTemplates.na')}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.productCode')}:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_product_code || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.originalPrice')}:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_original_price || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.unitPrice')}:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_unit_price || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.currency')}:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_currency || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{t('printTemplates.create.fields.vendor')}:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_vendor || t('printTemplates.na')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Code className="h-4 w-4" />
                {t('printTemplates.preview.wordsUsed')}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.brand')}:</Badge>
                  <span className="font-medium">{selectedTemplate?.pt_brand || t('printTemplates.na')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.originCountry')}:</Badge>
                  <span className="font-medium">{selectedTemplate?.pt_origin_country || t('printTemplates.na')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.productCode')}:</Badge>
                  <span className="font-medium">{selectedTemplate?.pt_product_code || t('printTemplates.na')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.originalPrice')}:</Badge>
                  <span className="font-medium">{selectedTemplate?.pt_original_price || t('printTemplates.na')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.unitPrice')}:</Badge>
                  <span className="font-medium">{selectedTemplate?.pt_unit_price || t('printTemplates.na')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.currency')}:</Badge>
                  <span className="font-medium">{selectedTemplate?.pt_currency || t('printTemplates.na')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.vendor')}:</Badge>
                  <span className="font-medium">{selectedTemplate?.pt_vendor || t('printTemplates.na')}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              {t('printTemplates.preview.close')}
            </Button>
            <Button
              onClick={() => {
                setIsPreviewDialogOpen(false)
                setIsEditDialogOpen(true)
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Edit className="mr-2 h-4 w-4" />
              {t('printTemplates.edit.edit')}
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
              {t('printTemplates.edit.editTemplate')}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <span>{getCountryFlag(selectedTemplate?.pt_country_code)}</span>
              {selectedTemplate?.pt_title}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">{t('printTemplates.edit.tabs.basic')}</TabsTrigger>
                <TabsTrigger value="content">{t('printTemplates.edit.tabs.content')}</TabsTrigger>
                <TabsTrigger value="analytics">{t('printTemplates.edit.tabs.analytics')}</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_title">{t('printTemplates.edit.templateTitle')}</Label>
                    <Input id="edit_title" value={editForm.pt_title} onChange={e => setEditForm(f => ({...f, pt_title: e.target.value}))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_country">{t('printTemplates.edit.country')}</Label>
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
                    <Label htmlFor="edit_brand">{t('printTemplates.edit.brandWords')}</Label>
                    <Input
                      id="edit_brand"
                      value={editForm.pt_brand}
                      onChange={e => setEditForm(f => ({...f, pt_brand: e.target.value}))}
                      placeholder={t('printTemplates.edit.brandWordsPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_origin_country">{t('printTemplates.edit.originCountryWords')}</Label>
                    <Input
                      id="edit_origin_country"
                      value={editForm.pt_origin_country}
                      onChange={e => setEditForm(f => ({...f, pt_origin_country: e.target.value}))}
                      placeholder={t('printTemplates.edit.originCountryWordsPlaceholder')}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_product_code">{t('printTemplates.edit.productCodeWords')}</Label>
                    <Input
                      id="edit_product_code"
                      value={editForm.pt_product_code}
                      onChange={e => setEditForm(f => ({...f, pt_product_code: e.target.value}))}
                      placeholder={t('printTemplates.edit.productCodeWordsPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_original_price">{t('printTemplates.edit.originalPriceWords')}</Label>
                    <Input
                      id="edit_original_price"
                      value={editForm.pt_original_price}
                      onChange={e => setEditForm(f => ({...f, pt_original_price: e.target.value}))}
                      placeholder={t('printTemplates.edit.originalPriceWordsPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_unit_price">{t('printTemplates.edit.unitPriceWords')}</Label>
                    <Input
                      id="edit_unit_price"
                      value={editForm.pt_unit_price}
                      onChange={e => setEditForm(f => ({...f, pt_unit_price: e.target.value}))}
                      placeholder={t('printTemplates.edit.unitPriceWordsPlaceholder')}
                    />
                  </div>
                                    <div className="space-y-2">
                    <Label htmlFor="edit_currency">{t('printTemplates.edit.currencySymbol')}</Label>
                    <div className="relative currency-dropdown">
                      <Input
                        id="edit_currency"
                        value={editForm.pt_currency}
                        onChange={e => setEditForm(f => ({...f, pt_currency: e.target.value}))}
                        onFocus={() => setIsEditCurrencyDropdownOpen(true)}
                        placeholder={t('printTemplates.edit.currencySymbolPlaceholder')}
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
                    <Label htmlFor="edit_vendor">{t('printTemplates.edit.vendorWords')}</Label>
                    <Input
                      id="edit_vendor"
                      value={editForm.pt_vendor}
                      onChange={e => setEditForm(f => ({...f, pt_vendor: e.target.value}))}
                      placeholder={t('printTemplates.edit.vendorWordsPlaceholder')}
                    />
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    {t('printTemplates.preview.wordsUsed')}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.brand')}:</Badge>
                      <span className="font-medium">{editForm.pt_brand || t('printTemplates.preview.notEntered')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.originCountry')}:</Badge>
                      <span className="font-medium">{editForm.pt_origin_country || t('printTemplates.preview.notEntered')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.productCode')}:</Badge>
                      <span className="font-medium">{editForm.pt_product_code || t('printTemplates.preview.notEntered')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.originalPrice')}:</Badge>
                      <span className="font-medium">{editForm.pt_original_price || t('printTemplates.preview.notEntered')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.unitPrice')}:</Badge>
                      <span className="font-medium">{editForm.pt_unit_price || t('printTemplates.preview.notEntered')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.currency')}:</Badge>
                      <span className="font-medium">{editForm.pt_currency || t('printTemplates.preview.notSelected')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.vendor')}:</Badge>
                      <span className="font-medium">{editForm.pt_vendor || t('printTemplates.preview.notEntered')}</span>
                    </div>
                  </div>
                </div>

              </TabsContent>
              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{t('printTemplates.analytics.usageCount')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{selectedTemplate?.usage?.totalPrints || 0}</div>
                      <Progress value={selectedTemplate?.usage?.usagePercentage || 0} className="mt-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{t('printTemplates.analytics.usageLevel')}</CardTitle>
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
                        {selectedTemplate?.usage?.usageLevel === 'high' ? t('printTemplates.stats.high') : 
                         selectedTemplate?.usage?.usageLevel === 'medium' ? t('printTemplates.stats.medium') : t('printTemplates.stats.low')}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-2">
                  <Label>{t('printTemplates.analytics.wordsUsed')}</Label>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.brand')}:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_brand || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.originCountry')}:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_origin_country || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.productCode')}:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_product_code || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.originalPrice')}:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_original_price || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.unitPrice')}:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_unit_price || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.currency')}:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_currency || t('printTemplates.na')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{t('printTemplates.create.fields.vendor')}:</Badge>
                      <span className="font-medium">{selectedTemplate?.pt_vendor || t('printTemplates.na')}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                {t('printTemplates.edit.cancel')}
              </Button>
              <Button type="submit" disabled={updateTemplateMutation.isPending} className="bg-gradient-to-r from-blue-500 to-purple-600">
                {updateTemplateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('printTemplates.edit.saving')}
                  </>
                ) : (
                  t('printTemplates.edit.saveChanges')
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
            <AlertDialogTitle className="text-xl font-semibold text-slate-900">{t('printTemplates.delete.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              {t('printTemplates.delete.confirmDeleteMessage', { templateTitle: templateToDelete?.pt_title })}
              <br /><br />
              <span className="text-amber-600 font-medium">⚠️ {t('printTemplates.delete.warning')}:</span> {t('printTemplates.delete.warningMessage', { countryName: templateToDelete?.country?.country_name })}
              <br /><br />
              {t('printTemplates.delete.actionCannotBeUndone')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow-md">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="font-semibold text-red-800">{templateToDelete?.pt_title}</div>
              <div className="text-sm text-red-600">
                {t('printTemplates.delete.country')}: {templateToDelete?.country?.country_name} {getCountryFlag(templateToDelete?.country?.country_code)}
              </div>
              <div className="text-sm text-red-600">
                {t('printTemplates.delete.usageCount')}: {templateToDelete?.usage?.totalPrints || 0} ({templateToDelete?.usage?.usagePercentage || 0}%)
              </div>
            </div>
          </div>
          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel 
              className="rounded-xl"
              disabled={deleteTemplateMutation.isPending}
            >
              {t('printTemplates.delete.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => templateToDelete && deleteTemplateMutation.mutate(templateToDelete.pt_country_id)}
              disabled={deleteTemplateMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              {deleteTemplateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('printTemplates.delete.deleting')}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('printTemplates.delete.deleteTemplate')}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
