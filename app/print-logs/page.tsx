"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getPrintHistory, getPrintStatistics } from "@/services/PrintService"
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { format } from "date-fns"
import { useLang } from "@/lang/useLang"

export default function PrintLogsPage() {
  const { t } = useLang()
  const [searchTerm, setSearchTerm] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "timeline">("table")
  const [selectedLog, setSelectedLog] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Fetch print history data
  const { data: printHistoryData, isLoading: isLoadingPrintHistory } = useQuery({
    queryKey: ["printHistory", currentPage, pageSize, searchTerm, fromDate, toDate],
    queryFn: () => getPrintHistory(currentPage, pageSize, searchTerm, fromDate, toDate),
  })

  const { data: printStatistics, isLoading: printStatsLoading } = useQuery({
    queryKey: ["print-statistics"],
    queryFn: getPrintStatistics,
  })

  const printLogs = printHistoryData?.data || []
  const pagination = printHistoryData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {t('printLogs.status.success')}
          </Badge>
        )
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            {t('printLogs.status.error')}
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            {t('printLogs.status.processing')}
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <XCircle className="w-3 h-3 mr-1" />
            {t('printLogs.status.cancelled')}
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

    if (diffInMinutes < 1) return t('printLogs.timeAgo.justNow')
    if (diffInMinutes < 60) return t('printLogs.timeAgo.minutesAgo', { minutes: diffInMinutes })
    if (diffInMinutes < 1440) return t('printLogs.timeAgo.hoursAgo', { hours: Math.floor(diffInMinutes / 60) })
    return t('printLogs.timeAgo.daysAgo', { days: Math.floor(diffInMinutes / 1440) })
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('printLogs.title')}
          </h1>
          <p className="text-muted-foreground">{t('printLogs.subtitle')}</p>
        </div>

      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-4  lg:grid-cols-5">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">{t('printLogs.stats.todayPrints')}</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Printer className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{printStatistics?.overview?.todayPrintLogs}</div>
            <div className="flex items-center text-xs text-blue-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              {t('printLogs.stats.today')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">{t('printLogs.stats.totalPrints')}</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <FileCheck className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{printStatistics?.overview?.totalPrintLogs}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <BarChart3 className="w-3 h-3 mr-1" />
              {t('printLogs.stats.allTime')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">{t('printLogs.stats.activeTemplates')}</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{printStatistics?.overview?.totalTemplates}</div>
            <div className="flex items-center text-xs text-purple-600 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              {t('printLogs.stats.active')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700">{t('printLogs.stats.topAdmin')}</CardTitle>
            <div className="p-2 bg-indigo-100 rounded-full">
              <User className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900">
              {printStatistics?.topAdmins?.[0]?.total_prints || 0} <span className="text-xs text-indigo-600">{t('printLogs.stats.prints')}</span>
            </div>
            <div className="text-xs text-indigo-600 mt-1 truncate">
              {printStatistics?.topAdmins?.[0]?.admin_fullname || t('printLogs.na')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-teal-50 to-teal-100 border-teal-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-700">{t('printLogs.stats.topProduct')}</CardTitle>
            <div className="p-2 bg-teal-100 rounded-full">
              <Package className="h-4 w-4 text-teal-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-900">
              {printStatistics?.topProducts?.[0]?.total_prints || 0} <span className="text-xs text-teal-600">{t('printLogs.stats.prints')}</span>
            </div>
            <div className="text-xs text-teal-600 mt-1 truncate">
              {printStatistics?.topProducts?.[0]?.product_name || t('printLogs.na')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="backdrop-blur-sm bg-white/80 border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{t('printLogs.search.title')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <FileText className="w-4 h-4 mr-1" />
                {t('printLogs.search.table')}
              </Button>
              <Button
                variant={viewMode === "timeline" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("timeline")}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Clock className="w-4 h-4 mr-1" />
                {t('printLogs.search.timeline')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('printLogs.search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-white/50 backdrop-blur-sm"
              />
            </div>
            <Input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="w-[150px] bg-white/50 backdrop-blur-sm"
              placeholder={t('printLogs.search.fromDate')}
              min=""
              max={toDate || undefined}
            />
            <Input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="w-[150px] bg-white/50 backdrop-blur-sm"
              placeholder={t('printLogs.search.toDate')}
              min={fromDate || undefined}
            />
          </div>
        </CardContent>
      </Card>

      {/* Print Logs Display */}
      {isLoadingPrintHistory ? (
        <Card className="backdrop-blur-sm bg-white/80">
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t('printLogs.loading')}</span>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "table" ? (
        <Card className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              {t('printLogs.table.title')}
            </CardTitle>
            <CardDescription>{t('printLogs.table.description', { count: printLogs.length })}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('printLogs.table.headers.time')}</TableHead>
                  <TableHead>{t('printLogs.table.headers.admin')}</TableHead>
                  <TableHead>{t('printLogs.table.headers.product')}</TableHead>
                  <TableHead>{t('printLogs.table.headers.template')}</TableHead>
                  <TableHead>{t('printLogs.table.headers.status')}</TableHead>
                  <TableHead>{t('printLogs.table.headers.quantity')}</TableHead>
                  <TableHead>{t('printLogs.table.headers.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {printLogs.map((log: any) => (
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
                          <AvatarImage src={log.admin?.admin_avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-blue-500 text-white text-xs">
                            {log.admin?.admin_fullname
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("") || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{log.admin?.admin_fullname || t('printLogs.na')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-gray-100 rounded">
                          <Package className="w-3 h-3 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{log.product?.product_name || t('printLogs.na')}</div>
                          <div className="text-sm text-muted-foreground font-mono">{log.product?.product_code || t('printLogs.na')}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">📄</span>
                        <div className="max-w-xs truncate text-sm">{log.template?.pt_title || t('printLogs.na')}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {t('printLogs.status.success')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{log.pl_num || 0}</span>
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
                                {t('printLogs.dialog.title', { id: log.pl_id })}
                              </DialogTitle>
                              <DialogDescription>{t('printLogs.dialog.description')}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">{t('printLogs.dialog.admin')}</label>
                                  <div className="flex items-center space-x-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={log.admin?.admin_avatar || "/placeholder.svg"} />
                                      <AvatarFallback className="bg-blue-500 text-white text-xs">
                                        {log.admin?.admin_fullname?.split(" ").map((n: string) => n[0]).join("") || "A"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{log.admin?.admin_fullname || t('printLogs.na')}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">{t('printLogs.dialog.product')}</label>
                                  <div>
                                    <div className="font-medium">{log.product?.product_name || t('printLogs.na')}</div>
                                    <div className="text-sm text-muted-foreground font-mono">
                                      {log.product?.product_code || t('printLogs.na')}
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">{t('printLogs.dialog.template')}</label>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">📄</span>
                                    <span className="text-sm">{log.template?.pt_title || t('printLogs.na')}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">{t('printLogs.dialog.quantity')}</label>
                                  <div className="text-lg font-semibold">{log.pl_num || 0} {t('printLogs.dialog.copies')}</div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">{t('printLogs.dialog.note')}</label>
                                <div className="p-3 bg-gray-50 rounded-md text-sm">{log.pl_log_note || t('printLogs.dialog.noNote')}</div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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
              {t('printLogs.timeline.title')}
            </CardTitle>
            <CardDescription>{t('printLogs.timeline.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {printLogs.map((log: any, index: number) => (
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
                          <AvatarImage src={log.admin?.admin_avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-blue-500 text-white text-xs">
                            {log.admin?.admin_fullname
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("") || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{log.admin?.admin_fullname || t('printLogs.na')}</div>
                          <div className="text-sm text-muted-foreground">{getTimeAgo(log.pl_print_time)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(log.status)}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">{getCountryFlag(log.template?.pt_country_id?.toString() || 'VN')}</span>
                        <span>{log.product?.product_name || t('printLogs.na')}</span>
                      </div>
                      <div className="text-muted-foreground">•</div>
                      <div>{log.pl_num || 0} {t('printLogs.timeline.prints')}</div>
                      <div className="text-muted-foreground">•</div>
                      <div>{log.template?.pt_title || t('printLogs.na')}</div>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{log.pl_log_note}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {t('printLogs.pagination.showing', { 
                  start: ((currentPage - 1) * pageSize) + 1, 
                  end: Math.min(currentPage * pageSize, pagination.total), 
                  total: pagination.total 
                })}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg"
                >
                  {t('printLogs.pagination.previous')}
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum = i + 1
                    if (pagination.totalPages > 5) {
                      if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="rounded-lg min-w-[40px]"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="rounded-lg"
                >
                  {t('printLogs.pagination.next')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
