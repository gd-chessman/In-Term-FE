import { getTemplate, TemplateData } from './index';

/**
 * Tạo HTML cho một sản phẩm với template được chọn
 * @param format - Khổ in (a4, a5, v1, v2, v3)
 * @param data - Dữ liệu sản phẩm
 * @returns HTML string
 */
export const generateProductHTML = (format: string, data: TemplateData): string => {
  const template = getTemplate(format);
  return template(data);
};

/**
 * Tạo HTML cho nhiều sản phẩm với template được chọn
 * @param format - Khổ in (a4, a5, v1, v2, v3)
 * @param products - Danh sách dữ liệu sản phẩm
 * @returns HTML string với page breaks
 */
export const generateMultipleProductsHTML = (format: string, products: TemplateData[]): string => {
  const template = getTemplate(format);
  
  return products.map((product, index) => {
    const productHTML = template(product);
    
    // Thêm page break nếu không phải sản phẩm cuối cùng
    if (index < products.length - 1) {
      return productHTML + '<div style="page-break-before: always;"></div>';
    }
    
    return productHTML;
  }).join('');
};

/**
 * Chuẩn bị dữ liệu template từ dữ liệu sản phẩm
 * @param product - Dữ liệu sản phẩm từ API
 * @param currencySymbol - Ký hiệu tiền tệ từ template (VD: $, €, ¥, ₫)
 * @returns TemplateData
 */
export const prepareTemplateData = (
  product: any, 
  currencySymbol: string = '$'
): TemplateData => {
  console.log(product)
  
  // Hàm format giá với currency symbol từ template (chỉ phần nguyên)
  const formatPrice = (price: number) => {
    if (!price) return '0'
    
    // Danh sách các currency symbol đặt trước giá (chỉ những symbol thực sự đặt trước)
    const prefixCurrencies = ['$', '€', '£', '¥', '₩', '₽', '₹', '₪', '₦', '₨', '₱', '₴', '₸', '₺', '₼', '₾', '₿']
    
    // Chỉ lấy phần nguyên
    const wholePart = Math.floor(price)
    const formattedPrice = wholePart.toLocaleString('en-US')
    
    // Kiểm tra xem currency symbol có nên đặt trước hay sau giá
    if (prefixCurrencies.includes(currencySymbol)) {
      return `${currencySymbol}${formattedPrice}`
    } else {
      return `${formattedPrice} ${currencySymbol}`
    }
  }

  // Hàm tính giá đơn vị
  const calculateUnitPrice = () => {
    const unitTotal = product.product?.unit_total || 0
    const unitStep = product.product?.unit_step || 0
    const salePrice = product?.ps_price_sale || 0
    
    if (!unitTotal || !unitStep || !salePrice) return ''
    
    // Tính giá cho 1 đơn vị nhỏ nhất
    const unitPrice = (salePrice / unitTotal) * unitStep
    
    // Format giá đơn vị với 2 chữ số thập phân
    const wholePart = Math.floor(unitPrice)
    const decimalPart = (unitPrice % 1).toFixed(2).substring(2) // Luôn lấy 2 chữ số thập phân
    
    // Danh sách các currency symbol đặt trước giá
    const prefixCurrencies = ['$', '€', '£', '¥', '₩', '₽', '₹', '₪', '₦', '₨', '₱', '₴', '₸', '₺', '₼', '₾', '₿']
    
    const formattedWholePart = wholePart.toLocaleString('en-US')
    
    let unitPriceFormatted = ''
    if (prefixCurrencies.includes(currencySymbol)) {
      unitPriceFormatted = `${currencySymbol}${formattedWholePart}.${decimalPart}`
    } else {
      unitPriceFormatted = `${formattedWholePart}.${decimalPart} ${currencySymbol}`
    }
    
    // Lấy từ ngữ cho giá đơn vị từ template
    const unitPriceLabel = product.templates?.pt_unit_price || ''
    
    return `${unitPriceLabel} ${unitStep}${product.product?.unit_name || 'g'} = ${unitPriceFormatted}`
  }

  // Hàm kiểm tra và tách số thập phân
  const splitDecimal = (price: number) => {
    if (!price) return { whole: '0', decimal: '' }
    
    const priceStr = price.toString()
    const parts = priceStr.split('.')
    
    if (parts.length === 1) {
      // Không có phần thập phân
      return { 
        whole: parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','), 
        decimal: '' 
      }
    } else {
      // Có phần thập phân
      const wholePart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      const decimalPart = parts[1]
      return { 
        whole: wholePart, 
        decimal: decimalPart 
      }
    }
  }
  
  // Lấy phần thập phân cho price và price_sale
  const getDecimalPart = (price: number) => {
    if (!price) return ''
    const priceStr = price.toString()
    const parts = priceStr.split('.')
    return parts.length > 1 ? parts[1] : ''
  }

  return {
    product_name: product.product?.product_name || '',
    product_code: product.product?.product_code || '',
    price: formatPrice(product.product?.price),
    price_sale: formatPrice(product?.ps_price_sale),
    // Các trường mới cho số thập phân
    price_decimal: getDecimalPart(product.product?.price || 0),
    price_sale_decimal: getDecimalPart(product?.ps_price_sale || 0),
    discount_percentage:  product.product?.price && product?.ps_price_sale ? "-" + Math.round(((product.product.price - product.ps_price_sale) / product.product.price) * 100) + '%' : '',
    country_name: product.product?.origin?.country_name || '',
    country_code: getCountryFlag(product.product?.origin?.country_code),
    print_date: new Date().toLocaleDateString('vi-VN'),
    pt_brand: product.templates?.pt_brand || 'Fikko Cena',
    pt_origin_country: product.templates?.pt_origin_country || 'Země původu',
    pt_product_code: product.templates?.pt_product_code || 'EAN',
    pt_original_price: product.templates?.pt_original_price || 'Běžná cena',
    // Thông tin đơn vị giá
    unit_price_info: calculateUnitPrice(),
    product_info: product.product?.product_info || '',
    pt_vendor: product.templates?.pt_vendor || '',
    // Các trường tùy chọn
    ps_option_1: product.templates?.ps_option_1 || '',
    ps_option_2: product.templates?.ps_option_2 || '',
    ps_option_3: product.templates?.ps_option_3 || ''
  };
};

