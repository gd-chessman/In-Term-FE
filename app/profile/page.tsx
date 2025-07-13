"use client"

import { useState, useEffect, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUserMe } from "@/services/AdminService"
import { updateProfile, updateAvatar, updatePassword } from "@/services/AccountService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, User, Mail, Phone, Calendar, MapPin, Edit, Save, X, Camera, Lock, Eye, EyeOff, Crown } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    admin_fullname: "",
    admin_phone: ""
  })
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
        admin_phone: userMe.admin_phone || ""
      })
    }
  }, [userMe])

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return updateProfile(data)
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

  const updateAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('avatar', file)
      return updateAvatar(formData)
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Ảnh đại diện đã được cập nhật",
      })
      setSelectedAvatar(null)
      setAvatarPreview(null)
      queryClient.invalidateQueries({ queryKey: ["userMe"] })
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật ảnh đại diện",
        variant: "destructive",
      })
    }
  })

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwordData) => {
      return updatePassword(data)
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Mật khẩu đã được thay đổi",
      })
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: ""
      })
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể thay đổi mật khẩu",
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
      admin_phone: userMe?.admin_phone || ""
    })
    setIsEditing(false)
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedAvatar(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarUpload = () => {
    if (selectedAvatar) {
      updateAvatarMutation.mutate(selectedAvatar)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handlePasswordChange = () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      })
      return
    }
    updatePasswordMutation.mutate(passwordData)
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
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
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100">Hồ sơ cá nhân</h1>
        <p className="text-gray-600 dark:text-zinc-400 mt-2">
          Quản lý thông tin cá nhân và cài đặt tài khoản
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1 p-6 flex items-center justify-center">
          <CardHeader className="text-center px-0 pt-0">
            <div className="flex justify-center mb-8 relative">
              <div className="relative cursor-pointer group" onClick={handleAvatarClick}>
                <Avatar className="h-48 w-48 ring-4 ring-gray-200 dark:ring-zinc-700">
                  <AvatarImage src={avatarPreview || userMe?.admin_avatar || ""} alt="" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-5xl font-semibold">
                    {userMe?.admin_fullname ? getInitials(userMe.admin_fullname) : ""}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-12 w-12 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            {selectedAvatar && (
              <div className="flex justify-center mb-6">
                <Button
                  onClick={handleAvatarUpload}
                  disabled={updateAvatarMutation.isPending}
                  size="default"
                  className="flex items-center gap-2 px-6 py-2"
                >
                  {updateAvatarMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  Cập nhật ảnh
                </Button>
              </div>
            )}
            <CardTitle className="text-2xl mb-2">{userMe?.admin_fullname}</CardTitle>
            <CardDescription className="text-base mb-4">{userMe?.admin_email}</CardDescription>
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full border border-blue-200/60 shadow-sm hover:shadow-md transition-all duration-200">
                <Crown className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-sm">{userMe?.admin_role || "Admin"}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="profile" className="text-base">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="password" className="text-base">Thay đổi mật khẩu</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Thông tin cá nhân</CardTitle>
                      <CardDescription className="text-base">
                        Cập nhật thông tin cá nhân của bạn
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="default"
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
                          size="default"
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
                          size="default"
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Hủy
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="fullname" className="flex items-center gap-2 text-base">
                        <User className="h-5 w-5" />
                        Họ và tên
                      </Label>
                      {isEditing ? (
                        <Input
                          id="fullname"
                          value={formData.admin_fullname}
                          onChange={(e) => setFormData(prev => ({ ...prev, admin_fullname: e.target.value }))}
                          placeholder="Nhập họ và tên"
                          className="h-12 text-base"
                        />
                      ) : (
                        <p className="text-base text-gray-600 dark:text-zinc-400 py-3 px-3 bg-gray-50 dark:bg-zinc-800 rounded-md">
                          {userMe?.admin_fullname || "Chưa cập nhật"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="flex items-center gap-2 text-base">
                        <Mail className="h-5 w-5" />
                        Email
                      </Label>
                      <p className="text-base text-gray-600 dark:text-zinc-400 py-3 px-3 bg-gray-50 dark:bg-zinc-800 rounded-md">
                        {userMe?.admin_email || "Chưa cập nhật"}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="phone" className="flex items-center gap-2 text-base">
                        <Phone className="h-5 w-5" />
                        Số điện thoại
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.admin_phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, admin_phone: e.target.value }))}
                          placeholder="Nhập số điện thoại"
                          className="h-12 text-base"
                        />
                      ) : (
                        <p className="text-base text-gray-600 dark:text-zinc-400 py-3 px-3 bg-gray-50 dark:bg-zinc-800 rounded-md">
                          {userMe?.admin_phone || "Chưa cập nhật"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="address" className="flex items-center gap-2 text-base">
                        <MapPin className="h-5 w-5" />
                        Địa chỉ
                      </Label>
                      <p className="text-base text-gray-600 dark:text-zinc-400 py-3 px-3 bg-gray-50 dark:bg-zinc-800 rounded-md">
                        {userMe?.admin_address || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-base">
                      <Calendar className="h-5 w-5" />
                      Ngày tạo tài khoản
                    </Label>
                    <p className="text-base text-gray-600 dark:text-zinc-400 py-3 px-3 bg-gray-50 dark:bg-zinc-800 rounded-md">
                      {userMe?.created_at ? new Date(userMe.created_at).toLocaleDateString('vi-VN') : "Chưa có thông tin"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Password Tab */}
            <TabsContent value="password" className="mt-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Lock className="h-6 w-6" />
                    <div>
                      <CardTitle className="text-xl">Thay đổi mật khẩu</CardTitle>
                      <CardDescription className="text-base">
                        Cập nhật mật khẩu tài khoản của bạn
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="current-password" className="flex items-center gap-2 text-base">
                        <Lock className="h-5 w-5" />
                        Mật khẩu hiện tại
                      </Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                          placeholder="Nhập mật khẩu hiện tại"
                          className="h-12 text-base pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('current')}
                        >
                          {showPasswords.current ? (
                            <Eye className="h-5 w-5" />
                          ) : (
                            <EyeOff className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="new-password" className="flex items-center gap-2 text-base">
                        <Lock className="h-5 w-5" />
                        Mật khẩu mới
                      </Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.new_password}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                          placeholder="Nhập mật khẩu mới"
                          className="h-12 text-base pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('new')}
                        >
                          {showPasswords.new ? (
                            <Eye className="h-5 w-5" />
                          ) : (
                            <EyeOff className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="confirm-password" className="flex items-center gap-2 text-base">
                        <Lock className="h-5 w-5" />
                        Xác nhận mật khẩu mới
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirm_password}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                          placeholder="Nhập lại mật khẩu mới"
                          className="h-12 text-base pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('confirm')}
                        >
                          {showPasswords.confirm ? (
                            <Eye className="h-5 w-5" />
                          ) : (
                            <EyeOff className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handlePasswordChange}
                      disabled={updatePasswordMutation.isPending || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
                      className="flex items-center gap-2 h-12 px-6 text-base"
                    >
                      {updatePasswordMutation.isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Lock className="h-5 w-5" />
                      )}
                      Thay đổi mật khẩu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 