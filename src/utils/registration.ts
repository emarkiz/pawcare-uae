import type {
  Emirate,
  PetType,
  RegisterPetOwnerPayload,
  Temperament,
  VaccinationStatus,
} from '../types';

export const EMIRATES: Emirate[] = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'RAK',
  'Fujairah',
  'Umm Al Quwain',
];

export const VACCINATION_OPTIONS: { label: string; value: VaccinationStatus }[] = [
  { label: 'Fully Vaccinated', value: 'fully_vaccinated' },
  { label: 'Partially Vaccinated', value: 'partially_vaccinated' },
  { label: 'Not Vaccinated', value: 'not_vaccinated' },
];

export const TEMPERAMENT_OPTIONS: { label: string; value: Temperament }[] = [
  { label: 'Friendly & Social', value: 'friendly_social' },
  { label: 'Shy / Nervous', value: 'shy_nervous' },
  { label: 'Energetic', value: 'energetic' },
  { label: 'Aggressive (needs caution)', value: 'aggressive_caution' },
];

export const PET_TYPE_OPTIONS: { label: string; value: PetType; emoji: string }[] = [
  { label: 'Dog', value: 'dog', emoji: '🐕' },
  { label: 'Cat', value: 'cat', emoji: '🐈' },
];

export interface RegisterPetOwnerForm extends RegisterPetOwnerPayload {
  password: string;
  confirmPassword: string;
}

export function validateRegisterForm(form: RegisterPetOwnerForm): string | null {
  if (!form.full_name.trim()) return 'Please enter your full name';
  if (!form.phone.trim()) return 'Please enter your phone number';
  if (!form.email.trim()) return 'Please enter your email address';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    return 'Please enter a valid email address';
  }
  if (!form.password || form.password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (form.password !== form.confirmPassword) {
    return 'Passwords do not match';
  }
  if (!form.area.trim()) return 'Please enter your area / neighbourhood';
  if (!form.pet.name.trim()) return 'Please enter your pet\'s name';
  return null;
}

export function formatPhoneUae(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('971')) return `+${digits}`;
  if (digits.startsWith('0')) return `+971${digits.slice(1)}`;
  if (digits.length === 9) return `+971${digits}`;
  return phone.startsWith('+') ? phone : `+${digits}`;
}
