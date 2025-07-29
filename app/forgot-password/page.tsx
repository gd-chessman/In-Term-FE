"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Sparkles } from "lucide-react"
import { forgotPassword } from "@/services/AccountService"
import { useLang } from "@/lang/useLang"

export default function ForgotPasswordPage() {
  const { t } = useLang()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Call the forgotPassword API with correct body format
      await forgotPassword({
        admin_email: email
      })
      
      // Redirect to reset-password page with email as query parameter
      router.push(`/reset-password`)
    } catch (err: any) {
      // Handle different types of errors
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.message) {
        setError(err.message)
      } else {
        setError(t('forgotPassword.errors.general'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('forgotPassword.subtitle')}
          </p>
        </div>

        {/* Forgot Password Card */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/60 dark:border-gray-700/60 shadow-2xl rounded-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
              {t('forgotPassword.title')}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 text-center">
              {t('forgotPassword.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('forgotPassword.fields.email')}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder={t('forgotPassword.placeholders.email')}
                      className="pl-10 h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                      required
                    />
                  </div>
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
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('forgotPassword.loading')}</span>
                    </div>
                  ) : (
                    t('forgotPassword.submit')
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
                    {t('forgotPassword.success.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t('forgotPassword.success.description', { email })}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {t('forgotPassword.success.note')}
                  </p>
                </div>
              </div>
            )}

            {/* Back to Login */}
            <div className="text-center pt-4">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('forgotPassword.backToLogin')}
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 {process.env.NEXT_PUBLIC_APP_NAME}. {t('forgotPassword.footer.rights')}
          </p>
        </div>
      </div>
    </div>
  )
} 