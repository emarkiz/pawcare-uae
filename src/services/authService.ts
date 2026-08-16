import { supabase } from './supabase';
import type { RegisterPetOwnerPayload } from '../types';
import { formatPhoneUae } from '../utils/registration';

export interface RegisterPetOwnerResult {
  userId: string;
  petId: string;
  needsEmailVerification: boolean;
  needsPhoneVerification: boolean;
}

export async function registerPetOwner(
  payload: RegisterPetOwnerPayload & { password: string },
): Promise<RegisterPetOwnerResult> {
  const phone = formatPhoneUae(payload.phone);

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: payload.email.trim(),
    password: payload.password,
    phone,
    options: {
      data: {
        full_name: payload.full_name.trim(),
        role: 'customer',
        emirate: payload.emirate,
        area: payload.area.trim(),
      },
    },
  });

  if (authError) throw authError;

  const userId = authData.user?.id;
  if (!userId) throw new Error('Account creation failed. Please try again.');

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: userId,
      email: payload.email.trim(),
      phone,
      full_name: payload.full_name.trim(),
      role: 'customer',
      emirate: payload.emirate,
      area: payload.area.trim(),
      is_verified: false,
    },
    { onConflict: 'id' },
  );

  if (profileError) throw profileError;

  const { data: petData, error: petError } = await supabase
    .from('pets')
    .insert({
      owner_id: userId,
      name: payload.pet.name.trim(),
      type: payload.pet.type,
      breed: payload.pet.breed?.trim() || null,
      age: payload.pet.age?.trim() || null,
      medical_history: payload.pet.medical_history?.trim() || null,
      medications: payload.pet.medications?.trim() || null,
      allergies: payload.pet.allergies?.trim() || null,
      vaccination_status: payload.pet.vaccination_status,
      temperament: payload.pet.temperament ?? null,
    })
    .select('id')
    .single();

  if (petError) throw petError;

  return {
    userId,
    petId: petData.id,
    needsEmailVerification: !authData.session && !authData.user?.email_confirmed_at,
    needsPhoneVerification: Boolean(phone && !authData.user?.phone_confirmed_at),
  };
}
