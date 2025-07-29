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
import { Label } from "@/components/ui/label"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Globe, Flag, MapPin, FileText, TrendingUp, Loader2, Grid, List } from "lucide-react"
import { getCountries, createCountry, updateCountry, deleteCountry } from "@/services/CountryService"
import { toast } from "sonner"
import { useLang } from "@/lang/useLang"

// Helper function to get flag emoji from country code
const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function CountriesPage() {
  const { t } = useLang()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingCountry, setEditingCountry] = useState<any>(null)
  const [deletingCountry, setDeletingCountry] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table')
  const [formData, setFormData] = useState({
    country_name: "",
    country_code: ""
  })

  const queryClient = useQueryClient()

  // Đọc search parameter từ URL khi component mount
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

  // Fetch countries data
  const { data: countries = [], isLoading, error, refetch } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
  })

  // Create country mutation
  const createCountryMutation = useMutation({
    mutationFn: createCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] })
      toast.success(t('countries.toasts.createSuccess'))
      setIsCreateDialogOpen(false)
      setFormData({ country_name: "", country_code: "" })
    },
    onError: (error: any) => {
      if (error?.status === 409) {
        toast.error(t('countries.toasts.createErrorDuplicate'))
      } else {
      toast.error(t('countries.toasts.createError'))
      }
    }
  })

  // Update country mutation
  const updateCountryMutation = useMutation({
    mutationFn: ({ id, item }: { id: number; item: any }) => updateCountry(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] })
      toast.success(t('countries.toasts.updateSuccess'))
      setIsEditDialogOpen(false)
      setEditingCountry(null)
      setFormData({ country_name: "", country_code: "" })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('countries.toasts.updateError'))
    }
  })

  // Delete country mutation
  const deleteCountryMutation = useMutation({
    mutationFn: deleteCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] })
      toast.success(t('countries.toasts.deleteSuccess'))
      setIsDeleteDialogOpen(false)
      setDeletingCountry(null)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('countries.toasts.deleteError'))
    }
  })

  // Filter countries based on search term
  const filteredCountries = countries.filter((country: any) =>
    country.country_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.country_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle form submission for create
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.country_name.trim() || !formData.country_code.trim()) {
      toast.error(t('countries.validation.fillAllFields'))
      return
    }
    createCountryMutation.mutate(formData)
  }

  // Handle form submission for update
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.country_name.trim() || !formData.country_code.trim()) {
      toast.error(t('countries.validation.fillAllFields'))
      return
    }
    updateCountryMutation.mutate({
      id: editingCountry.country_id,
      item: {
        country_name: formData.country_name,
        country_code: formData.country_code
      }
    })
  }

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle edit button click
  const handleEdit = (country: any) => {
    setEditingCountry(country)
    setFormData({
      country_name: country.country_name,
      country_code: country.country_code
    })
    setIsEditDialogOpen(true)
  }

  // Handle delete button click
  const handleDelete = (country: any) => {
    setDeletingCountry(country)
    setIsDeleteDialogOpen(true)
  }

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (deletingCountry) {
      deleteCountryMutation.mutate(deletingCountry.country_id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-slate-600">{t('countries.loading')}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 mb-2">{t('countries.error')}</div>
          <Button onClick={() => refetch()} variant="outline">
            {t('countries.retry')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-800 bg-clip-text text-transparent">
            {t('countries.title')}
          </h1>
          <p className="text-slate-600 mt-2">{t('countries.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white rounded-lg border shadow-sm">
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("card")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                <Plus className="mr-2 h-4 w-4" />
                {t('countries.create.button')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-slate-900">{t('countries.create.title')}</DialogTitle>
                <DialogDescription className="text-slate-600">{t('countries.create.subtitle')}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="country_name" className="text-right font-medium text-slate-700">
                      {t('countries.create.fields.name')}
                    </Label>
                    <Input
                      id="country_name"
                      value={formData.country_name}
                      onChange={(e) => handleInputChange('country_name', e.target.value)}
                      className="col-span-3 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      placeholder={t('countries.create.placeholders.name')}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="country_code" className="text-right font-medium text-slate-700">
                      {t('countries.create.fields.code')}
                    </Label>
                    <Input
                      id="country_code"
                      value={formData.country_code}
                      onChange={(e) => handleInputChange('country_code', e.target.value.toUpperCase())}
                      placeholder={t('countries.create.placeholders.code')}
                      className="col-span-3 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl"
                    disabled={createCountryMutation.isPending}
                  >
                    {createCountryMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('countries.create.buttons.adding')}
                      </>
                    ) : (
                      t('countries.create.buttons.add')
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">{t('countries.edit.title')}</DialogTitle>
            <DialogDescription className="text-slate-600">{t('countries.edit.subtitle')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit}>
            <div className="grid gap-6 py-4">
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit_country_name" className="text-right font-medium text-slate-700">
                      {t('countries.edit.fields.name')}
                    </Label>
                    <Input
                      id="edit_country_name"
                      value={formData.country_name}
                      onChange={(e) => handleInputChange('country_name', e.target.value)}
                      className="col-span-3 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      placeholder={t('countries.edit.placeholders.name')}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit_country_code" className="text-right font-medium text-slate-700">
                      {t('countries.edit.fields.code')}
                    </Label>
                    <Input
                      id="edit_country_code"
                      value={formData.country_code}
                      onChange={(e) => handleInputChange('country_code', e.target.value.toUpperCase())}
                      placeholder={t('countries.edit.placeholders.code')}
                      className="col-span-3 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl"
                disabled={updateCountryMutation.isPending}
              >
                {updateCountryMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('countries.edit.buttons.updating')}
                  </>
                ) : (
                  t('countries.edit.buttons.update')
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">{t('countries.delete.title')}</DialogTitle>
            <DialogDescription className="text-slate-600">
              {t('countries.delete.description', { 
                name: deletingCountry?.country_name, 
                code: deletingCountry?.country_code 
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl">{deletingCountry && getFlagEmoji(deletingCountry.country_code)}</div>
            <div>
              <div className="font-semibold text-red-800">{deletingCountry?.country_name}</div>
              <div className="text-sm text-red-600">{t('countries.delete.code')}: {deletingCountry?.country_code}</div>
            </div>
          </div>
          <DialogFooter className="space-x-2">
            <Button 
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteCountryMutation.isPending}
            >
              {t('countries.delete.buttons.cancel')}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteCountryMutation.isPending}
            >
              {deleteCountryMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('countries.delete.buttons.deleting')}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('countries.delete.buttons.delete')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">{t('countries.stats.totalCountries')}</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{countries.length}</div>
            <div className="flex items-center text-xs text-blue-600 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              {t('countries.stats.active')}
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">{t('countries.stats.totalProducts')}</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Flag className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">
              {countries.reduce((total: number, country: any) => total + (country.total_product || 0), 0)}
            </div>
            <p className="text-xs text-green-600 mt-1">{t('countries.stats.acrossAllCountries')}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">{t('countries.stats.printTemplates')}</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">
              {countries.reduce((total: number, country: any) => total + (country.total_template || 0), 0)}
            </div>
            <p className="text-xs text-purple-600 mt-1">{t('countries.stats.totalTemplates')}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">{t('countries.stats.avgProducts')}</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">
              {countries.length > 0 ? Math.round(countries.reduce((total: number, country: any) => total + (country.total_product || 0), 0) / countries.length * 10) / 10 : 0}
            </div>
            <p className="text-xs text-orange-600 mt-1">{t('countries.stats.productsPerCountry')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">{t('countries.search.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={t('countries.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Countries Display */}
      {viewMode === 'table' ? (
        /* Table View */
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
          <CardHeader>
            <CardTitle className="text-slate-900">{t('countries.table.title')}</CardTitle>
            <CardDescription>{t('countries.table.description', { count: filteredCountries.length })}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-slate-50/50">
                  <TableHead className="text-slate-600 font-semibold">{t('countries.table.headers.country')}</TableHead>
                  <TableHead className="text-slate-600 font-semibold">{t('countries.table.headers.code')}</TableHead>
                  <TableHead className="text-slate-600 font-semibold">{t('countries.table.headers.products')}</TableHead>
                  <TableHead className="text-slate-600 font-semibold">{t('countries.table.headers.templates')}</TableHead>
                  <TableHead className="text-slate-600 font-semibold">{t('countries.table.headers.createdAt')}</TableHead>
                  <TableHead className="text-right text-slate-600 font-semibold">{t('countries.table.headers.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCountries.map((country: any) => (
                  <TableRow key={country.country_id} className="hover:bg-slate-50/80 transition-colors duration-200">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getFlagEmoji(country.country_code)}</div>
                        <span className="font-semibold text-slate-900">{country.country_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-300 text-slate-700 rounded-lg">
                        {country.country_code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
                        {country.total_product || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                        {country.total_template || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-600">
                        {new Date(country.created_at).toLocaleDateString("vi-VN")}
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
                          <DropdownMenuLabel>{t('countries.table.actions')}</DropdownMenuLabel>
                          <DropdownMenuItem 
                            className="hover:bg-slate-50/80 rounded-lg"
                            onClick={() => handleEdit(country)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('countries.table.edit')}
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                            <FileText className="mr-2 h-4 w-4" />
                            Xem Template
                          </DropdownMenuItem> */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 hover:bg-red-50/80 rounded-lg"
                            onClick={() => handleDelete(country)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('countries.table.delete')}
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
      ) : (
        /* Card View */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCountries.map((country: any) => (
            <Card
              key={country.country_id}
              className="relative overflow-hidden bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full -mr-10 -mt-10"></div>
              <CardHeader className="pb-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{getFlagEmoji(country.country_code)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{country.country_name}</h3>
                      <Badge variant="outline" className="border-slate-300 text-slate-700 rounded-lg mt-1">
                        {country.country_code}
                      </Badge>
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
                      <DropdownMenuLabel>{t('countries.table.actions')}</DropdownMenuLabel>
                      <DropdownMenuItem 
                        className="hover:bg-slate-50/80 rounded-lg"
                        onClick={() => handleEdit(country)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {t('countries.table.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                        <FileText className="mr-2 h-4 w-4" />
                        Xem Template
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 hover:bg-red-50/80 rounded-lg"
                        onClick={() => handleDelete(country)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('countries.table.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{t('countries.cards.products')}:</span>
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
                      {country.total_product || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{t('countries.cards.templates')}:</span>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                      {country.total_template || 0}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                    {t('countries.cards.created')}: {new Date(country.created_at).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
