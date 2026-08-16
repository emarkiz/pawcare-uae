// ─── Enums & Union Types ────────────────────────────────────────────────────

export type UserRole = 'customer' | 'provider' | 'vendor' | 'vet' | 'admin';

export type Emirate =
  | 'Dubai'
  | 'Abu Dhabi'
  | 'Sharjah'
  | 'Ajman'
  | 'RAK'
  | 'Fujairah'
  | 'Umm Al Quwain';

export type PetType = 'dog' | 'cat' | 'other';

export type VaccinationStatus = 'fully_vaccinated' | 'partially_vaccinated' | 'not_vaccinated';

export type Temperament =
  | 'friendly_social'
  | 'shy_nervous'
  | 'energetic'
  | 'aggressive_caution';

export type ServiceType =
  | 'pet_sitting'
  | 'dog_walking'
  | 'pet_daycare'
  | 'grooming'
  | 'vet_visit'
  | 'vaccination';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'declined';

export type RecurrenceFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export type RecurringBookingStatus = 'active' | 'paused' | 'cancelled';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type NotificationType = 'booking' | 'order' | 'promo' | 'system' | 'chat' | 'emergency';

export type DeliveryInstruction = 'leave_at_door' | 'call_on_arrival' | 'ring_doorbell';

export type PaymentMethodType = 'card' | 'apple_pay' | 'google_pay';

export type VendorPlanTier = 'starter' | 'growth' | 'enterprise';

export type VendorSubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'trialing';

export type ProductCategory =
  | 'dog_food'
  | 'cat_food'
  | 'treats'
  | 'toys'
  | 'grooming'
  | 'accessories'
  | 'health'
  | 'other';

export type VetType = 'individual' | 'clinic';

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type LoyaltyTransactionType = 'earn' | 'redeem' | 'referral_bonus' | 'expired';

export type EmergencyStatus = 'active' | 'resolved' | 'cancelled';

export type GpsTrackingStatus = 'idle' | 'active' | 'completed';

export type PhotoUpdateType = 'walk' | 'sitting' | 'daycare' | 'grooming' | 'general';

export type AvailabilityDay = 'weekdays' | 'weekends' | 'flexible' | 'full_time';

export type Gender = 'female' | 'male' | 'prefer_not_to_say';

export type ExperienceLevel =
  | 'less_than_1'
  | '1_to_2'
  | '3_to_5'
  | '5_to_10'
  | '10_plus';

// ─── Core Entities ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  emirate?: Emirate;
  area?: string;
  address?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  type: PetType;
  breed?: string;
  age?: string;
  avatar_url?: string;
  medical_history?: string;
  medications?: string;
  allergies?: string;
  vaccination_status: VaccinationStatus;
  temperament?: Temperament;
  created_at: string;
  updated_at: string;
}

export interface VaccinationRecord {
  id: string;
  pet_id: string;
  vaccine_name: string;
  administered_at?: string;
  due_at?: string;
  is_overdue: boolean;
  vet_id?: string;
  notes?: string;
  created_at: string;
}

