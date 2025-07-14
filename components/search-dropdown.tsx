"use client"

import { useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Search, Package, Tag, Globe, Users, FileText, Clock, ArrowRight, Printer } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { quickSearch, SearchResult } from "@/services/SearchService"
import { cn } from "@/lib/utils"

interface SearchDropdownProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'product':
      return <Package className="h-4 w-4" />
    case 'category':
      return <Tag className="h-4 w-4" />
    case 'country':
      return <Globe className="h-4 w-4" />
    case 'admin':
      return <Users className="h-4 w-4" />
    case 'print_template':
      return <FileText className="h-4 w-4" />
    case 'tag':
      return <Tag className="h-4 w-4" />
    case 'print_select':
      return <Printer className="h-4 w-4" />
    default:
      return <Search className="h-4 w-4" />
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'product':
      return 'Sản phẩm'
    case 'category':
      return 'Danh mục'
    case 'country':
      return 'Quốc gia'
    case 'admin':
      return 'Người dùng'
    case 'print_template':
      return 'Mẫu in'
    case 'tag':
      return 'Tag'
    case 'print_select':
      return 'Chọn in'
    default:
      return type
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'product':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'category':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'country':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'admin':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'print_template':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    case 'tag':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    case 'print_select':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export function SearchDropdown({ isOpen, onClose, searchQuery, onSearchQueryChange }: SearchDropdownProps) {
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['quickSearch', searchQuery],
    queryFn: () => quickSearch(searchQuery),
    enabled: searchQuery.length >= 2 && isOpen,
    staleTime: 30000, // 30 seconds
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleResultClick = (result: SearchResult) => {
    // Tạo URL dựa trên type và chuyển đến trang danh sách với tên của item được click
    let url = ''
    switch (result.type) {
      case 'product':
        url = `/products?search=${encodeURIComponent(result.title)}`
        break
      case 'category':
        url = `/categories?search=${encodeURIComponent(result.title)}`
        break
      case 'country':
        url = `/countries?search=${encodeURIComponent(result.title)}`
        break
      case 'admin':
        url = `/admins?search=${encodeURIComponent(result.title)}`
        break
      case 'print_template':
        url = `/print-templates?search=${encodeURIComponent(result.title)}`
        break
      case 'tag':
        url = `/tags?search=${encodeURIComponent(result.title)}`
        break
      case 'print_select':
        url = `/print-select?search=${encodeURIComponent(result.title)}`
        break
      default:
        url = `/products?search=${encodeURIComponent(result.title)}`
    }
    
    router.push(url)
    onClose()
    onSearchQueryChange('')
  }

  const allResults = [
    ...(searchResults?.products || []),
    ...(searchResults?.categories || []),
    ...(searchResults?.tags || []),
    ...(searchResults?.countries || []),
    ...(searchResults?.admins || []),
    ...(searchResults?.print_templates || []),
    ...(searchResults?.print_selects || [])
  ]

  const hasResults = allResults.length > 0
  const showResults = searchQuery.length >= 2 && isOpen

  if (!showResults) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-zinc-100">
            Kết quả tìm kiếm cho "{searchQuery}"
          </h3>
          {isLoading && (
            <div className="text-xs text-gray-500 dark:text-zinc-400">
              Đang tìm kiếm...
            </div>
          )}
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500 dark:text-zinc-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
            Đang tìm kiếm...
          </div>
        ) : hasResults ? (
          <div className="divide-y divide-gray-200 dark:divide-zinc-800">
            {allResults.slice(0, 10).map((result, index) => (
              <div
                key={`${result.type}-${result.id}`}
                className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {result.image ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={result.image} alt={result.title} />
                        <AvatarFallback className="bg-gray-100 dark:bg-zinc-800">
                          {getTypeIcon(result.type)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                        {getTypeIcon(result.type)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-zinc-100 truncate">
                        {result.title}
                      </h4>
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs", getTypeColor(result.type))}
                      >
                        {getTypeLabel(result.type)}
                      </Badge>
                    </div>
                    
                    {result.description && (
                      <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 mb-2">
                        {result.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-400 dark:text-zinc-500">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(result.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        {result.score && (
                          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs">
                            {result.score}% phù hợp
                          </span>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-400 dark:text-zinc-500 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-zinc-100 mb-2">
              Không tìm thấy kết quả
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Thử tìm kiếm với từ khóa khác
            </p>
          </div>
        )}
      </div>


    </div>
  )
} 