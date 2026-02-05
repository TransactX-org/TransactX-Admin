// Common API Response Types
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: PaginationLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

// Email Template Types
export interface EmailTemplate {
  id: string
  slug: string
  name: string
  subject: string
  html_template: string
  text_template: string
  variables: string[]
  is_active: boolean
  version: number
  history: any | null
  locale: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface EmailTemplatesResponse {
  mailTemplate: PaginatedResponse<EmailTemplate>
}

// User Management Types
export interface User {
  id: string
  name: string
  email: string
  username: string
  status: "NEW" | "ACTIVE" | "SUSPENDED" | "INACTIVE"
  avatar: string | null
  country: string
  user_type: "individual" | "business"
  account_type: "main" | "sub"
  kyc_status: string | null
  kyb_status: string | null
  bvn_status: string | null
  nin_status: string | null
  is_active: boolean
  email_verified_at: string | null
  has_transaction_pin: boolean
  has_panic_pin: boolean
  has_wallet: boolean
  wallet_balance: number
  referral_code: string | null
  last_logged_in_device: string | null
  total_transactions?: number
  linked_accounts_count?: number
  referrals_count?: number
  referred_by?: any | null
  subscription?: Subscription | null
  wallet?: Wallet | null
  created_at: string
  updated_at: string
  first_name?: string
  last_name?: string
  phone?: string
}

export interface Subscription {
  id: string
  user_id: string
  subscription_model_id: string
  next_subscription_model_id: string | null
  method: string
  billing: string
  start_date: string
  end_date: string
  renewal_date: string
  cancelled_at: string | null
  status: string
  is_auto_renew: boolean
  metadata: any | null
}

export interface UserSubscription {
  id: string
  model_name: string
  billing: string
  status: string
  start_date: string
  end_date: string
  is_auto_renew: boolean
  payments_count: number
  created_at: string
}

export interface Wallet {
  id: string
  user_id: string
  balance: number
  currency: string
  account_number: string
  account_name: string
  bank_name: string
  created_at: string
  updated_at: string
}

export interface Beneficiary {
  id: string
  service: string
  account_number: string | null
  account_name: string | null
  bank_name: string | null
  bank_code: string | null
  phone_number: string | null
  network: string | null
  created_at: string
}

export interface LinkedBankAccount {
  id: string
  account_number: string
  account_name: string
  bank_name: string
  bank_code: string
  type: string
  status: string
  provider: string
  currency: string
  country: string
  balance: number
  created_at: string
}

export interface VirtualBankAccount {
  id: string
  account_number: string
  account_name: string
  bank_name: string
  bank_code: string
  currency: string
  provider: string
  country: string
  created_at: string
}

export interface UserTransaction {
  id: string
  user_id: string
  wallet_id: string
  wallet_transaction_id: string | null
  principal_transaction_id: string | null
  type: string
  description: string
  narration: string | null
  amount: number
  currency: string
  payload: any | null
  reference: string
  external_transaction_reference: string | null
  status: string
  is_withdrawn: number | boolean
  created_at: string
  updated_at: string
}

export interface UserStats {
  total_users: number
  active_users: number
  suspended_users: number
  verified_users: number
  kyc_verified_users: number
  users_with_wallet: number
  users_created_today: number
  users_created_this_week: number
  users_created_this_month: number
  bvn_verified_users: number
  nin_verified_users: number
}

export interface CreateUserPayload {
  name: string
  email: string
  username: string
  password: string
  status: "NEW" | "ACTIVE" | "SUSPENDED" | "INACTIVE"
  user_type: "individual" | "business"
  account_type: "main" | "sub"
  country: string
  is_active: string | number
  verify_email: string | number
  create_wallet: string | number
}

export interface CreateUserResponse {
  user: User
}

// Service Provider/Network Types
export interface ServiceProvider {
  name: string
  code: string
  id: string
  avatar: string
}

// Airtime Types
export interface AirtimeStats {
  totalPurchases: number
  totalPending: number
  totalRevenue: number
  successRate: number
}

export interface AirtimeTransaction {
  transactionId: string
  user: string
  phoneNumber: string
  network: string
  status: string
  date: string
  amount?: number
}

export interface AirtimeTransactionDetail {
  reference: string
  external_reference: string
  type: string
  is_fee: boolean
  status: string
  description: string
  narration: string | null
  amount: number
  currency: string
  fee: number
  total_debited: number
  date: string
  date_human: string
  user_ip: string | null
  sender: {
    name: string
    email: string
    username: string
    account_number: string
    bank_name: string
  }
  service: {
    category: string
    details: {
      phone_number: string
      network: string
    }
  }
  payload: {
    network: string
    phone_number: string
  }
}

// Data Types
export interface DataStats {
  totalPurchases: number
  totalPending: number
  totalRevenue: number
  successRate: number
  activePlans: number
}

export interface DataTransaction {
  transactionId: string
  user: string
  phoneNumber: string
  network: string
  plan: string
  amount: number
  date: string
  status?: string
}

export interface DataTransactionDetail {
  reference: string
  external_reference: string
  type: string
  is_fee: boolean
  status: string
  description: string
  narration: string | null
  amount: number
  currency: string
  fee: number
  total_debited: number
  date: string
  date_human: string
  user_ip: string | null
  sender: {
    name: string
    email: string
    username: string
    account_number: string
    bank_name: string
  }
  service: {
    category: string
    details: {
      phone_number: string
      network: string
      plan: string
    }
  }
  payload: {
    plan: string
    network: string
    validity: string
    phone_number: string
  }
}

// Electricity Types
export interface ElectricityStats {
  totalPayments: number
  totalPending: number
  totalRevenue: number
  successRate: number
  providers: number
}

export interface ElectricityTransaction {
  transactionId: string
  user: string
  meterNumber: string
  provider: string
  amount: number
  units: string | number
  status: string
  date: string
}

export interface ElectricityTransactionDetail {
  reference: string
  external_reference: string
  type: string
  is_fee: boolean
  status: string
  description: string
  narration: string | null
  amount: number
  currency: string
  fee: number
  total_debited: number
  date: string
  date_human: string
  user_ip: string | null
  sender: {
    name: string
    email: string
    username: string
    account_number: string
    bank_name: string
  }
  service: {
    category: string
    details: {
      number: string
      company: string
      units: string | number
      token: string
      vendType: string
      vendTime: string
    }
  }
  payload: {
    token: string
    units: string | number
    number: string
    company: string
    vendTime: string
    vendType: string
  }
}

// TV Types (assuming similar structure to others)
export interface TVStats {
  totalSubscriptions?: number
  totalPending?: number
  totalRevenue?: number
  successRate?: number
  providers?: number
}

export interface TVTransaction {
  transactionId: string
  user: string
  smartCardNumber: string
  provider: string
  package: string
  amount: number
  status: string
  date: string
}

// Notification Types
export interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  created_at: string
  updated_at: string
}

