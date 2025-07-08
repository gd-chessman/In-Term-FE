"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle, AlertCircle, Sparkles, Shield } from "lucide-react"
import { resetPassword } from "@/services/AccountService"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    reset_code: "",
    new_password: "",
    confirm_password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const validatePassword = (password: string) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: {
        length: password.length < minLength,
        uppercase: !hasUpperCase,
        lowercase: !hasLowerCase,
        numbers: !hasNumbers,
        special: !hasSpecialChar,
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate new password
    const passwordValidation = validatePassword(formData.new_password)
    if (!passwordValidation.isValid) {
      setError("Mật khẩu mới không đáp ứng yêu cầu bảo mật")
      setIsLoading(false)
      return
    }

    // Validate confirm password
    if (formData.new_password !== formData.confirm_password) {
      setError("Mật khẩu xác nhận không khớp")
      setIsLoading(false)
      return
    }

    try {
      // Call the resetPassword API with correct body format
      await resetPassword({
        reset_code: formData.reset_code,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password
      })
      
      setIsSuccess(true)
    } catch (err: any) {
      // Handle different types of errors
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.message) {
        setError(err.message)
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const passwordValidation = validatePassword(formData.new_password)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Đổi mật khẩu tài khoản
          </p>
        </div>

        {/* Change Password Card */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/60 dark:border-gray-700/60 shadow-2xl rounded-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
              Đổi mật khẩu
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 text-center">
              Cập nhật mật khẩu mới cho tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Reset Code Field */}
                <div className="space-y-2">
                  <Label htmlFor="reset_code" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nhập mã xác thực
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="reset_code"
                      name="reset_code"
                      type="text"
                      value={formData.reset_code}
                      onChange={handleInputChange}
                      placeholder="Nhập mã xác thực 6 số"
                      className="pl-10 h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Mã xác thực đã được gửi đến email của bạn
                  </div>
                </div>

                {/* New Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="new_password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mật khẩu mới
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="new_password"
                      name="new_password"
                      type={showNewPassword ? "text" : "password"}
                      value={formData.new_password}
                      onChange={handleInputChange}
                      placeholder="Nhập mật khẩu mới"
                      className="pl-10 pr-10 h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.new_password && (
                    <div className="space-y-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              level <= (passwordValidation.isValid ? 4 : 
                                Object.values(passwordValidation.errors).filter(Boolean).length === 0 ? 1 :
                                Object.values(passwordValidation.errors).filter(Boolean).length === 1 ? 2 :
                                Object.values(passwordValidation.errors).filter(Boolean).length === 2 ? 3 : 1)
                                ? "bg-green-500"
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {passwordValidation.isValid ? (
                          <span className="text-green-600 dark:text-green-400">Mật khẩu mạnh</span>
                        ) : (
                          <span className="text-orange-600 dark:text-orange-400">Cần cải thiện</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Password Requirements */}
                  {formData.new_password && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Yêu cầu mật khẩu:</div>
                      <div className="space-y-1 text-xs">
                        <div className={`flex items-center space-x-2 ${formData.new_password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${formData.new_password.length >= 8 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                          <span>Ít nhất 8 ký tự</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${/[A-Z]/.test(formData.new_password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.new_password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                          <span>Có chữ hoa</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${/[a-z]/.test(formData.new_password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(formData.new_password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                          <span>Có chữ thường</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${/\d/.test(formData.new_password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(formData.new_password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                          <span>Có số</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.new_password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.new_password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                          <span>Có ký tự đặc biệt</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirm_password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Xác nhận mật khẩu mới
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      placeholder="Nhập lại mật khẩu mới"
                      className="pl-10 pr-10 h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {/* Password Match Indicator */}
                  {formData.confirm_password && (
                    <div className={`text-xs ${formData.new_password === formData.confirm_password ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formData.new_password === formData.confirm_password ? (
                        <span className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Mật khẩu khớp</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>Mật khẩu không khớp</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !passwordValidation.isValid || formData.new_password !== formData.confirm_password}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang cập nhật...</span>
                    </div>
                  ) : (
                    "Cập nhật mật khẩu"
                  )}
                </Button>
              </form>
            ) : (
              /* Success State */
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Đổi mật khẩu thành công!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại với mật khẩu mới.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Để bảo mật tài khoản, bạn sẽ được đăng xuất khỏi tất cả thiết bị khác.
                  </p>
                </div>
                <Button
                  onClick={() => window.location.href = "/login"}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  Đăng nhập lại
                </Button>
              </div>
            )}

            {/* Back to Dashboard */}
            {!isSuccess && (
              <div className="text-center pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại Dashboard
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 Admin Panel. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
} 