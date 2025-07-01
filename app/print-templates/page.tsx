"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createPrintTemplate, getPrintTemplates } from "@/services/PrintService"
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
    pt_content: "",
    pt_footer: ""
  })

  const queryClient = useQueryClient()

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
        pt_footer: ""
      })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo template")
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
  const totalUsage = templates.reduce((sum: number, t: any) => sum + (t.usage_count || 0), 0)
  const mostUsedTemplate = templates.length > 0 ? templates.reduce((prev: any, current: any) =>
    (prev.usage_count || 0) > (current.usage_count || 0) ? prev : current,
  ) : { pt_title: "N/A", usage_count: 0 }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.pt_country_id || !formData.pt_title || !formData.pt_content) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }
    
    const payload = {
      pt_country_id: Number(formData.pt_country_id),
      pt_title: formData.pt_title.trim(),
      pt_content: formData.pt_content.trim(),
      pt_footer: formData.pt_footer.trim()
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
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
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
                    <TabsTrigger value="content">Nội dung</TabsTrigger>
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
                    <div className="space-y-2">
                      <Label htmlFor="pt_content">Nội dung Template *</Label>
                      <Textarea
                        id="pt_content"
                        value={formData.pt_content}
                        onChange={(e) => handleInputChange('pt_content', e.target.value)}
                        className="h-40 font-mono text-sm"
                        placeholder="Sử dụng {product_name}, {price}, {product_code}, {category_name}, {print_date}"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pt_footer">Footer</Label>
                      <Textarea 
                        id="pt_footer" 
                        value={formData.pt_footer}
                        onChange={(e) => handleInputChange('pt_footer', e.target.value)}
                        placeholder="Footer template..." 
                      />
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Biến có thể sử dụng:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {["product_name", "price", "product_code", "category_name", "print_date"].map((variable) => (
                          <Badge key={variable} variant="secondary" className="text-xs">
                            {`{${variable}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="preview" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px]">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Xem trước Template:
                      </h4>
                      <div className="bg-white p-4 rounded border font-mono text-sm whitespace-pre-wrap">
                        {formData.pt_content || "Template preview sẽ hiển thị ở đây..."}
                      </div>
                      {formData.pt_footer && (
                        <div className="mt-3 p-3 bg-white rounded border text-sm">
                          <strong>Footer:</strong> {formData.pt_footer}
                        </div>
                      )}
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
            <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
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
            <div className="text-2xl font-bold text-purple-600">{mostUsedTemplate.usage_count}</div>
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
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Nội dung template:</div>
                  <div className="text-sm font-mono text-gray-700 line-clamp-3">{template.pt_content}</div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Printer className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{template.usage_count}</span>
                    <span className="text-muted-foreground">lượt sử dụng</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(template.last_used).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mức độ sử dụng</span>
                    <span>{Math.round((template.usage_count / totalUsage) * 100)}%</span>
                  </div>
                                      <Progress value={(template.usage_count / totalUsage) * 100} className="h-2" />
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
                        <div className="text-sm font-mono truncate">{template.pt_content}</div>
                        <div className="flex gap-1 mt-1">
                          {(template.variables || []).slice(0, 2).map((variable: any) => (
                            <Badge key={variable} variant="secondary" className="text-xs">
                              {`{${variable}}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">{template.usage_count}</Badge>
                        <div className="w-16">
                          <Progress value={(template.usage_count / totalUsage) * 100} className="h-1" />
                        </div>
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
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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
                          <DropdownMenuItem className="text-red-600">
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
                <div className="font-medium">{selectedTemplate?.usage_count}</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Lần cuối sử dụng:</span>
                <div className="font-medium">
                  {selectedTemplate?.last_used && new Date(selectedTemplate.last_used).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Nội dung Template:
              </h4>
              <div className="bg-white p-4 rounded border font-mono text-sm whitespace-pre-wrap">
                {selectedTemplate?.pt_content}
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Footer:</h4>
              <p className="text-sm bg-white p-3 rounded border">{selectedTemplate?.pt_footer}</p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Biến được sử dụng:
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate?.variables?.map((variable: string) => (
                  <Badge key={variable} variant="secondary" className="text-xs">
                    {`{${variable}}`}
                  </Badge>
                ))}
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
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="content">Nội dung</TabsTrigger>
              <TabsTrigger value="analytics">Thống kê</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_title">Tiêu đề Template</Label>
                  <Input id="edit_title" defaultValue={selectedTemplate?.pt_title} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_country">Quốc gia</Label>
                  <Select defaultValue={selectedTemplate?.pt_country_code}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    {countries?.map((country: any) => (
                      <SelectItem key={country.country_id} value={country.country_code}>
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
              <div className="space-y-2">
                <Label htmlFor="edit_content">Nội dung Template</Label>
                <Textarea
                  id="edit_content"
                  className="h-40 font-mono text-sm"
                  defaultValue={selectedTemplate?.pt_content}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_footer">Footer</Label>
                <Textarea id="edit_footer" defaultValue={selectedTemplate?.pt_footer} />
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Lượt sử dụng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{selectedTemplate?.usage_count}</div>
                    <Progress value={(selectedTemplate?.usage_count / totalUsage) * 100} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Lần cuối sử dụng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">
                      {selectedTemplate?.last_used && new Date(selectedTemplate.last_used).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedTemplate?.last_used && new Date(selectedTemplate.last_used).toLocaleTimeString("vi-VN")}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-2">
                <Label>Biến được sử dụng</Label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                  {selectedTemplate?.variables?.map((variable: string) => (
                    <Badge key={variable} variant="secondary">
                      {`{${variable}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
