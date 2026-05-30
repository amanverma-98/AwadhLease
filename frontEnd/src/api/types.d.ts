export type HealthResponse = Record<string, unknown>

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type?: string
}

export interface RegisterLandlordRequest {
  full_name: string
  email: string
  phone: string
  password: string
  property_type: string
  property_count: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RefreshRequest {
  refresh_token: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  status: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface ResetPasswordResponse {
  status: string
}

export interface UserUpdate {
  full_name?: string | null
  email?: string | null
  phone?: string | null
}

export interface UserMeResponse {
  id: string
  full_name: string
  email: string
  phone: string
  role: string
  landlord_id?: string | null
  tenant_id?: string | null
  property_id?: string | null
  lease_start?: string | null
  lease_end?: string | null
  rent_status?: string | null
}

export interface PropertyCreate {
  name: string
  address: string
  city?: string
  locality?: string | null
  property_type: string
  bhk?: number | null
  furnished?: boolean | null
  parking?: boolean | null
  wifi?: boolean | null
  ac?: boolean | null
  pet_friendly?: boolean | null
  occupancy_status: string
  monthly_rent: number
  security_deposit?: number | null
  images?: string[]
  amenities?: string[]
  rules?: string[]
  available_from?: string | null
  latitude?: number | null
  longitude?: number | null
  description?: string | null
}

export interface PropertyUpdate {
  name?: string | null
  address?: string | null
  city?: string | null
  locality?: string | null
  property_type?: string | null
  bhk?: number | null
  furnished?: boolean | null
  parking?: boolean | null
  wifi?: boolean | null
  ac?: boolean | null
  pet_friendly?: boolean | null
  occupancy_status?: string | null
  monthly_rent?: number | null
  security_deposit?: number | null
  images?: string[] | null
  amenities?: string[] | null
  rules?: string[] | null
  available_from?: string | null
  latitude?: number | null
  longitude?: number | null
  description?: string | null
}

export interface PropertyOut {
  id: string
  landlord_id?: string | null
  name: string
  address: string
  city: string
  locality: string
  property_type: string
  bhk?: number | null
  furnished?: boolean | null
  parking?: boolean | null
  wifi?: boolean | null
  ac?: boolean | null
  pet_friendly?: boolean | null
  occupancy_status: string
  monthly_rent: number
  security_deposit?: number | null
  images: string[]
  amenities: string[]
  rules: string[]
  available_from?: string | null
  latitude?: number | null
  longitude?: number | null
  description?: string | null
  created_at: string
  updated_at: string
}

export interface ContactLandlordRequest {
  name: string
  phone: string
  message?: string | null
}

export interface ContactLandlordResponse {
  status: string
}

export interface TenantCreate {
  property_id: string
  landlord_id?: string | null
  full_name: string
  phone: string
  email: string
  aadhaar_number: string
  pan_number: string
  lease_start: string
  lease_end: string
  rent_status: string
}

export interface TenantUpdate {
  property_id?: string | null
  landlord_id?: string | null
  full_name?: string | null
  phone?: string | null
  email?: string | null
  aadhaar_number?: string | null
  pan_number?: string | null
  lease_start?: string | null
  lease_end?: string | null
  rent_status?: string | null
}

export interface TenantOut {
  id: string
  property_id: string
  landlord_id?: string | null
  full_name: string
  phone: string
  email: string
  aadhaar_number: string
  pan_number: string
  lease_start: string
  lease_end: string
  rent_status: string
  status: string
  created_at: string
}

export interface TenantCreateResponse {
  tenant: TenantOut
  username: string
  temporary_password: string
}

export interface MaintenanceCreate {
  property_id?: string | null
  tenant_id?: string | null
  issue: string
  issue_images?: string[]
}

export interface MaintenanceOut {
  id: string
  property_id: string
  tenant_id: string
  issue: string
  issue_images: string[]
  category: string
  priority: string
  estimated_cost: number
  status: string
  assigned_vendor?: string | null
  summary?: string | null
  created_at: string
}

export interface ChatRequest {
  message: string
  conversation_id?: string | null
}

export interface ChatResponse {
  response: string
  conversation_id: string
}

export interface AnalyticsInsight {
  summary: string
  risks: string[]
  opportunities: string[]
}

export interface AnalyticsMetrics {
  total_collected: number
  total_pending: number
  success_rate: number
  active_tenant_ratio: number
  occupied_property_ratio: number
  open_maintenance_count: number
}

export interface AnalyticsResponse {
  metrics: AnalyticsMetrics
  insight: AnalyticsInsight
}

export interface TenantRiskRequest {
  tenant_id: string
  context: string
}

export interface OccupancyPredictionRequest {
  property_id: string
  context: string
  horizon_days?: number
}

export interface PaymentDelayRequest {
  tenant_id: string
  context: string
}

export interface AIPredictionResponse {
  prediction_id: string
  prediction_type: string
  payload: Record<string, unknown>
}

export interface BookingCreate {
  property_id: string
  tenant_name: string
  tenant_phone: string
  scheduled_at: string
  message?: string | null
}

export interface BookingOut {
  id: string
  property_id: string
  tenant_name: string
  tenant_phone: string
  scheduled_at: string
  status: string
  message?: string | null
  created_at: string
}

export interface NotificationBroadcastRequest {
  title: string
  message: string
  property_id?: string | null
}

export interface NotificationOut {
  id: string
  user_id: string
  title: string
  message: string
  channel: string
  status: string
  meta: Record<string, unknown>
  created_at: string
  read_at?: string | null
}

export interface PaymentCreate {
  tenant_id: string
  property_id: string
  amount: number
  payment_date: string
  payment_status: string
  transaction_id?: string | null
}

export interface TenantPaymentCreate {
  amount: number
  payment_date?: string | null
  payment_status?: string
  transaction_id?: string | null
}

export interface PaymentOut {
  id: string
  tenant_id: string
  property_id: string
  amount: number
  payment_date: string
  payment_status: string
  transaction_id?: string | null
}

export interface UploadResponse {
  url: string
  provider: string
}