// Admin Management Types
export interface Admin {
  id: string
  name: string
  avatar: string | null
  email: string
  email_verified_at: string | null
  permissions: string[] | string
  is_super_admin: boolean
  first_name: string
  last_name: string
  role: AdminRole
  created_at?: string
  updated_at?: string
  deleted_at: string | null
}

export interface AdminRole {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface AdminStats {
  total_admins: number
  super_admins: number
  regular_admins: number
  admins_by_role: {
    role_name: string
    count: number
  }[]
}

export interface CreateAdminPayload {
  first_name: string
  last_name: string
  email: string
  password?: string
  role_id: string
  permissions: string[]
}

export interface UpdateAdminRolePayload {
  role_id: string
  permissions: string[]
}
// Transaction Types
export interface TransactionSummary {
  transactionId: string
  user: string
  amount: number
  type: string
  status: string
  date: string
}

export interface TransactionDetail {
  reference: string
  external_reference: string | null
  type: string
  is_fee: boolean
  status: string
  description: string
  narration: string | null
  amount: number
  currency: string
  fee: number
  total_debited: number
  date: string
  date_human: string
  user_ip: string | null
  sender: {
    name: string
    email: string
    username: string
    account_number: string
    bank_name: string
  }
  recipient: {
    requested_from_name?: string
    requested_from_username?: string
    requested_from_email?: string
    status?: string
    type?: string | null
  } | null
  service: any | null
  payload: any | null
}

export interface TransactionStatistics {
  summary: {
    total_revenue: number
    successful_transactions: number
    active_users: number
    pending_transactions: number
  }
  charts: {
    revenue_overview: {
      month: string
      revenue: number
    }[]
    transaction_volume: {
      day: number
      total: number
    }[]
  }
}

export interface TransactionReports {
  summary: {
    total_revenue: number
    successful_transactions: number
    total_transactions: number
    success_rate: number
    active_users: number
  }
  charts: {
    user_growth: {
      month: string
      count: number
    }[]
    transaction_breakdown: {
      type: string
      count: number
      percentage: number
    }[]
    revenue_overview: {
      month: string
      revenue: number
    }[]
    transaction_volume: {
      month: string
      total: number
    }[]
  }
}