/**
 * Validate format template
 * @param format - Khổ in
 * @returns boolean
 */
export const isValidTemplateFormat = (format: string): boolean => {
  const validFormats = ['a4', 'a5', 'v1', 'v2', 'v3', 'i4'];
  return validFormats.includes(format.toLowerCase());
};

/**
 * Lấy danh sách các format có sẵn
 * @returns Array of format names
 */
export const getAvailableFormats = (): string[] => {
  return ['a4', 'a5', 'v1', 'v2', 'v3', 'i4'];
};

/**
 * Lấy thông tin format
 * @param format - Khổ in
 * @returns Object với thông tin format
 */
export const getFormatInfo = (format: string) => {
  const formatInfo: Record<string, { name: string; size: string; description: string }> = {
    a4: { name: 'A4', size: '210×297mm', description: 'Khổ giấy A4 tiêu chuẩn' },
    a5: { name: 'A5', size: '148×210mm', description: 'Khổ giấy A5 nhỏ gọn' },
    v1: { name: 'V1', size: 'Tùy chỉnh', description: 'Khổ tùy chỉnh 1' },
    v2: { name: 'V2', size: 'Tùy chỉnh', description: 'Khổ tùy chỉnh 2' },
    v3: { name: 'V3', size: 'Tùy chỉnh', description: 'Khổ tùy chỉnh 3' },
    i4: { name: 'I4', size: 'Nhãn', description: 'Mẫu nhãn I4' }
  };
  
  return formatInfo[format.toLowerCase()] || formatInfo.a4;
}; 

const getCountryFlag = (countryCode: string) => {
  if (!countryCode || typeof countryCode !== 'string') {
    return '<img src="/WW.png" alt="World" class="country-flag" style="width: 24px; height: 18px; object-fit: cover; display: inline; margin-bottom: 4px;" />'
  }
  const upperCode = countryCode.toUpperCase()
  return `<img src="/${upperCode}.png" alt="${upperCode}" class="country-flag" style="width: 24px; height: 18px; object-fit: cover; display: inline; margin-bottom: 4px;" />`
}