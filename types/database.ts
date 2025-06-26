export interface AdminRole {
  role_id: number
  role_name: string
  role_description?: string
  role_status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export interface Permission {
  permission_id: number
  permission_name: string
  permission_resource:
    | "admins"
    | "roles"
    | "countries"
    | "categories"
    | "products"
    | "product_tags"
    | "price_printing"
    | "settings"
  permission_action:
    | "create"
    | "read"
    | "update"
    | "delete"
    | "approve"
    | "reject"
    | "suspend"
    | "activate"
    | "export"
    | "import"
    | "view"
    | "manage"
  permission_description?: string
  permission_status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export interface RolePermission {
  rp_id: number
  rp_role_id: number
  rp_permission_id: number
  rp_granted: boolean
  created_at: string
  updated_at: string
}

export interface Admin {
  admin_id: number
  admin_username: string
  admin_email: string
  admin_password: string
  admin_fullname: string
  admin_avatar?: string
  admin_phone?: string
  admin_level: "super_admin" | "admin" | "moderator" | "support"
  admin_role_id: number
  admin_last_login?: string
  admin_last_ip?: string
  admin_status: "active" | "inactive" | "suspended"
  admin_two_factor_enabled: boolean
  admin_two_factor_secret?: string
  admin_originator?: number
  created_at: string
  updated_at: string
}

export interface AdminLog {
  log_id: number
  log_admin_id: number
  log_action:
    | "login"
    | "logout"
    | "create"
    | "update"
    | "delete"
    | "approve"
    | "reject"
    | "suspend"
    | "activate"
    | "view"
    | "export"
    | "import"
  log_module:
    | "admins"
    | "roles"
    | "countries"
    | "categories"
    | "products"
    | "product_tags"
    | "price_printing"
    | "settings"
  log_description: string
  log_ip_address: string
  log_user_agent?: string
  log_target_id?: number
  log_target_type?: string
  log_old_data?: any
  log_new_data?: any
  created_at: string
  updated_at: string
}

export interface Country {
  country_id: number
  country_name: string
  country_code: string
  created_at: string
  updated_at: string
}

export interface Category {
  category_id: number
  category_name: string
  parent_id?: number
  created_at: string
  updated_at: string
}

export interface Tag {
  tag_id: number
  tag_name: string
  tag_description?: string
  created_at: string
  updated_at: string
}

export interface Product {
  product_id: number
  category_id: number
  product_name: string
  product_code: string
  price: number
  product_status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export interface ProductTag {
  ptg_id: number
  ptg_product_id: number
  ptg_tag_id: number
  created_at: string
}

export interface PrintTemplate {
  pt_id: number
  pt_country_id: number
  pt_title: string
  pt_content: string
  pt_footer: string
  created_at: string
  updated_at: string
}

export interface PrintSelect {
  ps_id: number
  ps_product_id: number
  ps_coutry_id: number
  ps_price_sale?: number
  ps_type: "a0" | "a1" | "a2" | "a5" | "a6" | "a7"
  ps_status: "active" | "inactive"
}

export interface PrintLog {
  pl_id: number
  pl_admin_id: number
  pl_template_id: number
  pl_print_time: string
  pl_product: number
  pl_log_note?: string
}
