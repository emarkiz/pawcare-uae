import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import {
  FormInput,
  FormLabel,
  FormTextArea,
  SectionHeader,
  SubmitButton,
} from '../../components/forms/FormFields';
import { FormPicker } from '../../components/forms/FormPicker';
import { PetTypeToggle } from '../../components/forms/PetTypeToggle';
import { registerPetOwner } from '../../services/authService';
import { isSupabaseConfigured } from '../../services/supabase';
import { showToast } from '../../store/useToastStore';
import { useAuthStore } from '../../store/useAuthStore';
import type { AuthStackParamList, Emirate, PetType, Temperament, VaccinationStatus } from '../../types';
import {
  EMIRATES,
  TEMPERAMENT_OPTIONS,
  VACCINATION_OPTIONS,
  validateRegisterForm,
  type RegisterPetOwnerForm,
} from '../../utils/registration';
import { borderRadius, colors, spacing, typography } from '../../utils/theme';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'RegisterPet'>;

const INITIAL_FORM: RegisterPetOwnerForm = {
  full_name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  emirate: 'Dubai',
  area: '',
  pet: {
    name: '',
    type: 'dog',
    breed: '',
    age: '',
    medical_history: '',
    medications: '',
    allergies: '',
    vaccination_status: 'fully_vaccinated',
    temperament: 'friendly_social',
  },
};

