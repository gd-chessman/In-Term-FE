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
} from "lucide-react"

export default function AdminDashboard() {
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
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl w-full sm:w-auto">
          <Eye className="mr-2 h-4 w-4" />
          Xem báo cáo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-800/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 dark:from-blue-400/10 dark:to-indigo-400/10 rounded-full -mr-8 lg:-mr-10 -mt-8 lg:-mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Tổng Admin</CardTitle>
            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Users className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">24</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2 từ tháng trước
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
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">1,234</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% từ tháng trước
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
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">45</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3 từ tháng trước
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
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">89</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% từ hôm qua
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
              <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 rounded-lg m-2">
                <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-500 shadow-lg">
                  <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Admin mới được tạo</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">john.doe@example.com - 2 phút trước</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 rounded-lg m-2">
                <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg">
                  <Package className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Sản phẩm được cập nhật</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Product #1234 - 5 phút trước</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 rounded-lg m-2">
                <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg">
                  <AlertCircle className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Template in được sửa</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Template Vietnam - 10 phút trước</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 rounded-lg m-2">
                <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-purple-500 shadow-lg">
                  <Printer className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Batch in hoàn thành</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">25 sản phẩm - 15 phút trước</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 rounded-xl">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-gray-100 text-lg lg:text-xl">
                  Trạng thái hệ thống
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                  Tình trạng các module chính
                </CardDescription>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-sm"></div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium hidden sm:inline">
                  Tất cả hoạt động
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 lg:space-y-4 pt-4 lg:pt-6">
            <div className="flex items-center justify-between p-2 lg:p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/50 hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-green-500 shadow-lg"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Database</span>
              </div>
              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800 rounded-lg text-xs">
                Hoạt động
              </Badge>
            </div>

            <div className="flex items-center justify-between p-2 lg:p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/50 hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-green-500 shadow-lg"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">API Server</span>
              </div>
              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800 rounded-lg text-xs">
                Hoạt động
              </Badge>
            </div>

            <div className="flex items-center justify-between p-2 lg:p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200/50 dark:border-yellow-800/50 hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-yellow-500 shadow-lg animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Print Service</span>
              </div>
              <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 rounded-lg text-xs">
                Cảnh báo
              </Badge>
            </div>

            <div className="flex items-center justify-between p-2 lg:p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/50 hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-green-500 shadow-lg"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">File Storage</span>
              </div>
              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800 rounded-lg text-xs">
                Hoạt động
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Admin Logins */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-gray-900 dark:text-gray-100 text-lg lg:text-xl">Đăng nhập gần đây</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                Danh sách admin đăng nhập trong 24h qua
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg w-full sm:w-auto"
            >
              <Activity className="mr-2 h-4 w-4" />
              Xem tất cả
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile view */}
          <div className="block lg:hidden">
            <div className="space-y-3 p-4">
              {[
                {
                  name: "John Doe",
                  email: "john.doe@example.com",
                  time: "2 phút trước",
                  ip: "192.168.1.100",
                  status: "Online",
                },
                {
                  name: "Jane Smith",
                  email: "jane.smith@example.com",
                  time: "15 phút trước",
                  ip: "192.168.1.101",
                  status: "Online",
                },
                {
                  name: "Mike Johnson",
                  email: "mike.johnson@example.com",
                  time: "1 giờ trước",
                  ip: "192.168.1.102",
                  status: "Offline",
                },
              ].map((admin, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{admin.name}</div>
                    <Badge
                      className={
                        admin.status === "Online"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                      }
                    >
                      {admin.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div>{admin.email}</div>
                    <div>{admin.time}</div>
                    <code className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-gray-700 dark:text-gray-300 font-mono">
                      {admin.ip}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop view */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">Admin</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">Email</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">Thời gian</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">IP Address</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-semibold">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-gray-100 dark:border-gray-700">
                  <TableCell className="font-semibold text-gray-900 dark:text-gray-100">John Doe</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">john.doe@example.com</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">2 phút trước</TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300 font-mono">
                      192.168.1.100
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800 rounded-lg">
                      Online
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-gray-100 dark:border-gray-700">
                  <TableCell className="font-semibold text-gray-900 dark:text-gray-100">Jane Smith</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">jane.smith@example.com</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">15 phút trước</TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300 font-mono">
                      192.168.1.101
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800 rounded-lg">
                      Online
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-gray-100 dark:border-gray-700">
                  <TableCell className="font-semibold text-gray-900 dark:text-gray-100">Mike Johnson</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">mike.johnson@example.com</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">1 giờ trước</TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300 font-mono">
                      192.168.1.102
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600 rounded-lg">
                      Offline
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-gray-100 dark:border-gray-700">
                  <TableCell className="font-semibold text-gray-900 dark:text-gray-100">Sarah Wilson</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">sarah.wilson@example.com</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">2 giờ trước</TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300 font-mono">
                      192.168.1.103
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600 rounded-lg">
                      Offline
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
