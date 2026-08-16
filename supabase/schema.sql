-- Pawcare — Full Database Schema
-- Run in Supabase SQL Editor or via supabase db push

-- ─── Extensions ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ─── Enums ──────────────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('customer', 'provider', 'vendor', 'vet', 'admin');
CREATE TYPE emirate AS ENUM ('Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'Fujairah', 'Umm Al Quwain');
CREATE TYPE pet_type AS ENUM ('dog', 'cat', 'other');
CREATE TYPE vaccination_status AS ENUM ('fully_vaccinated', 'partially_vaccinated', 'not_vaccinated');
CREATE TYPE temperament AS ENUM ('friendly_social', 'shy_nervous', 'energetic', 'aggressive_caution');
CREATE TYPE service_type AS ENUM ('pet_sitting', 'dog_walking', 'pet_daycare', 'grooming', 'vet_visit', 'vaccination');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'declined');
CREATE TYPE recurrence_frequency AS ENUM ('daily', 'weekly', 'biweekly', 'monthly');
CREATE TYPE recurring_booking_status AS ENUM ('active', 'paused', 'cancelled');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE notification_type AS ENUM ('booking', 'order', 'promo', 'system', 'chat', 'emergency');
CREATE TYPE delivery_instruction AS ENUM ('leave_at_door', 'call_on_arrival', 'ring_doorbell');
CREATE TYPE payment_method_type AS ENUM ('card', 'apple_pay', 'google_pay');
CREATE TYPE vendor_plan_tier AS ENUM ('starter', 'growth', 'enterprise');
CREATE TYPE vendor_subscription_status AS ENUM ('active', 'past_due', 'cancelled', 'trialing');
CREATE TYPE product_category AS ENUM ('dog_food', 'cat_food', 'treats', 'toys', 'grooming', 'accessories', 'health', 'other');
CREATE TYPE vet_type AS ENUM ('individual', 'clinic');
CREATE TYPE loyalty_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE loyalty_transaction_type AS ENUM ('earn', 'redeem', 'referral_bonus', 'expired');
CREATE TYPE emergency_status AS ENUM ('active', 'resolved', 'cancelled');
CREATE TYPE gps_tracking_status AS ENUM ('idle', 'active', 'completed');
CREATE TYPE photo_update_type AS ENUM ('walk', 'sitting', 'daycare', 'grooming', 'general');
CREATE TYPE availability_day AS ENUM ('weekdays', 'weekends', 'flexible', 'full_time');
CREATE TYPE gender AS ENUM ('female', 'male', 'prefer_not_to_say');
CREATE TYPE experience_level AS ENUM ('less_than_1', '1_to_2', '3_to_5', '5_to_10', '10_plus');

-- ─── Users (extends Supabase auth.users) ────────────────────────────────────
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  emirate emirate,
  area TEXT,
  address TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Pets ───────────────────────────────────────────────────────────────────
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type pet_type NOT NULL,
  breed TEXT,
  age TEXT,
  avatar_url TEXT,
  medical_history TEXT,
  medications TEXT,
  allergies TEXT,
  vaccination_status vaccination_status NOT NULL DEFAULT 'not_vaccinated',
  temperament temperament,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vaccination_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  administered_at DATE,
  due_at DATE,
  is_overdue BOOLEAN NOT NULL DEFAULT FALSE,
  vet_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pet_passports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL UNIQUE REFERENCES pets(id) ON DELETE CASCADE,
  microchip_number TEXT,
  registration_number TEXT,
  owner_name TEXT NOT NULL,
  last_vet_visit DATE,
  last_vet_name TEXT,
  medical_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PawPro (Provider) Profiles ─────────────────────────────────────────────
CREATE TABLE provider_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  bio TEXT,
  services service_type[] NOT NULL DEFAULT '{}',
  pet_types pet_type[] NOT NULL DEFAULT '{}',
  experience_level experience_level NOT NULL DEFAULT 'less_than_1',
  certifications TEXT,
  service_area TEXT,
  availability availability_day NOT NULL DEFAULT 'flexible',
  hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 0,
  iban TEXT,
  nationality TEXT,
  emirates_id TEXT,
  gender gender,
  age INTEGER,
  years_experience INTEGER,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  pets_cared_count INTEGER NOT NULL DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE provider_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (provider_id, day_of_week, start_time)
);

-- ─── Vet / Clinic Profiles ──────────────────────────────────────────────────
CREATE TABLE vet_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  vet_type vet_type NOT NULL DEFAULT 'individual',
  clinic_name TEXT,
  specializations TEXT[] NOT NULL DEFAULT '{}',
  license_number TEXT NOT NULL,
  dha_license_url TEXT,
  moccae_license_url TEXT,
  bio TEXT,
  address TEXT,
  emirate emirate,
  phone TEXT,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Vendor Profiles ────────────────────────────────────────────────────────
CREATE TABLE vendor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  emirate emirate,
  address TEXT,
  phone TEXT,
  trn TEXT,
  plan_tier vendor_plan_tier NOT NULL DEFAULT 'starter',
  subscription_status vendor_subscription_status NOT NULL DEFAULT 'trialing',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Products ───────────────────────────────────────────────────────────────
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category product_category NOT NULL DEFAULT 'other',
  price NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  image_url TEXT,
  emoji TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Bookings ───────────────────────────────────────────────────────────────