export default function RegisterPetScreen() {
  const navigation = useNavigation<NavigationProp>();
  const fetchProfile = useAuthStore((s) => s.fetchProfile);

  const [form, setForm] = useState<RegisterPetOwnerForm>(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = <K extends keyof RegisterPetOwnerForm>(
    key: K,
    value: RegisterPetOwnerForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updatePetField = <K extends keyof RegisterPetOwnerForm['pet']>(
    key: K,
    value: RegisterPetOwnerForm['pet'][K],
  ) => {
    setForm((prev) => ({
      ...prev,
      pet: { ...prev.pet, [key]: value },
    }));
  };

  const handleSubmit = useCallback(async () => {
    const validationError = validateRegisterForm(form);
    if (validationError) {
      showToast(validationError);
      return;
    }

    if (!isSupabaseConfigured) {
      showToast('Supabase is not configured. Add keys to .env');
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerPetOwner({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        emirate: form.emirate,
        area: form.area,
        pet: form.pet,
      });

      await fetchProfile(result.userId);

      if (result.needsPhoneVerification) {
        navigation.replace('Otp', {
          phone: form.phone,
          email: form.email.trim(),
        });
        return;
      }

      navigation.replace('RegisterSuccess', {
        petName: form.pet.name.trim(),
        needsEmailVerification: result.needsEmailVerification,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Registration failed. Please try again.';
      showToast(message);
    } finally {
      setIsLoading(false);
    }
  }, [form, fetchProfile, navigation]);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[colors.primary, colors.dark]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.header}
      >
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Register Your Pet 🐾</Text>
        <Text style={styles.headerSubtitle}>Create your account to book services</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formWrap}>
            <SectionHeader icon="👤" title="Owner Details" />

            <FormLabel>Full Name</FormLabel>
            <FormInput
              value={form.full_name}
              onChangeText={(v) => updateField('full_name', v)}
              placeholder="e.g. Ahmed Al Rashid"
              autoCapitalize="words"
              editable={!isLoading}
            />

            <View style={styles.row2}>
              <View style={styles.half}>
                <FormLabel>Phone</FormLabel>
                <FormInput
                  value={form.phone}
                  onChangeText={(v) => updateField('phone', v)}
                  placeholder="+971 50..."
                  keyboardType="phone-pad"
                  editable={!isLoading}
                  style={styles.halfInput}
                />
              </View>
              <View style={styles.half}>
                <FormLabel>Email</FormLabel>
                <FormInput
                  value={form.email}
                  onChangeText={(v) => updateField('email', v)}
                  placeholder="you@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                  style={styles.halfInput}
                />
              </View>
            </View>

            <FormLabel>Password</FormLabel>
            <View style={styles.passwordRow}>
              <FormInput
                value={form.password}
                onChangeText={(v) => updateField('password', v)}
                placeholder="Min. 8 characters"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isLoading}
                style={styles.passwordInput}
              />
              <Pressable style={styles.toggleBtn} onPress={() => setShowPassword((v) => !v)}>
                <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </Pressable>
            </View>

            <FormLabel>Confirm Password</FormLabel>
            <FormInput
              value={form.confirmPassword}
              onChangeText={(v) => updateField('confirmPassword', v)}
              placeholder="Re-enter password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!isLoading}
            />

            <FormPicker<Emirate>
              label="Emirate"
              value={form.emirate}
              options={EMIRATES.map((e) => ({ label: e, value: e }))}
              onValueChange={(v) => updateField('emirate', v)}
            />

            <FormLabel>Area / Neighbourhood</FormLabel>
            <FormInput
              value={form.area}
              onChangeText={(v) => updateField('area', v)}
              placeholder="e.g. JBR, Marina, Mirdif..."
              editable={!isLoading}
            />

            <SectionHeader icon="🐾" title="Pet Details" />

            <FormLabel>Pet Name</FormLabel>
            <FormInput
              value={form.pet.name}
              onChangeText={(v) => updatePetField('name', v)}
              placeholder="e.g. Max, Bella, Luna..."
              editable={!isLoading}
            />

            <FormLabel>Pet Type</FormLabel>
            <PetTypeToggle
              value={form.pet.type}
              onChange={(type: PetType) => updatePetField('type', type)}
            />

            <View style={styles.row2}>
              <View style={styles.half}>
                <FormLabel>Age</FormLabel>
                <FormInput
                  value={form.pet.age ?? ''}
                  onChangeText={(v) => updatePetField('age', v)}
                  placeholder="e.g. 2 years"
                  editable={!isLoading}
                  style={styles.halfInput}
                />
              </View>
              <View style={styles.half}>
                <FormLabel>Breed</FormLabel>
                <FormInput
                  value={form.pet.breed ?? ''}
                  onChangeText={(v) => updatePetField('breed', v)}
                  placeholder="e.g. Labrador"
                  editable={!isLoading}
                  style={styles.halfInput}
                />
              </View>
            </View>

            <FormLabel>Medical History</FormLabel>
            <FormTextArea
              value={form.pet.medical_history ?? ''}
              onChangeText={(v) => updatePetField('medical_history', v)}
              placeholder="Any health conditions or past surgeries..."
              editable={!isLoading}
            />

            <FormLabel>Current Medications</FormLabel>
            <FormTextArea
              value={form.pet.medications ?? ''}
              onChangeText={(v) => updatePetField('medications', v)}
              placeholder="List any ongoing medications..."
              editable={!isLoading}
            />

            <FormLabel>Allergies</FormLabel>
            <FormInput
              value={form.pet.allergies ?? ''}
              onChangeText={(v) => updatePetField('allergies', v)}
              placeholder="e.g. Chicken, pollen, latex..."
              editable={!isLoading}
            />

            <FormPicker<VaccinationStatus>
              label="Vaccination Status"
              value={form.pet.vaccination_status}
              options={VACCINATION_OPTIONS}
              onValueChange={(v) => updatePetField('vaccination_status', v)}
            />

            <FormPicker<Temperament>
              label="Temperament"
              value={form.pet.temperament ?? 'friendly_social'}
              options={TEMPERAMENT_OPTIONS}
              onValueChange={(v) => updatePetField('temperament', v)}
            />

            <SubmitButton
              label="Create Account & Register Pet"
              onPress={handleSubmit}
              loading={isLoading}
            />

            <Text style={styles.loginRow}>
              Already have an account?{' '}
              <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                Log In
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: spacing.xl,
  },
  backBtn: {
    marginBottom: spacing.md,
  },
  backText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: typography.sizes.base,
    color: 'rgba(255,255,255,0.85)',
  },
  headerTitle: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: typography.sizes.h2,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: typography.sizes.base,
    color: 'rgba(255,255,255,0.85)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxxl,
  },
  formWrap: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    marginTop: -16,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  row2: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  half: {
    flex: 1,
  },
  halfInput: {
    marginBottom: spacing.lg,
  },
  passwordRow: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  passwordInput: {
    marginBottom: 0,
    paddingRight: 56,
  },
  toggleBtn: {
    position: 'absolute',
    right: spacing.md,
    top: 12,
  },
  toggleText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: typography.sizes.md,
    color: colors.primary,
  },
  loginRow: {
    fontFamily: 'Nunito_400Regular',
    fontSize: typography.sizes.base,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  link: {
    fontFamily: 'Nunito_800ExtraBold',
    color: colors.primary,
  },
});
