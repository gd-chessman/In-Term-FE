import { a4Template } from './a4/template';
import { a5Template } from './a5/template';
import { v1Template } from './v1/template';
import { v2Template } from './v2/template';
import { v3Template } from './v3/template';
import { i4Template } from './i4/template';

export { a4Template } from './a4/template';
export { a5Template } from './a5/template';
export { v1Template } from './v1/template';
export { v2Template } from './v2/template';
export { v3Template } from './v3/template';
export { i4Template } from './i4/template';

export interface TemplateData {
  product_name: string;
  product_code: string;
  price: string;
  price_sale: string;
  // Các trường mới cho số thập phân
  price_decimal: string;
  price_sale_decimal: string;
  discount_percentage: string;
  country_name: string;
  country_code: string;
  print_date: string;
  pt_brand: string;
  pt_origin_country: string;
  pt_product_code: string;
  pt_original_price: string;
  // Thông tin đơn vị giá
  unit_price_info: string;
  product_info: string;
}

export const getTemplate = (format: string) => {
  switch (format.toLowerCase()) {
    case 'a4':
      return a4Template;
    case 'a5':
      return a5Template;
    case 'v1':
      return v1Template;
    case 'v2':
      return v2Template;
    case 'v3':
      return v3Template;
    case 'i4':
      return i4Template;
    default:
      return a4Template; // fallback to a4
  }
};

// Export utility functions
export {
  generateProductHTML,
  generateMultipleProductsHTML,
  prepareTemplateData,
  isValidTemplateFormat,
  getAvailableFormats,
  getFormatInfo
} from './utils'; 