CREATE TABLE recurring_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  service_type service_type NOT NULL,
  frequency recurrence_frequency NOT NULL,
  preferred_time TIME NOT NULL,
  discount_percent NUMERIC(5, 2) NOT NULL DEFAULT 17,
  status recurring_booking_status NOT NULL DEFAULT 'active',
  next_occurrence DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  service_type service_type NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_hours NUMERIC(4, 2),
  subtotal NUMERIC(10, 2) NOT NULL,
  commission_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.15,
  commission_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  notes TEXT,
  recurring_booking_id UUID REFERENCES recurring_bookings(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Reviews ────────────────────────────────────────────────────────────────
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (booking_id, reviewer_id)
);

-- ─── Chat ───────────────────────────────────────────────────────────────────
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_ids UUID[] NOT NULL,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Orders ─────────────────────────────────────────────────────────────────
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(10, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 15,
  vat_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_instructions delivery_instruction,
  delivery_notes TEXT,
  courier_partner TEXT,
  tracking_number TEXT,
  stripe_payment_intent_id TEXT,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL
);

-- ─── Payments & Payouts ─────────────────────────────────────────────────────
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type payment_method_type NOT NULL,
  stripe_payment_method_id TEXT NOT NULL,
  last_four TEXT,
  brand TEXT,
  expiry_month INTEGER,
  expiry_year INTEGER,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  commission_deducted NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status payout_status NOT NULL DEFAULT 'pending',
  iban TEXT NOT NULL,
  reference TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vat_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  trn TEXT NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  vat_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.05,
  vat_amount NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  customer_address TEXT
);

-- ─── Notifications ──────────────────────────────────────────────────────────
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Platform Settings ──────────────────────────────────────────────────────
CREATE TABLE commission_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_commission_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.15,
  store_commission_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.05,
  vendor_subscription_starter NUMERIC(10, 2) NOT NULL DEFAULT 99,
  vendor_subscription_growth NUMERIC(10, 2) NOT NULL DEFAULT 249,
  vendor_subscription_enterprise NUMERIC(10, 2) NOT NULL DEFAULT 499,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO commission_settings (id) VALUES (uuid_generate_v4());

-- ─── Loyalty & Referrals ────────────────────────────────────────────────────
CREATE TABLE loyalty_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  tier loyalty_tier NOT NULL DEFAULT 'bronze',
  referral_code TEXT NOT NULL UNIQUE,
  total_referrals INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loyalty_account_id UUID NOT NULL REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
  type loyalty_transaction_type NOT NULL,
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Emergency SOS ─────────────────────────────────────────────────────────
CREATE TABLE emergency_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  status emergency_status NOT NULL DEFAULT 'active',
  nearest_vet_id UUID REFERENCES vet_profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ─── GPS Walk Tracking ──────────────────────────────────────────────────────
CREATE TABLE gps_tracking_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  status gps_tracking_status NOT NULL DEFAULT 'idle',
  route_coordinates JSONB NOT NULL DEFAULT '[]',
  distance_km NUMERIC(8, 3),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Live Photo Updates ─────────────────────────────────────────────────────
CREATE TABLE photo_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  type photo_update_type NOT NULL DEFAULT 'general',
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX idx_pets_owner ON pets(owner_id);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_vendor ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_products_vendor ON products(vendor_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_provider_profiles_location ON provider_profiles USING GIST(location);
CREATE INDEX idx_vet_profiles_location ON vet_profiles USING GIST(location);

-- ─── Updated_at Trigger ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER pets_updated_at BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER provider_profiles_updated_at BEFORE UPDATE ON provider_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER vet_profiles_updated_at BEFORE UPDATE ON vet_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER vendor_profiles_updated_at BEFORE UPDATE ON vendor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER pet_passports_updated_at BEFORE UPDATE ON pet_passports FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER recurring_bookings_updated_at BEFORE UPDATE ON recurring_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER loyalty_accounts_updated_at BEFORE UPDATE ON loyalty_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ─────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update/insert their own profile
CREATE POLICY profiles_select ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);

-- Pets: owners manage their pets
CREATE POLICY pets_owner_all ON pets FOR ALL USING (auth.uid() = owner_id);

-- Bookings: customers and providers can view their bookings
CREATE POLICY bookings_customer ON bookings FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY bookings_provider ON bookings FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM provider_profiles WHERE id = provider_id)
);

-- Notifications: users see their own
CREATE POLICY notifications_own ON notifications FOR ALL USING (auth.uid() = user_id);

-- Public read for verified providers, vets, products
CREATE POLICY provider_public_read ON provider_profiles FOR SELECT USING (is_verified = TRUE);
CREATE POLICY vet_public_read ON vet_profiles FOR SELECT USING (is_verified = TRUE);
CREATE POLICY products_public_read ON products FOR SELECT USING (is_active = TRUE);

-- ─── Storage Buckets (run in Supabase Dashboard or via API) ───────────────────
-- avatars: user & pet profile photos
-- provider-docs: PawPro verification documents
-- vet-licenses: DHA & MOCCAE licence uploads
-- product-images: vendor product photos
-- photo-updates: live service photo updates
