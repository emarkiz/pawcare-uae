import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { supabase, isSupabaseConfigured } from '../../services/supabase';
import { showToast } from '../../store/useToastStore';
import { useAuthStore } from '../../store/useAuthStore';
import type { AuthStackParamList } from '../../types';
import { borderRadius, colors, spacing, typography } from '../../utils/theme';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Otp'>;
type OtpRouteProp = RouteProp<AuthStackParamList, 'Otp'>;

const OTP_LENGTH = 4;
const TIMER_SECONDS = 120;

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  return phone.replace(/\d(?=\d{2})/g, (match, offset, str) => {
    const digitIndex = str.slice(0, offset + 1).replace(/\D/g, '').length;
    return digitIndex <= digits.length - 2 ? 'x' : match;
  });
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function OTPScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OtpRouteProp>();
  const { phone, email } = route.params;

  const fetchProfile = useAuthStore((s) => s.fetchProfile);

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const verifyCode = useCallback(
    async (code: string) => {
      if (!isSupabaseConfigured) {
        showToast('Supabase is not configured. Add keys to .env');
        return;
      }

      if (!phone && !email) {
        showToast('Missing verification destination');
        return;
      }

      setIsVerifying(true);
      try {
        const { data, error } = email
          ? await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
          : await supabase.auth.verifyOtp({ phone: phone!, token: code, type: 'sms' });

        if (error) {
          showToast('Invalid verification code. Please try again.');
          setDigits(Array(OTP_LENGTH).fill(''));
          inputRefs.current[0]?.focus();
          return;
        }

        if (data.user) {
          await fetchProfile(data.user.id);
        }
      } catch {
        showToast('Verification failed. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    },
    [phone, email, fetchProfile],
  );

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/\D/g, '').slice(-1);
      const next = [...digits];
      next[index] = digit;
      setDigits(next);

      if (digit && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      const code = next.join('');
      if (code.length === OTP_LENGTH && next.every(Boolean)) {
        verifyCode(code);
      }
    },
    [digits, verifyCode],
  );

  const handleKeyPress = useCallback(
    (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits],
  );

  const handleResend = useCallback(async () => {
    if (!isSupabaseConfigured) {
      showToast('Supabase is not configured. Add keys to .env');
      return;
    }

    setIsResending(true);
    try {
      if (!phone && !email) {
        showToast('Missing verification destination');
        return;
      }

      if (email) {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) showToast(error.message);
        else showToast('Verification code resent!');
      } else if (phone) {
        const { error } = await supabase.auth.signInWithOtp({ phone });
        if (error) showToast(error.message);
        else showToast('Verification code resent!');
      }
      setSecondsLeft(TIMER_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch {
      showToast('Could not resend code');
    } finally {
      setIsResending(false);
    }
  }, [phone, email]);

  const handleManualVerify = useCallback(() => {
    const code = digits.join('');
    if (code.length < OTP_LENGTH) {
      showToast('Please enter the full 4-digit code');
      return;
    }
    verifyCode(code);
  }, [digits, verifyCode]);

  const destination = email ?? (phone ? maskPhone(phone) : 'your device');

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
        <Text style={styles.headerTitle}>Verify Your Number 📱</Text>
        <Text style={styles.headerSubtitle}>
          We sent a 4-digit code to {destination}
        </Text>
      </LinearGradient>

      <View style={styles.formWrap}>
        <Text style={styles.icon}>📲</Text>
        <Text style={styles.prompt}>Enter verification code</Text>
        <Text style={styles.hint}>Check your SMS messages for the code</Text>

        <View style={styles.otpRow}>
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              value={digit}
              onChangeText={(v) => handleDigitChange(index, v)}
              onKeyPress={(e) => handleKeyPress(index, e)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isVerifying}
            />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && styles.pressed,
            isVerifying && styles.disabled,
          ]}
          onPress={handleManualVerify}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.submitIcon}>✓</Text>
              <Text style={styles.submitText}>Verify & Continue</Text>
            </>
          )}
        </Pressable>

        <View style={styles.resendRow}>
          {secondsLeft > 0 ? (
            <Text style={styles.timerText}>
              Code expires in{' '}
              <Text style={styles.timerHighlight}>{formatTimer(secondsLeft)}</Text>
            </Text>
          ) : (
            <Text style={styles.resendPrompt}>
              Didn&apos;t receive it?{' '}
              <Text style={styles.resendLink} onPress={handleResend}>
                {isResending ? 'Sending…' : 'Resend OTP'}
              </Text>
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
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
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: typography.sizes.base,
    color: 'rgba(255,255,255,0.85)',
  },
  formWrap: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    marginTop: -16,
    paddingHorizontal: spacing.lg,
    paddingTop: 30,
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  prompt: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: typography.sizes.xl,
    color: colors.text,
    marginBottom: 6,
  },
  hint: {
    fontFamily: 'Nunito_400Regular',
    fontSize: typography.sizes.base,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  otpRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  otpBox: {
    width: 52,
    height: 58,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    fontFamily: 'Nunito_900Black',
    fontSize: 24,
    fontWeight: typography.weights.black,
    textAlign: 'center',
    color: colors.text,
    backgroundColor: colors.cream,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: 14,
    marginTop: spacing.sm,
  },
  submitIcon: {
    fontSize: typography.sizes.xxl,
    color: colors.white,
  },
  submitText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: typography.sizes.xl,
    color: colors.white,
  },
  resendRow: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  timerText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: typography.sizes.base,
    color: colors.muted,
  },
  timerHighlight: {
    fontFamily: 'Nunito_800ExtraBold',
    color: colors.primary,
  },
  resendPrompt: {
    fontFamily: 'Nunito_400Regular',
    fontSize: typography.sizes.base,
    color: colors.muted,
  },
  resendLink: {
    fontFamily: 'Nunito_800ExtraBold',
    color: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.7,
  },
});
