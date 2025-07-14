# Search Module

Module tìm kiếm toàn hệ thống cho phép tìm kiếm across tất cả các entities trong hệ thống.

## Tính năng

- **Tìm kiếm toàn hệ thống**: Tìm kiếm trong tất cả các entities
- **Tìm kiếm theo loại**: Tìm kiếm trong từng loại cụ thể
- **Phân trang và sắp xếp**: Hỗ trợ pagination và sorting
- **Lọc kết quả**: Filter theo các tiêu chí khác nhau
- **Tính điểm relevance**: Sắp xếp kết quả theo độ liên quan
- **Search suggestions**: Gợi ý tìm kiếm
- **Quick search**: Tìm kiếm nhanh với kết quả giới hạn
- **Search statistics**: Thống kê kết quả tìm kiếm

## API Endpoints

### 1. Tìm kiếm chính
- **GET** `/api/v1/search`
- **Description**: Tìm kiếm toàn hệ thống
- **Query Parameters**:
  - `query`: Từ khóa tìm kiếm
  - `type`: Loại tìm kiếm (all, products, categories, tags, countries, admins, print_templates)
  - `types`: Mảng các loại tìm kiếm
  - `limit`: Số lượng kết quả (1-100, default: 10)
  - `offset`: Vị trí bắt đầu (default: 0)
  - `sortBy`: Sắp xếp theo trường (default: created_at)
  - `sortOrder`: Thứ tự sắp xếp (asc/desc, default: desc)
  - `categoryId`: Lọc theo category
  - `countryId`: Lọc theo country
  - `tagId`: Lọc theo tag
  - `adminLevel`: Lọc theo admin level
  - `status`: Lọc theo status

### 2. Thống kê tìm kiếm
- **GET** `/api/v1/search/stats`
- **Description**: Lấy thống kê kết quả tìm kiếm
- **Query Parameters**:
  - `query`: Từ khóa tìm kiếm (required)

### 3. Gợi ý tìm kiếm
- **GET** `/api/v1/search/suggestions`
- **Description**: Lấy gợi ý tìm kiếm
- **Query Parameters**:
  - `query`: Từ khóa tìm kiếm (required, min 2 ký tự)
  - `limit`: Số lượng gợi ý (default: 5)

### 4. Tìm kiếm nhanh
- **GET** `/api/v1/search/quick`
- **Description**: Tìm kiếm nhanh với kết quả giới hạn
- **Query Parameters**:
  - `query`: Từ khóa tìm kiếm (required, min 2 ký tự)

## Các loại tìm kiếm

### 1. Products
- Tìm theo tên sản phẩm, mô tả
- Lọc theo category, country, status
- Metadata: code, price, status, category, country, tags

### 2. Categories
- Tìm theo tên danh mục, mô tả
- Lọc theo status
- Metadata: parent, level, status

### 3. Tags
- Tìm theo tên tag, mô tả
- Lọc theo status
- Metadata: status

### 4. Countries
- Tìm theo tên quốc gia, mô tả
- Lọc theo status
- Metadata: code, status

### 5. Admins
- Tìm theo username, fullname
- Lọc theo admin level, status
- Metadata: username, email, level, status, role

### 6. Print Templates
- Tìm theo title, content
- Lọc theo country
- Metadata: country, brand, footer

## Response Format

### Search Response
```json
{
  "statusCode": 200,
  "message": "Search completed successfully",
  "data": {
    "results": [
      {
        "type": "product",
        "id": 1,
        "title": "Product Name",
        "description": "Product description",
        "image": "https://example.com/image.jpg",
        "url": "/products/1",
        "score": 85,
        "metadata": {
          "code": "PROD001",
          "price": 100.00,
          "status": "active",
          "category": "Electronics",
          "country": "Vietnam",
          "tags": ["new", "featured"]
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "limit": 10,
    "offset": 0,
    "hasMore": true,
    "query": "search term",
    "filters": {}
  }
}
```

### Search Stats Response
```json
{
  "statusCode": 200,
  "message": "Search statistics retrieved successfully",
  "data": {
    "total": 150,
    "byType": {
      "products": 50,
      "categories": 20,
      "tags": 15,
      "countries": 10,
      "admins": 5,
      "print_templates": 50
    },
    "query": "search term",
    "executionTime": 45
  }
}
```

### Quick Search Response
```json
{
  "statusCode": 200,
  "message": "Quick search completed successfully",
  "data": {
    "products": [...],
    "categories": [...],
    "tags": [...],
    "countries": [...],
    "admins": [...],
    "print_templates": [...]
  }
}
```

## Tính điểm Relevance

Hệ thống tính điểm relevance dựa trên:
- **Exact match**: 100 điểm
- **Starts with**: 50 điểm
- **Contains in title**: 30 điểm
- **Contains in description**: 10 điểm
- **Word boundary matches**: 5 điểm (title), 2 điểm (description)

## Performance

- Tìm kiếm song song (parallel) cho các loại khác nhau
- Pagination để giới hạn kết quả
- Indexing trên các trường tìm kiếm chính
- Caching cho các truy vấn phổ biến

## Security

- Yêu cầu authentication (JWT)
- Permission-based access control
- Rate limiting
- Input validation và sanitization 