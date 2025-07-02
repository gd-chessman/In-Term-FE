"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUserMe } from "@/services/AdminService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, User, Mail, Phone, Calendar, MapPin, Edit, Save, X } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    admin_fullname: "",
    admin_email: "",
    admin_phone: "",
    admin_address: ""
  })
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: userMe, isLoading, error } = useQuery({
    queryKey: ["userMe"],
    queryFn: getUserMe,
  })

  // Update form data when user data is loaded
  useEffect(() => {
    if (userMe) {
      setFormData({
        admin_fullname: userMe.admin_fullname || "",
        admin_email: userMe.admin_email || "",
        admin_phone: userMe.admin_phone || "",
        admin_address: userMe.admin_address || ""
      })
    }
  }, [userMe])

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // TODO: Implement update profile API call
      // For now, just simulate the API call
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 1000)
      })
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Thông tin hồ sơ đã được cập nhật",
      })
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ["userMe"] })
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin hồ sơ",
        variant: "destructive",
      })
    }
  })

  const handleSave = () => {
    updateProfileMutation.mutate(formData)
  }

  const handleCancel = () => {
    setFormData({
      admin_fullname: userMe?.admin_fullname || "",
      admin_email: userMe?.admin_email || "",
      admin_phone: userMe?.admin_phone || "",
      admin_address: userMe?.admin_address || ""
    })
    setIsEditing(false)
  }

  const getInitials = (fullname: string) => {
    return fullname
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">Không thể tải thông tin hồ sơ</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100">Hồ sơ cá nhân</h1>
        <p className="text-gray-600 dark:text-zinc-400 mt-2">
          Quản lý thông tin cá nhân và cài đặt tài khoản
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 ring-4 ring-gray-200 dark:ring-zinc-700">
                <AvatarImage src="" alt="" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-2xl font-semibold">
                  {userMe?.admin_fullname ? getInitials(userMe.admin_fullname) : ""}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{userMe?.admin_fullname}</CardTitle>
            <CardDescription>{userMe?.admin_email}</CardDescription>
            <div className="flex justify-center mt-4">
              <Badge variant="secondary" className="text-xs">
                {userMe?.admin_role || "Admin"}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Cập nhật thông tin cá nhân của bạn
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Lưu
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Hủy
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Họ và tên
                </Label>
                {isEditing ? (
                  <Input
                    id="fullname"
                    value={formData.admin_fullname}
                    onChange={(e) => setFormData(prev => ({ ...prev, admin_fullname: e.target.value }))}
                    placeholder="Nhập họ và tên"
                  />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-zinc-400 py-2">
                    {userMe?.admin_fullname || "Chưa cập nhật"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.admin_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, admin_email: e.target.value }))}
                    placeholder="Nhập email"
                  />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-zinc-400 py-2">
                    {userMe?.admin_email || "Chưa cập nhật"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Số điện thoại
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.admin_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, admin_phone: e.target.value }))}
                    placeholder="Nhập số điện thoại"
                  />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-zinc-400 py-2">
                    {userMe?.admin_phone || "Chưa cập nhật"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Địa chỉ
                </Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={formData.admin_address}
                    onChange={(e) => setFormData(prev => ({ ...prev, admin_address: e.target.value }))}
                    placeholder="Nhập địa chỉ"
                  />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-zinc-400 py-2">
                    {userMe?.admin_address || "Chưa cập nhật"}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ngày tạo tài khoản
              </Label>
              <p className="text-sm text-gray-600 dark:text-zinc-400 py-2">
                {userMe?.created_at ? new Date(userMe.created_at).toLocaleDateString('vi-VN') : "Chưa có thông tin"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 