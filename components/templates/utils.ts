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
 * @param formatPrice - Function format giá
 * @returns TemplateData
 */
export const prepareTemplateData = (
  product: any, 
  formatPrice: (price: number, country: string) => string
): TemplateData => {
  console.log(product)
  return {
    product_name: product.product?.product_name || '',
    product_code: product.product?.product_code || '',
    price: formatPrice(product.product?.price, product.country?.country_name),
    price_sale: formatPrice(product?.ps_price_sale, product.country?.country_name),
    discount_percentage:  product.product?.price && product?.ps_price_sale ? "-" + Math.round(((product.product.price - product.ps_price_sale) / product.product.price) * 100) + '%' : '',
    country_name: product.country?.country_name || '',
    country_code: getCountryFlag(product.country?.country_code),
    print_date: new Date().toLocaleDateString('vi-VN')
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