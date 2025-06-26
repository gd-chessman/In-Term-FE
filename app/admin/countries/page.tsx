"use client"

import { useState } from "react"
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Globe, Flag, MapPin, FileText, TrendingUp } from "lucide-react"

// Mock data
const countries = [
  {
    country_id: 1,
    country_name: "Việt Nam",
    country_code: "VN",
    created_at: "2024-01-01 00:00:00",
    product_count: 1250,
    template_count: 5,
    flag: "🇻🇳",
  },
  {
    country_id: 2,
    country_name: "Hoa Kỳ",
    country_code: "US",
    created_at: "2024-01-01 00:00:00",
    product_count: 890,
    template_count: 3,
    flag: "🇺🇸",
  },
  {
    country_id: 3,
    country_name: "Nhật Bản",
    country_code: "JP",
    created_at: "2024-01-01 00:00:00",
    product_count: 567,
    template_count: 4,
    flag: "🇯🇵",
  },
  {
    country_id: 4,
    country_name: "Hàn Quốc",
    country_code: "KR",
    created_at: "2024-01-01 00:00:00",
    product_count: 432,
    template_count: 2,
    flag: "🇰🇷",
  },
  {
    country_id: 5,
    country_name: "Thái Lan",
    country_code: "TH",
    created_at: "2024-01-01 00:00:00",
    product_count: 321,
    template_count: 3,
    flag: "🇹🇭",
  },
]

export default function CountriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-800 bg-clip-text text-transparent">
            Quản lý Quốc gia
          </h1>
          <p className="text-slate-600 mt-2">Quản lý danh sách quốc gia và template in</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Thêm Quốc gia
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-900">Thêm Quốc gia mới</DialogTitle>
              <DialogDescription className="text-slate-600">Thêm quốc gia mới vào hệ thống</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country_name" className="text-right font-medium text-slate-700">
                  Tên quốc gia
                </Label>
                <Input
                  id="country_name"
                  className="col-span-3 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country_code" className="text-right font-medium text-slate-700">
                  Mã quốc gia
                </Label>
                <Input
                  id="country_code"
                  placeholder="VN, US, JP..."
                  className="col-span-3 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <DialogFooter>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl">
                Thêm Quốc gia
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Tổng quốc gia</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">{countries.length}</div>
            <div className="flex items-center text-xs text-blue-600 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              Đang hoạt động
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Tổng sản phẩm</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Flag className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">
              {countries.reduce((sum, c) => sum + c.product_count, 0).toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">Trên tất cả quốc gia</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">Template in</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">
              {countries.reduce((sum, c) => sum + c.template_count, 0)}
            </div>
            <p className="text-xs text-purple-600 mt-1">Tổng template</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full -mr-10 -mt-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-700">TB sản phẩm</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">
              {Math.round(countries.reduce((sum, c) => sum + c.product_count, 0) / countries.length)}
            </div>
            <p className="text-xs text-orange-600 mt-1">Sản phẩm/quốc gia</p>
          </CardContent>
        </Card>
      </div>

      {/* Countries Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => (
          <Card
            key={country.country_id}
            className="relative overflow-hidden bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 rounded-xl"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="pb-3 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{country.flag}</div>
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
                    <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                    <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                      <FileText className="mr-2 h-4 w-4" />
                      Xem Template
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 hover:bg-red-50/80 rounded-lg">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Sản phẩm:</span>
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
                    {country.product_count.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Template:</span>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                    {country.template_count}
                  </Badge>
                </div>
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                  Tạo: {new Date(country.created_at).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">Tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Tìm kiếm theo tên quốc gia, mã quốc gia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Countries Table */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">Danh sách Quốc gia</CardTitle>
          <CardDescription>Tổng cộng {countries.length} quốc gia trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 hover:bg-slate-50/50">
                <TableHead className="text-slate-600 font-semibold">Quốc gia</TableHead>
                <TableHead className="text-slate-600 font-semibold">Mã</TableHead>
                <TableHead className="text-slate-600 font-semibold">Số sản phẩm</TableHead>
                <TableHead className="text-slate-600 font-semibold">Template in</TableHead>
                <TableHead className="text-slate-600 font-semibold">Ngày tạo</TableHead>
                <TableHead className="text-right text-slate-600 font-semibold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countries.map((country) => (
                <TableRow key={country.country_id} className="hover:bg-slate-50/80 transition-colors duration-200">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{country.flag}</div>
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
                      {country.product_count.toLocaleString()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                      {country.template_count}
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
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-slate-50/80 rounded-lg">
                          <FileText className="mr-2 h-4 w-4" />
                          Xem Template
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 hover:bg-red-50/80 rounded-lg">
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
    </div>
  )
}
