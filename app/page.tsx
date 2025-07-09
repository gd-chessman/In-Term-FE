"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Users,
  Package,
  Globe,
  Printer,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Activity,
  Eye,
  ArrowUpRight,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import { getAllAdminLogs, getStatistics } from "@/services/AdminService"
import { useQuery } from "@tanstack/react-query"
import { getProductStatistics } from "@/services/ProductService"
import { getCountryStatistics } from "@/services/CountryService"
import { getPrintStatistics } from "@/services/PrintService"

export default function AdminDashboard() {

  const { data: adminStatistics, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-statistics"],
    queryFn: getStatistics,
  })


  const { data: productStatistics, isLoading: productStatsLoading } = useQuery({
    queryKey: ["product-statistics"],
    queryFn: getProductStatistics,
  })

  const { data: countryStatistics, isLoading: countryStatsLoading } = useQuery({
    queryKey: ["country-statistics"],
    queryFn: getCountryStatistics,
  })

  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ["adminLogs"],
    queryFn: () => getAllAdminLogs(1, 10, "", "all", "all"),
  })

  const { data: printStatistics, isLoading: printStatsLoading } = useQuery({
    queryKey: ["print-statistics"],
    queryFn: getPrintStatistics,
  })

  // Hàm format thời gian tương đối
  const formatRelativeTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds} giây trước`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`
  }

  // Hàm lấy icon và màu sắc cho từng loại action
  const getActionIcon = (action: string, module: string) => {
    switch (action) {
      case 'login':
        return { icon: CheckCircle, color: 'from-green-400 to-green-500' }
      case 'logout':
        return { icon: AlertCircle, color: 'from-orange-400 to-orange-500' }
      case 'create':
        return { icon: Plus, color: 'from-blue-400 to-blue-500' }
      case 'update':
        return { icon: Edit, color: 'from-purple-400 to-purple-500' }
      case 'delete':
        return { icon: Trash2, color: 'from-red-400 to-red-500' }
      default:
        return { icon: Activity, color: 'from-gray-400 to-gray-500' }
    }
  }

  // Hàm lấy mô tả hoạt động
  const getActionDescription = (log: any) => {
    const adminName = log.admin?.admin_fullname || log.admin?.admin_username || 'Unknown'
    
    switch (log.log_action) {
      case 'login':
        return `${adminName} đã đăng nhập`
      case 'logout':
        return `${adminName} đã đăng xuất`
      case 'create':
        return `${adminName} đã tạo mới ${log.log_module}`
      case 'update':
        return `${adminName} đã cập nhật ${log.log_module}`
      case 'delete':
        return `${adminName} đã xóa ${log.log_module}`
      default:
        return log.log_description || `${adminName} thực hiện ${log.log_action}`
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-gray-100 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 lg:mt-2 text-sm lg:text-base">
            Tổng quan hệ thống quản trị
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-800/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 dark:from-blue-400/10 dark:to-indigo-400/10 rounded-full -mr-8 lg:-mr-10 -mt-8 lg:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Tổng người dùng</CardTitle>
            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Users className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">{adminStatistics?.total}</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              Hiện tại của hệ thống
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 dark:from-green-400/10 dark:to-emerald-400/10 rounded-full -mr-8 lg:-mr-10 -mt-8 lg:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Sản phẩm</CardTitle>
            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Package className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">{productStatistics?.totalProducts}</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              Hiện tại của hệ thống
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200/50 dark:border-purple-800/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-400/20 to-violet-400/20 dark:from-purple-400/10 dark:to-violet-400/10 rounded-full -mr-8 lg:-mr-10 -mt-8 lg:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Quốc gia</CardTitle>
            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 dark:from-purple-600 dark:to-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Globe className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">{countryStatistics?.totalCountries}</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              Hiện tại của hệ thống
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200/50 dark:border-orange-800/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 dark:from-orange-400/10 dark:to-red-400/10 rounded-full -mr-8 lg:-mr-10 -mt-8 lg:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Lượt in hôm nay</CardTitle>
            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Printer className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">{printStatistics?.overview?.todayPrints}</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              Hiện tại của hệ thống
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 rounded-xl">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-gray-100 text-lg lg:text-xl">Hoạt động gần đây</CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                  Các hoạt động mới nhất trong hệ thống
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hidden sm:flex"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {logsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600 dark:text-gray-400">Đang tải hoạt động...</span>
                  </div>
                </div>
              ) : logsData?.data?.logs && logsData.data.logs.length > 0 ? (
                logsData.data.logs.slice(0, 4).map((log: any, index: number) => {
                  const { icon: IconComponent, color } = getActionIcon(log.log_action, log.log_module)
                  const description = getActionDescription(log)
                  const timeAgo = formatRelativeTime(log.created_at)
                  const adminEmail = log.admin?.admin_email || 'Unknown'
                  
                  return (
                    <div key={log.log_id} className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 rounded-lg m-2">
                      <div className={`flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-gradient-to-r ${color} shadow-lg`}>
                        <IconComponent className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{adminEmail} - {timeAgo}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Không có hoạt động gần đây</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>


      </div>

    </div>
  )
}
