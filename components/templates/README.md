# Print Templates

Thư mục này chứa các template HTML cho việc in sản phẩm với các khổ khác nhau.

## Cấu trúc thư mục

```
templates/
├── a4/
│   ├── a4.html          # Template HTML gốc cho khổ A4
│   ├── a4.png           # Hình ảnh background cho A4
│   └── template.ts      # Template function với dynamic data
├── a5/
│   ├── a5.html          # Template HTML gốc cho khổ A5
│   ├── a5.png           # Hình ảnh background cho A5
│   └── template.ts      # Template function với dynamic data
├── v1/
│   ├── v1.html          # Template HTML gốc cho khổ V1
│   ├── v1.png           # Hình ảnh background cho V1
│   └── template.ts      # Template function với dynamic data
├── v2/
│   ├── v2.html          # Template HTML gốc cho khổ V2
│   ├── v2.png           # Hình ảnh background cho V2
│   └── template.ts      # Template function với dynamic data
├── v3/
│   ├── v3.html          # Template HTML gốc cho khổ V3
│   ├── v3.png           # Hình ảnh background cho V3
│   └── template.ts      # Template function với dynamic data
├── index.ts             # Export tất cả templates
└── README.md            # File này
```

## Cách sử dụng

### Import template

```typescript
import { getTemplate, TemplateData } from '@/components/templates';

// Lấy template function cho khổ A4
const a4Template = getTemplate('a4');

// Chuẩn bị dữ liệu
const data: TemplateData = {
  product_name: 'Sản phẩm A',
  product_code: 'SP001',
  price: '150.000',
  country_name: 'Việt Nam',
  print_date: '15/12/2024',
  price_per_100g: '75.000'
};

// Tạo HTML
const html = a4Template(data);
```

### Import trực tiếp template cụ thể

```typescript
import { a4Template, a5Template, v1Template } from '@/components/templates';

// Sử dụng template A4
const html = a4Template({
  product_name: 'Sản phẩm A',
  product_code: 'SP001',
  price: '150.000',
  country_name: 'Việt Nam',
  print_date: '15/12/2024',
  price_per_100g: '75.000'
});
```

## Interface TemplateData

```typescript
interface TemplateData {
  product_name: string;    // Tên sản phẩm
  product_code: string;    // Mã sản phẩm
  price: string;           // Giá bán
  country_name: string;    // Tên quốc gia
  print_date: string;      // Ngày in
  price_per_100g: string;  // Giá trên 100g
}
```

## Các khổ in có sẵn

- **A4**: Khổ giấy A4 (210×297mm)
- **A5**: Khổ giấy A5 (148×210mm)
- **V1**: Khổ tùy chỉnh 1
- **V2**: Khổ tùy chỉnh 2
- **V3**: Khổ tùy chỉnh 3

## Lưu ý

- Mỗi template có styling và layout riêng biệt
- Background image được tham chiếu tương đối trong mỗi template
- Tất cả template đều sử dụng font Times và có responsive design
- Template được tối ưu cho việc in ấn với độ phân giải cao 