export interface ProviderProfile {
  id: string;
  user_id: string;
  bio?: string;
  services: ServiceType[];
  pet_types: PetType[];
  experience_level: ExperienceLevel;
  certifications?: string;
  service_area?: string;
  availability: AvailabilityDay;
  hourly_rate: number;
  iban?: string;
  nationality?: string;
  emirates_id?: string;
  gender?: Gender;
  age?: number;
  years_experience?: number;
  rating: number;
  review_count: number;
  pets_cared_count: number;
  is_verified: boolean;
  verification_status: VerificationStatus;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface VetProfile {
  id: string;
  user_id: string;
  vet_type: VetType;
  clinic_name?: string;
  specializations: string[];
  license_number: string;
  dha_license_url?: string;
  moccae_license_url?: string;
  bio?: string;
  address?: string;
  emirate?: Emirate;
  phone?: string;
  rating: number;
  review_count: number;
  is_verified: boolean;
  verification_status: VerificationStatus;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface VendorProfile {
  id: string;
  user_id: string;
  store_name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  emirate?: Emirate;
  address?: string;
  phone?: string;
  plan_tier: VendorPlanTier;
  subscription_status: VendorSubscriptionStatus;
  is_verified: boolean;
  verification_status: VerificationStatus;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  description?: string;
  category: ProductCategory;
  price: number;
  compare_at_price?: number;
  image_url?: string;
  emoji?: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  provider_id: string;
  pet_id: string;
  service_type: ServiceType;
  status: BookingStatus;
  scheduled_date: string;
  scheduled_time: string;
  duration_hours?: number;
  subtotal: number;
  commission_rate: number;
  commission_amount: number;
  total: number;
  notes?: string;
  recurring_booking_id?: string;
  stripe_payment_intent_id?: string;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface RecurringBooking {
  id: string;
  customer_id: string;
  provider_id: string;
  pet_id: string;
  service_type: ServiceType;
  frequency: RecurrenceFrequency;
  preferred_time: string;
  discount_percent: number;
  status: RecurringBookingStatus;
  next_occurrence?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant_ids: string[];
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer_id: string;
  vendor_id: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  vat_amount: number;
  total: number;
  delivery_address: string;
  delivery_instructions?: DeliveryInstruction;
  delivery_notes?: string;
  courier_partner?: string;
  tracking_number?: string;
  stripe_payment_intent_id?: string;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: PaymentMethodType;
  stripe_payment_method_id: string;
  last_four?: string;
  brand?: string;
  expiry_month?: number;
  expiry_year?: number;
  is_default: boolean;
  created_at: string;
}

export interface Payout {
  id: string;
  provider_id: string;
  amount: number;
  commission_deducted: number;
  status: PayoutStatus;
  iban: string;
  reference?: string;
  processed_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface CommissionSettings {
  id: string;
  service_commission_rate: number;
  store_commission_rate: number;
  vendor_subscription_starter: number;
  vendor_subscription_growth: number;
  vendor_subscription_enterprise: number;
  updated_at: string;
}

export interface LoyaltyAccount {
  id: string;
  user_id: string;
  points: number;
  tier: LoyaltyTier;
  referral_code: string;
  total_referrals: number;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyTransaction {
  id: string;
  loyalty_account_id: string;
  type: LoyaltyTransactionType;
  points: number;
  description: string;
  created_at: string;
}

export interface EmergencyAlert {
  id: string;
  user_id: string;
  pet_id?: string;
  latitude: number;
  longitude: number;
  address?: string;
  status: EmergencyStatus;
  nearest_vet_id?: string;
  notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface GpsTrackingSession {
  id: string;
  booking_id: string;
  provider_id: string;
  status: GpsTrackingStatus;
  route_coordinates: GeoCoordinate[];
  distance_km?: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface PhotoUpdate {
  id: string;
  booking_id: string;
  provider_id: string;
  type: PhotoUpdateType;
  image_url: string;
  caption?: string;
  created_at: string;
}

export interface PetPassport {
  id: string;
  pet_id: string;
  microchip_number?: string;
  registration_number?: string;
  owner_name: string;
  last_vet_visit?: string;
  last_vet_name?: string;
  vaccination_records: VaccinationRecord[];
  medical_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VatInvoice {
  id: string;
  order_id?: string;
  booking_id?: string;
  invoice_number: string;
  trn: string;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  issued_at: string;
  customer_name: string;
  customer_address?: string;
}

export interface ProviderAvailability {
  id: string;
  provider_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface AdminAnalytics {
  total_users: number;
  active_providers: number;
  total_bookings: number;
  revenue_mtd: number;
  commission_earned: number;
  new_users: number;
  revenue_by_service: Record<ServiceType, number>;
  top_locations: { area: string; booking_count: number }[];
  top_providers: { provider_id: string; name: string; revenue: number; bookings: number; rating: number }[];
}

// ─── API / Form Types ───────────────────────────────────────────────────────

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface OtpVerification {
  phone: string;
  code: string;
}

export interface RegisterPetOwnerPayload {
  full_name: string;
  email: string;
  phone: string;
  emirate: Emirate;
  area: string;
  pet: Omit<Pet, 'id' | 'owner_id' | 'created_at' | 'updated_at'>;
}

export interface RegisterProviderPayload {
  full_name: string;
  email: string;
  phone: string;
  emirates_id: string;
  nationality: string;
  gender: Gender;
  age: number;
  services: ServiceType[];
  pet_types: PetType[];
  experience_level: ExperienceLevel;
  bio: string;
  certifications?: string;
  service_area: string;
  availability: AvailabilityDay;
  hourly_rate: number;
  iban: string;
}

export interface RegisterVendorPayload {
  store_name: string;
  email: string;
  phone: string;
  emirate: Emirate;
  address: string;
  description?: string;
  plan_tier: VendorPlanTier;
  trn?: string;
}

export interface RegisterVetPayload {
  full_name: string;
  email: string;
  phone: string;
  vet_type: VetType;
  clinic_name?: string;
  license_number: string;
  specializations: string[];
  emirate: Emirate;
  address: string;
  bio?: string;
}

export interface CreateBookingPayload {
  provider_id: string;
  pet_id: string;
  service_type: ServiceType;
  scheduled_date: string;
  scheduled_time: string;
  duration_hours?: number;
  notes?: string;
}

export interface BookingSummary {
  service_type: ServiceType;
  provider_name: string;
  pet_name: string;
  date: string;
  time: string;
  subtotal: number;
  commission_rate: number;
  commission_amount: number;
  total: number;
}

export interface CheckoutPayload {
  delivery_address: string;
  delivery_instructions?: DeliveryInstruction;
  delivery_notes?: string;
  payment_method_id: string;
}

// ─── Navigation Param Lists ─────────────────────────────────────────────────

export type AuthStackParamList = {
  Onboard: undefined;
  Login: undefined;
  Otp: { phone?: string; email?: string };
  RegisterPet: undefined;
  RegisterSuccess: { petName: string; needsEmailVerification: boolean };
};

export type RootStackParamList = {
  ProviderProfile: { providerId: string };
  Booking: { providerId: string; serviceType?: ServiceType };
  BookingSuccess: { bookingId: string };
  ChatConversation: { conversationId: string };
  Reviews: { providerId: string };
  RegisterPetOwner: undefined;
  RegisterProvider: undefined;
  RegisterVendor: undefined;
  RegisterVet: undefined;
  ProviderDashboard: undefined;
  ProviderEarnings: undefined;
  VendorDashboard: undefined;
  VendorProducts: undefined;
  VendorAddProduct: undefined;
  VetList: undefined;
  VetProfile: { vetId: string };
  ClinicProfile: { clinicId: string };
  Map: undefined;
  Notifications: undefined;
  PaymentMethods: undefined;
  MultiPet: undefined;
  AdminDashboard: undefined;
  AdminVetVerify: undefined;
  AdminVetDetail: { vetId: string };
  AdminVendor: undefined;
  AdminCommissions: undefined;
  AdminAnalytics: undefined;
  Emergency: undefined;
  GpsTracking: { bookingId: string };
  PetPassport: { petId: string };
  PhotoUpdates: { bookingId: string };
  Loyalty: undefined;
  Recurring: undefined;
  VatInvoice: { invoiceId: string };
  OrderTracking: { orderId: string };
  OrderSuccess: { orderId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Bookings: undefined;
  Store: undefined;
  Chat: undefined;
  Profile: undefined;
};
