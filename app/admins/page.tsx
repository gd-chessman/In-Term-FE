"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { createAdmin, getAdmins, getStatistics, updateStatus, updateLevel, getUserMe, updateAdminBranch } from "@/services/AdminService"
import { getRoles } from "@/services/RoleService"
import { getActiveBranches } from "@/services/BranchService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { toast } from "sonner"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Shield, Eye, Users, UserCheck, UserX, Crown, Loader2, Building2 } from "lucide-react"
import { useLang } from "@/lang/useLang"

// Admin levels constants
const ADMIN_LEVELS = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "moderator", label: "Moderator" },
  { value: "support", label: "Support" },
]

// Admin statuses constants
const ADMIN_STATUSES = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Không hoạt động" },
  { value: "suspended", label: "Tạm khóa" },
]

export default function AdminsPage() {
  const { t } = useLang()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateLevelDialogOpen, setIsUpdateLevelDialogOpen] = useState(false)
  const [isUpdateBranchDialogOpen, setIsUpdateBranchDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null)
  const [selectedNewLevel, setSelectedNewLevel] = useState("")
  const [selectedNewBranch, setSelectedNewBranch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [formData, setFormData] = useState({
    admin_username: "",
    admin_email: "",
    admin_password: "",
    admin_fullname: "",
    admin_level: "",
    admin_role_id: "",
    admin_branch_id: ""
  })
  const queryClient = useQueryClient()

  // Đọc search parameter từ URL khi component mount
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

  const { data: userMe, isLoading: userMeLoading, error: userMeError } = useQuery({
    queryKey: ["userMe"],
    queryFn: getUserMe,
  })

  // Fetch admins data
  const { data: adminsData, isLoading, error } = useQuery({
    queryKey: ["admins", currentPage, searchTerm, selectedLevel, selectedStatus],
    queryFn: () => getAdmins(currentPage, 10, searchTerm, selectedLevel, selectedStatus),
  })

  // Fetch roles data
  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  })

  // Fetch active branches data
  const { data: branches, isLoading: branchesLoading } = useQuery({
    queryKey: ["active-branches"],
    queryFn: getActiveBranches,
  })

  // Fetch statistics data
  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-statistics"],
    queryFn: getStatistics,
  })

  const admins = adminsData?.data?.admins || []
  const pagination = adminsData?.data?.pagination || { page: 1, limit: 10, total: 0, total_pages: 1 }

  const createAdminMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      toast.success(t('admins.toasts.userCreated.description'))
      setIsCreateDialogOpen(false)
      setFormData({
        admin_username: "",
        admin_email: "",
        admin_password: "",
        admin_fullname: "",
        admin_level: "",
        admin_role_id: "",
        admin_branch_id: ""
      })
      // Refresh admin list
      queryClient.invalidateQueries({ queryKey: ["admins"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('admins.toasts.userCreatedError.description'))
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => updateStatus(id, status),
    onSuccess: () => {
      toast.success(t('admins.toasts.statusUpdated.description'))
      // Refresh admin list and statistics
      queryClient.invalidateQueries({ queryKey: ["admins"] })
      queryClient.invalidateQueries({ queryKey: ["admin-statistics"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('admins.toasts.statusUpdatedError.description'))
    }
  })

  const updateLevelMutation = useMutation({
    mutationFn: ({ id, level }: { id: string, level: string }) => updateLevel(id, level),
    onSuccess: () => {
      toast.success(t('admins.toasts.levelUpdated.description'))
      setIsUpdateLevelDialogOpen(false)
      setSelectedAdmin(null)
      setSelectedNewLevel("")
      // Refresh admin list and statistics
      queryClient.invalidateQueries({ queryKey: ["admins"] })
      queryClient.invalidateQueries({ queryKey: ["admin-statistics"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('admins.toasts.levelUpdatedError.description'))
    }
  })

  const updateBranchMutation = useMutation({
    mutationFn: ({ id, branch_id }: { id: string, branch_id: string }) => updateAdminBranch(id, branch_id),
    onSuccess: () => {
      toast.success(t('admins.toasts.branchUpdated.description'))
      setIsUpdateBranchDialogOpen(false)
      setSelectedAdmin(null)
      setSelectedNewBranch("")
      // Refresh admin list and statistics
      queryClient.invalidateQueries({ queryKey: ["admins"] })
      queryClient.invalidateQueries({ queryKey: ["admin-statistics"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('admins.toasts.branchUpdatedError.description'))
    }
  })

  const handleStatusUpdate = (adminId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: adminId, status: newStatus })
  }

  const handleLevelUpdate = (admin: any) => {
    setSelectedAdmin(admin)
    setSelectedNewLevel(admin.admin_level)
    setIsUpdateLevelDialogOpen(true)
  }

  const handleBranchUpdate = (admin: any) => {
    setSelectedAdmin(admin)
    setSelectedNewBranch(admin.branch?.branch_id?.toString() || "none")
    setIsUpdateBranchDialogOpen(true)
  }

  const handleConfirmLevelUpdate = () => {
    if (selectedAdmin && selectedNewLevel) {
      updateLevelMutation.mutate({ id: selectedAdmin.admin_id.toString(), level: selectedNewLevel })
    }
  }

  const handleConfirmBranchUpdate = () => {
    if (selectedAdmin && selectedNewBranch) {
      const branchId = selectedNewBranch === "none" ? "" : selectedNewBranch
      updateBranchMutation.mutate({ id: selectedAdmin.admin_id.toString(), branch_id: branchId })
    }
  }

  const handleCreateAdmin = () => {
    if (!formData.admin_username || !formData.admin_email || !formData.admin_password || 
        !formData.admin_fullname || !formData.admin_level || !formData.admin_role_id || !formData.admin_branch_id) {
      toast.error(t('admins.createUser.validation'))
      return
    }

    const payload = {
      ...formData,
      admin_role_id: parseInt(formData.admin_role_id),
      admin_branch_id: parseInt(formData.admin_branch_id)
    }

    createAdminMutation.mutate(payload)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Helper functions to get labels from values
  const getLevelBadge = (level: string) => {
    switch (level) {
      case "super_admin":
        return (
          <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 text-white border-0 shadow-lg">
            <Crown className="w-3 h-3 mr-1" />
            {getLevelLabel(level)}
          </Badge>
        )
      case "admin":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 text-white border-0 shadow-lg">
            <Shield className="w-3 h-3 mr-1" />
            {getLevelLabel(level)}
          </Badge>
        )
      case "moderator":
        return (
          <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400 text-white border-0 shadow-lg">
            <UserCheck className="w-3 h-3 mr-1" />
            {getLevelLabel(level)}
          </Badge>
        )
      case "support":
        return (
          <Badge className="bg-gradient-to-r from-gray-500 to-slate-500 dark:from-gray-400 dark:to-slate-400 text-white border-0 shadow-lg">
            <Users className="w-3 h-3 mr-1" />
            {getLevelLabel(level)}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{getLevelLabel(level)}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 text-white border-0">
            {getStatusLabel(status)}
          </Badge>
        )
      case "inactive":
        return (
          <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600 text-white border-0">
            {getStatusLabel(status)}
          </Badge>
        )
      case "suspended":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 dark:from-red-400 dark:to-pink-400 text-white border-0">
            {getStatusLabel(status)}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{getStatusLabel(status)}</Badge>
    }
  }

  // Helper functions to get translated labels
  const getLevelLabel = (value: string) => {
    const levelMap: { [key: string]: string } = {
      "super_admin": t('admins.levels.super_admin'),
      "admin": t('admins.levels.admin'),
      "moderator": t('admins.levels.moderator'),
      "support": t('admins.levels.support')
    }
    return levelMap[value] || value
  }

  const getStatusLabel = (value: string) => {
    const statusMap: { [key: string]: string } = {
      "active": t('admins.status.active'),
      "inactive": t('admins.status.inactive'),
      "suspended": t('admins.status.suspended')
    }
    return statusMap[value] || value
  }


  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 dark:from-gray-100 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            {t('admins.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('admins.subtitle')}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              {t('admins.addUser')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 backdrop-blur-xl border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t('admins.createUser.title')}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                {t('admins.createUser.subtitle')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  {t('admins.createUser.fields.username')}
                </Label>
                <Input
                  id="username"
                  value={formData.admin_username}
                  onChange={(e) => handleInputChange("admin_username", e.target.value)}
                  className="col-span-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900"
                  placeholder={t('admins.createUser.placeholders.username')}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  {t('admins.createUser.fields.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.admin_email}
                  onChange={(e) => handleInputChange("admin_email", e.target.value)}
                  className="col-span-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900"
                  placeholder={t('admins.createUser.placeholders.email')}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullname" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  {t('admins.createUser.fields.fullname')}
                </Label>
                <Input
                  id="fullname"
                  value={formData.admin_fullname}
                  onChange={(e) => handleInputChange("admin_fullname", e.target.value)}
                  className="col-span-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900"
                  placeholder={t('admins.createUser.placeholders.fullname')}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="level" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  {t('admins.createUser.fields.level')}
                </Label>
                <Select value={formData.admin_level} onValueChange={(value) => handleInputChange("admin_level", value)}>
                  <SelectTrigger className="col-span-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900">
                    <SelectValue placeholder={t('admins.createUser.placeholders.level')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
                    {ADMIN_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {getLevelLabel(level.value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  {t('admins.createUser.fields.role')}
                </Label>
                <Select value={formData.admin_role_id} onValueChange={(value) => handleInputChange("admin_role_id", value)}>
                  <SelectTrigger className="col-span-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900">
                    <SelectValue placeholder={t('admins.createUser.placeholders.role')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
                    {rolesLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2 text-sm">{t('admins.createUser.loading')}</span>
                      </div>
                    ) : (
                      roles.map((role: any) => (
                        <SelectItem key={role.role_id} value={role.role_id.toString()}>
                          {role.role_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="branch" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  {t('admins.createUser.fields.branch')}
                </Label>
                <Select value={formData.admin_branch_id} onValueChange={(value) => handleInputChange("admin_branch_id", value)}>
                  <SelectTrigger className="col-span-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900">
                    <SelectValue placeholder={t('admins.createUser.placeholders.branch')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
                    {branchesLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2 text-sm">{t('admins.createUser.loading')}</span>
                      </div>
                    ) : (
                      branches?.map((branch: any) => (
                        <SelectItem key={branch.branch_id} value={branch.branch_id.toString()}>
                          {branch.branch_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right font-medium text-gray-700 dark:text-gray-300">
                  {t('admins.createUser.fields.password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.admin_password}
                  onChange={(e) => handleInputChange("admin_password", e.target.value)}
                  className="col-span-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900"
                  placeholder={t('admins.createUser.placeholders.password')}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleCreateAdmin}
                disabled={createAdminMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600 text-white rounded-xl"
              >
                {createAdminMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('admins.createUser.creating')}
                  </>
                ) : (<>
                      {t('admins.createUser.create')}
                    </>
                  )}
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200/50 dark:border-purple-800/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 dark:from-purple-400/30 dark:to-indigo-400/30 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('admins.stats.totalUsers')}</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {statsLoading ? "..." : statistics.total || 0}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">{t('admins.stats.totalUsersDesc')}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 dark:from-green-400/30 dark:to-emerald-400/30 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('admins.stats.activeUsers')}</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {statsLoading ? "..." : statistics.by_status?.active || 0}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {statsLoading ? "..." : statistics.total ? Math.round((statistics.by_status?.active || 0) / statistics.total * 100) : 0}% tổng số
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200/50 dark:border-orange-800/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 dark:from-orange-400/30 dark:to-red-400/30 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('admins.stats.inactiveUsers')}</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <UserX className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {statsLoading ? "..." : (statistics.by_status?.inactive || 0) + (statistics.by_status?.suspended || 0)}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">{t('admins.stats.inactiveUsersDesc')}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/50 dark:border-blue-800/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 dark:from-blue-400/30 dark:to-cyan-400/30 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('admins.stats.roles')}</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {rolesLoading ? "..." : roles.length}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{t('admins.stats.totalRoles')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/60 dark:border-gray-700/60 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">{t('admins.search.title')}</CardTitle>
        </CardHeader>
        <CardContent>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder={t('admins.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900">
                    <SelectValue placeholder={t('admins.search.status')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
                    <SelectItem value="all">{t('admins.search.all')}</SelectItem>
                    {ADMIN_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {getStatusLabel(status.value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900">
                    <SelectValue placeholder={t('admins.search.level')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
                    <SelectItem value="all">{t('admins.search.all')}</SelectItem>
                    {ADMIN_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {getLevelLabel(level.value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
        </CardContent>
      </Card>

      {/* Admins Table */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/60 dark:border-gray-700/60 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">{t('admins.table.title')}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {isLoading ? t('admins.table.loading') : t('admins.table.totalUsers', { count: pagination.total })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">{t('admins.table.loadingData')}</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-red-600 dark:text-red-400">{t('admins.table.error')}</span>
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="lg:hidden space-y-4">
                {admins.map((admin: any) => (
              <Card
                key={admin.admin_id}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/60 dark:border-gray-700/60 hover:shadow-xl transition-all duration-300 rounded-xl"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 ring-2 ring-gray-200/60 dark:ring-gray-700/60 shadow-md">
                          <AvatarImage src={admin.admin_avatar} alt={admin.admin_fullname} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 text-white font-semibold">
                            {admin.admin_fullname
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{admin.admin_fullname}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">@{admin.admin_username}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{admin.admin_email}</div>
                      </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          >
                            <span className="sr-only">{t('admins.table.openMenu')}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-gray-200/60 dark:border-gray-700/60 shadow-xl rounded-xl"
                        >
                          <DropdownMenuLabel>{t('admins.table.actions')}</DropdownMenuLabel>
                          {/* <DropdownMenuItem className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 rounded-lg">
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem> */}
                          {admin.admin_id !== userMe?.admin_id && (
                            <DropdownMenuItem 
                              onClick={() => handleLevelUpdate(admin)}
                              className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 rounded-lg"
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              {t('admins.table.actions.assignRole')}
                            </DropdownMenuItem>
                          )}
                          {admin.admin_id === userMe?.admin_id && (
                            <DropdownMenuItem 
                              onClick={() => handleBranchUpdate(admin)}
                              className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 rounded-lg"
                            >
                              <Building2 className="mr-2 h-4 w-4" />
                              {t('admins.table.actions.changeBranch')}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {admin.admin_id !== userMe?.admin_id && (
                            <>
                              {admin.admin_status === "active" ? (
                                <>
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusUpdate(admin.admin_id.toString(), "inactive")}
                                    disabled={updateStatusMutation.isPending}
                                    className="text-orange-600 dark:text-orange-400 hover:bg-orange-50/80 dark:hover:bg-orange-900/20 rounded-lg"
                                  >
                                    <UserX className="mr-2 h-4 w-4" />
                                    {t('admins.table.actions.deactivate')}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusUpdate(admin.admin_id.toString(), "suspended")}
                                    disabled={updateStatusMutation.isPending}
                                    className="text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-lg"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t('admins.table.actions.suspend')}
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <DropdownMenuItem 
                                  onClick={() => handleStatusUpdate(admin.admin_id.toString(), "active")}
                                  disabled={updateStatusMutation.isPending}
                                  className="text-green-600 dark:text-green-400 hover:bg-green-50/80 dark:hover:bg-green-900/20 rounded-lg"
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  {t('admins.table.actions.activate')}
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('admins.table.role')}:</span>
                      {getLevelBadge(admin.admin_level)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('admins.table.level')}:</span>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {getLevelLabel(admin.admin_level)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('admins.table.role')}:</span>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {admin.role?.role_name || t('admins.table.noRole')}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('admins.table.branch')}:</span>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {admin.branch?.branch_name || t('admins.table.noBranch')}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('admins.table.status')}:</span>
                      {getStatusBadge(admin.admin_status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('admins.table.lastLogin')}:</span>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {admin.admin_last_login ? new Date(admin.admin_last_login).toLocaleString("vi-VN") : t('admins.table.neverLogin')}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('admins.table.createdAt')}:</span>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {admin.created_at ? new Date(admin.created_at).toLocaleDateString("vi-VN") : t('admins.na')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">{t('admins.table.headers.admin')}</TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">{t('admins.table.headers.email')}</TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">{t('admins.table.headers.level')}</TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">{t('admins.table.headers.role')}</TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">{t('admins.table.headers.branch')}</TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">{t('admins.table.headers.status')}</TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">{t('admins.table.headers.lastLogin')}</TableHead>
                      <TableHead className="text-right text-gray-600 dark:text-gray-400 font-semibold">{t('admins.table.headers.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin: any) => (
                  <TableRow
                    key={admin.admin_id}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 ring-2 ring-gray-200/60 dark:ring-gray-700/60 shadow-md">
                          <AvatarImage src={admin.admin_avatar} alt={admin.admin_fullname} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 text-white font-semibold">
                            {admin.admin_fullname
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{admin.admin_fullname}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">@{admin.admin_username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">{admin.admin_email}</TableCell>
                    <TableCell>
                      {getLevelBadge(admin.admin_level)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {admin.role?.role_name || t('admins.table.noRole')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {admin.branch?.branch_name || t('admins.table.noBranch')}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(admin.admin_status)}</TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {admin.admin_last_login ? new Date(admin.admin_last_login).toLocaleString("vi-VN") : t('admins.table.neverLogin')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                              <span className="sr-only">{t('admins.table.openMenu')}</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-gray-200/60 dark:border-gray-700/60 shadow-xl rounded-xl"
                          >
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            {/* <DropdownMenuItem className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 rounded-lg">
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem> */}
                            {admin.admin_id !== userMe?.admin_id && (
                              <DropdownMenuItem 
                                onClick={() => handleLevelUpdate(admin)}
                                className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 rounded-lg"
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                {t('admins.table.actions.assignRole')}
                              </DropdownMenuItem>
                            )}
                            {admin.admin_id === userMe?.admin_id && (
                              <DropdownMenuItem 
                                onClick={() => handleBranchUpdate(admin)}
                                className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 rounded-lg"
                              >
                                <Building2 className="mr-2 h-4 w-4" />
                                {t('admins.table.actions.changeBranch')}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {admin.admin_id !== userMe?.admin_id && (
                              <>
                                {admin.admin_status === "active" ? (
                                  <>
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusUpdate(admin.admin_id.toString(), "inactive")}
                                      disabled={updateStatusMutation.isPending}
                                      className="text-orange-600 dark:text-orange-400 hover:bg-orange-50/80 dark:hover:bg-orange-900/20 rounded-lg"
                                    >
                                      <UserX className="mr-2 h-4 w-4" />
                                      {t('admins.table.actions.deactivate')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusUpdate(admin.admin_id.toString(), "suspended")}
                                      disabled={updateStatusMutation.isPending}
                                      className="text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-lg"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      {t('admins.table.actions.suspend')}
                                    </DropdownMenuItem>
                                  </>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusUpdate(admin.admin_id.toString(), "active")}
                                    disabled={updateStatusMutation.isPending}
                                    className="text-green-600 dark:text-green-400 hover:bg-green-50/80 dark:hover:bg-green-900/20 rounded-lg"
                                  >
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    {t('admins.table.actions.activate')}
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Update Level Dialog */}
      <Dialog open={isUpdateLevelDialogOpen} onOpenChange={setIsUpdateLevelDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 backdrop-blur-xl border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {t('admins.updateLevel.title')}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {t('admins.updateLevel.description', { name: selectedAdmin?.admin_fullname })}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-level" className="text-right font-medium text-gray-700 dark:text-gray-300">
                {t('admins.updateLevel.currentLevel')}
              </Label>
              <div className="col-span-3">
                {selectedAdmin && getLevelBadge(selectedAdmin.admin_level)}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-level" className="text-right font-medium text-gray-700 dark:text-gray-300">
                {t('admins.updateLevel.newLevel')}
              </Label>
              <Select value={selectedNewLevel} onValueChange={setSelectedNewLevel}>
                <SelectTrigger className="col-span-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900">
                  <SelectValue placeholder={t('admins.updateLevel.selectNewLevel')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
                  {ADMIN_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {getLevelLabel(level.value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleConfirmLevelUpdate}
              disabled={updateLevelMutation.isPending || !selectedNewLevel || selectedNewLevel === selectedAdmin?.admin_level}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600 text-white rounded-xl"
            >
              {updateLevelMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('admins.updateLevel.updating')}
                </>
              ) : (
                t('admins.updateLevel.updateLevel')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Branch Dialog */}
      <Dialog open={isUpdateBranchDialogOpen} onOpenChange={setIsUpdateBranchDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 backdrop-blur-xl border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {t('admins.updateBranch.title')}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {t('admins.updateBranch.description', { name: selectedAdmin?.admin_fullname })}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-branch" className="text-right font-medium text-gray-700 dark:text-gray-300">
                {t('admins.updateBranch.currentBranch')}
              </Label>
              <div className="col-span-3">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedAdmin?.branch?.branch_name || t('admins.table.noBranch')}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-branch" className="text-right font-medium text-gray-700 dark:text-gray-300">
                {t('admins.updateBranch.newBranch')}
              </Label>
              <Select value={selectedNewBranch} onValueChange={setSelectedNewBranch}>
                <SelectTrigger className="col-span-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900">
                  <SelectValue placeholder={t('admins.updateBranch.selectNewBranch')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
                  <SelectItem value="none">{t('admins.updateBranch.noBranch')}</SelectItem>
                  {branchesLoading ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2 text-sm">{t('admins.createUser.loading')}</span>
                    </div>
                  ) : (
                    branches?.map((branch: any) => (
                      <SelectItem key={branch.branch_id} value={branch.branch_id.toString()}>
                        {branch.branch_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleConfirmBranchUpdate}
              disabled={updateBranchMutation.isPending || selectedNewBranch === (selectedAdmin?.branch?.branch_id?.toString() || "none")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600 text-white rounded-xl"
            >
              {updateBranchMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('admins.updateBranch.updating')}
                </>
              ) : (
                t('admins.updateBranch.updateBranch')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
