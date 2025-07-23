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
  
  // Hàm format giá với currency symbol từ template
  const formatPrice = (price: number) => {
    if (!price) return '0'
    
    // Danh sách các currency symbol đặt trước giá (chỉ những symbol thực sự đặt trước)
    const prefixCurrencies = ['$', '€', '£', '¥', '₩', '₽', '₹', '₪', '₦', '₨', '₱', '₴', '₸', '₺', '₼', '₾', '₿']
    
    const formattedPrice = price.toLocaleString('en-US')
    
    // Kiểm tra xem currency symbol có nên đặt trước hay sau giá
    if (prefixCurrencies.includes(currencySymbol)) {
      return `${currencySymbol}${formattedPrice}`
    } else {
      return `${formattedPrice}${currencySymbol}`
    }
  }
  
  return {
    product_name: product.product?.product_name || '',
    product_code: product.product?.product_code || '',
    price: formatPrice(product.product?.price),
    price_sale: formatPrice(product?.ps_price_sale),
    discount_percentage:  product.product?.price && product?.ps_price_sale ? "-" + Math.round(((product.product.price - product.ps_price_sale) / product.product.price) * 100) + '%' : '',
    country_name: product.product?.origin?.country_name || '',
    country_code: getCountryFlag(product.product?.origin?.country_code),
    print_date: new Date().toLocaleDateString('vi-VN'),
    pt_brand: product.templates?.pt_brand || 'Fikko Cena',
    pt_origin_country: product.templates?.pt_origin_country || 'Země původu',
    pt_product_code: product.templates?.pt_product_code || 'EAN',
    pt_original_price: product.templates?.pt_original_price || 'Běžná cena'
  };
};

/**
 * Validate format template
 * @param format - Khổ in
 * @returns boolean
 */
export const isValidTemplateFormat = (format: string): boolean => {
  const validFormats = ['a4', 'a5', 'v1', 'v2', 'v3'];
  return validFormats.includes(format.toLowerCase());
};

/**
 * Lấy danh sách các format có sẵn
 * @returns Array of format names
 */
export const getAvailableFormats = (): string[] => {
  return ['a4', 'a5', 'v1', 'v2', 'v3'];
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
    v3: { name: 'V3', size: 'Tùy chỉnh', description: 'Khổ tùy chỉnh 3' }
  };
  
  return formatInfo[format.toLowerCase()] || formatInfo.a4;
}; 

const getCountryFlag = (countryCode: string) => {
  if (!countryCode || typeof countryCode !== 'string') {
    return "🌍"
  }
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}