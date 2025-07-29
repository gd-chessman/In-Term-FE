"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Plus, MoreHorizontal, Edit, Trash2, Shield, Users, Crown, UserCheck, Settings, Lock, Loader2 } from "lucide-react"
import { getRoles, getRoleStatistics } from "@/services/RoleService"
import { useLang } from "@/lang/useLang"



const permissions = [
  {
    permission_id: 1,
    permission_name: "viewAdmins",
    permission_resource: "admins",
    permission_action: "read",
    permission_status: "active",
  },
  {
    permission_id: 2,
    permission_name: "createAdmin",
    permission_resource: "admins",
    permission_action: "create",
    permission_status: "active",
  },
  {
    permission_id: 3,
    permission_name: "updateAdmin",
    permission_resource: "admins",
    permission_action: "update",
    permission_status: "active",
  },
  {
    permission_id: 4,
    permission_name: "deleteAdmin",
    permission_resource: "admins",
    permission_action: "delete",
    permission_status: "active",
  },
  {
    permission_id: 5,
    permission_name: "viewProducts",
    permission_resource: "products",
    permission_action: "read",
    permission_status: "active",
  },
  {
    permission_id: 6,
    permission_name: "createProduct",
    permission_resource: "products",
    permission_action: "create",
    permission_status: "active",
  },
  {
    permission_id: 7,
    permission_name: "updateProduct",
    permission_resource: "products",
    permission_action: "update",
    permission_status: "active",
  },
  {
    permission_id: 8,
    permission_name: "deleteProduct",
    permission_resource: "products",
    permission_action: "delete",
    permission_status: "active",
  },
]

export default function RolesPage() {
  const { t } = useLang()
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<any>(null)

  // Fetch roles data
  const { data: roles, isLoading, error } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  })

  // Fetch role statistics
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["roleStats"],
    queryFn: getRoleStatistics,
  })


  const getPermissionName = (permissionName: string) => {
    const permissionMap: { [key: string]: string } = {
      "viewAdmins": t('roles.permissions.list.viewAdmins'),
      "createAdmin": t('roles.permissions.list.createAdmin'),
      "updateAdmin": t('roles.permissions.list.updateAdmin'),
      "deleteAdmin": t('roles.permissions.list.deleteAdmin'),
      "viewProducts": t('roles.permissions.list.viewProducts'),
      "createProduct": t('roles.permissions.list.createProduct'),
      "updateProduct": t('roles.permissions.list.updateProduct'),
      "deleteProduct": t('roles.permissions.list.deleteProduct'),
    }
    return permissionMap[permissionName] || permissionName
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
            {t('roles.status.active')}
          </Badge>
        )
      case "inactive":
        return (
          <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-lg">
            {t('roles.status.inactive')}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              {t('roles.title')}
            </h1>
            <p className="text-slate-600 mt-2">{t('roles.loading')}</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-slate-600">{t('roles.loadingRoles')}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              {t('roles.title')}
            </h1>
            <p className="text-red-600 mt-2">{t('roles.error')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            {t('roles.title')}
          </h1>
          <p className="text-slate-600 mt-2">{t('roles.subtitle')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">{t('roles.stats.totalRoles')}</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{isLoadingStats ? '...' : stats?.total}</div>
            <p className="text-xs text-blue-600 mt-1">{t('roles.stats.totalRolesDesc')}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">{t('roles.stats.activeRoles')}</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{isLoadingStats ? '...' : stats?.active}</div>
            <p className="text-xs text-green-600 mt-1">{t('roles.stats.activeRolesDesc')}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-400/20 to-slate-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">{t('roles.stats.inactiveRoles')}</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-gray-500 to-slate-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{isLoadingStats ? '...' : stats?.inactive}</div>
            <p className="text-xs text-gray-600 mt-1">{t('roles.stats.inactiveRolesDesc')}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">{t('roles.stats.totalUsers')}</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{isLoadingStats ? '...' : stats?.totalAdmins}</div>
            <p className="text-xs text-orange-600 mt-1">{t('roles.stats.totalUsersDesc')}</p>
          </CardContent>
        </Card>
      </div>



      {/* Roles Table */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">{t('roles.table.title')}</CardTitle>
          <CardDescription>{t('roles.table.totalRoles', { count: roles.length })}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 hover:bg-slate-50/50">
                <TableHead className="text-slate-600 font-semibold">{t('roles.table.headers.role')}</TableHead>
                <TableHead className="text-slate-600 font-semibold">{t('roles.table.headers.description')}</TableHead>
                <TableHead className="text-slate-600 font-semibold">{t('roles.table.headers.userCount')}</TableHead>
                <TableHead className="text-slate-600 font-semibold">{t('roles.table.headers.status')}</TableHead>
                <TableHead className="text-slate-600 font-semibold">{t('roles.table.headers.createdAt')}</TableHead>
                {/* <TableHead className="text-right text-slate-600 font-semibold">Thao tác</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role: any) => (
                <TableRow key={role.role_id} className="hover:bg-slate-50/80 transition-colors duration-200">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold text-slate-900">{role.role_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">{role.role_description}</TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-600">{role.admin_count}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(role.role_status)}</TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-600">
                      {new Date(role.created_at).toLocaleDateString("vi-VN")}
                    </div>
                  </TableCell>
                  {/* <TableCell className="text-right">
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
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-slate-50/80 rounded-lg"
                          onClick={() => {
                            setSelectedRole(role)
                            setIsPermissionDialogOpen(true)
                          }}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Phân quyền
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 hover:bg-red-50/80 rounded-lg">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Permission Dialog */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">
              {t('roles.permissions.title', { roleName: selectedRole?.role_name })}
            </DialogTitle>
            <DialogDescription className="text-slate-600">{t('roles.permissions.subtitle')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
            {permissions.map((permission) => (
              <div
                key={permission.permission_id}
                className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors duration-200"
              >
                <Checkbox id={`permission-${permission.permission_id}`} className="rounded-lg border-slate-300" />
                <div className="grid gap-1.5 leading-none flex-1">
                  <label
                    htmlFor={`permission-${permission.permission_id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900"
                  >
                    {getPermissionName(permission.permission_name)}
                  </label>
                  <p className="text-xs text-slate-600">
                    {permission.permission_resource} - {permission.permission_action}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl">
              {t('roles.permissions.savePermissions')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
