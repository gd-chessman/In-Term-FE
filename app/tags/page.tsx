"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Tag, Hash, TrendingUp, Eye, Grid, List } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTags, createTag, deleteTag, updateTag, getTagStatistics } from "@/services/TagService"
import { toast } from "sonner"
import { useLang } from "@/lang/useLang"

export default function TagsPage() {
  const { t } = useLang()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [formData, setFormData] = useState({
    tag_name: "",
    tag_description: ""
  })
  const [editingTag, setEditingTag] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<any>(null)

  const queryClient = useQueryClient()

  // Đọc search parameter từ URL khi component mount
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

  // Fetch tags data
  const { data: tags = [], isLoading, error } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  })

  // Fetch tag statistics
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["tagStats"],
    queryFn: getTagStatistics,
  })

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      toast.success(t('tags.toasts.createSuccess.message'))
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      setIsCreateDialogOpen(false)
      setFormData({ tag_name: "", tag_description: "" })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('tags.toasts.createError.message'))
    }
  })

  // Update tag mutation
  const updateTagMutation = useMutation({
    mutationFn: ({ id, item }: { id: number; item: any }) => updateTag(id, item),
    onSuccess: () => {
      toast.success(t('tags.toasts.updateSuccess.message'))
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      setIsEditDialogOpen(false)
      setEditingTag(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('tags.toasts.updateError.message'))
    }
  })

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      toast.success(t('tags.toasts.deleteSuccess.message'))
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      setDeleteDialogOpen(false)
      setTagToDelete(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('tags.toasts.deleteError.message'))
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.tag_name.trim()) {
      toast.error(t('tags.validation.tagNameRequired'))
      return
    }

    const payload = {
      tag_name: formData.tag_name.trim(),
      tag_description: formData.tag_description.trim()
    }

    createTagMutation.mutate(payload)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.tag_name.trim()) {
      toast.error(t('tags.validation.tagNameRequired'))
      return
    }

    const payload = {
      tag_name: formData.tag_name.trim(),
      tag_description: formData.tag_description.trim()
    }

    updateTagMutation.mutate({
      id: editingTag.tag_id,
      item: payload
    })
  }

  const handleEditClick = (tag: any) => {
    setEditingTag(tag)
    setFormData({
      tag_name: tag.tag_name,
      tag_description: tag.tag_description
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (tag: any) => {
    setTagToDelete(tag)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (tagToDelete) {
      deleteTagMutation.mutate(tagToDelete.tag_id)
    }
  }

  // Filter tags based on search term
  const filteredTags = tags.filter((tag: any) =>
    tag.tag_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.tag_description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {t('tags.title')}
            </h1>
            <p className="text-muted-foreground">{t('tags.table.loading.loading')}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {t('tags.title')}
            </h1>
            <p className="text-red-600">{t('tags.toasts.createError.message')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {t('tags.title')}
          </h1>
          <p className="text-muted-foreground">{t('tags.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white rounded-lg border shadow-sm">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
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
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Plus className="mr-2 h-4 w-4" />
                {t('tags.create.buttons.create')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Tag className="h-4 w-4 text-white" />
                  </div>
                  {t('tags.create.title')}
                </DialogTitle>
                <DialogDescription>{t('tags.create.subtitle')}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="tag_name">{t('tags.create.fields.name')}</Label>
                    <Input 
                      id="tag_name" 
                      name="tag_name"
                      value={formData.tag_name}
                      onChange={handleInputChange}
                      placeholder={t('tags.create.placeholders.name')} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tag_description">{t('tags.create.fields.description')}</Label>
                    <Textarea 
                      id="tag_description" 
                      name="tag_description"
                      value={formData.tag_description}
                      onChange={handleInputChange}
                      placeholder={t('tags.create.placeholders.description')} 
                      rows={3} 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    {t('tags.delete.buttons.cancel')}
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createTagMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-blue-700"
                  >
                    {createTagMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {t('tags.create.loading.creating')}
                      </>
                    ) : (
                      t('tags.create.buttons.create')
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">{t('tags.stats.totalTags')}</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Tag className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{isLoadingStats ? '...' : stats?.totalTags}</div>
            <p className="text-xs text-blue-700">{t('tags.stats.totalTags')}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">{t('tags.stats.totalProducts')}</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-500 flex items-center justify-center">
              <Hash className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{isLoadingStats ? '...' : stats?.totalProducts}</div>
            <p className="text-xs text-green-700">{t('tags.stats.totalProducts')}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">{t('tags.stats.popularTag')}</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{isLoadingStats ? '...' : stats?.popularTag}</div>
            <p className="text-xs text-purple-700">{t('tags.stats.popularTagId')}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">{t('tags.stats.avgProductsPerTag')}</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Hash className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{isLoadingStats ? '...' : stats?.avgProductsPerTag}</div>
            <p className="text-xs text-orange-700">{t('tags.stats.productsPerTag')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search */}
      <Card className="bg-gradient-to-r from-gray-50 to-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-600" />
            {t('tags.search.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('tags.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Conditional Rendering based on View Mode */}
      {viewMode === "cards" ? (
        /* Enhanced Tags Grid */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTags.map((tag: any) => (
            <Card
              key={tag.tag_id}
              className="hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50 border-gray-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium">{tag.tag_name}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <span className="sr-only">{t('tags.accessibility.openMenu')}</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>{t('tags.table.actions')}</DropdownMenuLabel>
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => handleEditClick(tag)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {t('tags.table.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDeleteClick(tag)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('tags.table.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{tag.tag_description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {t('tags.labels.idWithColon')} {tag.tag_id}
                    </Badge>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t('tags.cards.created')}: {new Date(tag.created_at).toLocaleDateString("vi-VN")}</span>
                    <span>{t('tags.labels.updated')}: {new Date(tag.updated_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Enhanced Tags Table */
        <Card className="bg-gradient-to-r from-white to-gray-50">
          <CardHeader>
            <CardTitle>{t('tags.table.title')}</CardTitle>
            <CardDescription>{t('tags.table.description', { count: filteredTags.length })}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>{t('tags.table.headers.tag')}</TableHead>
                  <TableHead>{t('tags.table.headers.description')}</TableHead>
                  <TableHead>{t('tags.labels.id')}</TableHead>
                  <TableHead>{t('tags.table.headers.createdAt')}</TableHead>
                  <TableHead>{t('tags.labels.updated')}</TableHead>
                  <TableHead className="text-right">{t('tags.table.headers.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.map((tag: any) => (
                  <TableRow key={tag.tag_id} className="hover:bg-blue-50/50 transition-colors">
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium">{tag.tag_name}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm">{tag.tag_description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {tag.tag_id}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(tag.created_at).toLocaleDateString("vi-VN")}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(tag.updated_at).toLocaleDateString("vi-VN")}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{t('tags.accessibility.openMenu')}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t('tags.table.actions')}</DropdownMenuLabel>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleEditClick(tag)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('tags.table.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteClick(tag)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('tags.table.delete')}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('tags.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('tags.delete.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('tags.delete.buttons.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteTagMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteTagMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {t('tags.delete.loading.deleting')}
                </>
              ) : (
                t('tags.delete.buttons.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Tag Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Edit className="h-4 w-4 text-white" />
              </div>
              {t('tags.edit.title')}
            </DialogTitle>
            <DialogDescription>{t('tags.edit.subtitle')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_tag_name">{t('tags.edit.fields.name')}</Label>
                <Input 
                  id="edit_tag_name" 
                  name="tag_name"
                  value={formData.tag_name}
                  onChange={handleInputChange}
                  placeholder={t('tags.edit.placeholders.name')} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_tag_description">{t('tags.edit.fields.description')}</Label>
                <Textarea 
                  id="edit_tag_description" 
                  name="tag_description"
                  value={formData.tag_description}
                  onChange={handleInputChange}
                  placeholder={t('tags.edit.placeholders.description')} 
                  rows={3} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                {t('tags.delete.buttons.cancel')}
              </Button>
              <Button 
                type="submit"
                disabled={updateTagMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-blue-700"
              >
                {updateTagMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {t('tags.edit.loading.updating')}
                  </>
                ) : (
                  t('tags.edit.buttons.update')
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
