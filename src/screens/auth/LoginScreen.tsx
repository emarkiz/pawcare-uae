import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import { makeRedirectUri } from 'expo-auth-session';
import { StatusBar } from 'expo-status-bar';

import { supabase, isSupabaseConfigured } from '../../services/supabase';
import { showToast } from '../../store/useToastStore';
import { useAuthStore } from '../../store/useAuthStore';
import type { AuthStackParamList } from '../../types';
import { borderRadius, colors, spacing, typography } from '../../utils/theme';
import { brand } from '../../utils/theme';

WebBrowser.maybeCompleteAuthSession();

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const fetchProfile = useAuthStore((s) => s.fetchProfile);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const handleContinue = useCallback(async () => {
    if (!email.trim() || !password) {
      showToast('Please enter your email and password');
      return;
    }

    if (!isSupabaseConfigured) {
      showToast('Supabase is not configured. Add keys to .env');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        showToast(error.message || 'Invalid email or password');
        return;
      }

      if (data.user) {
        await fetchProfile(data.user.id);

        if (data.user.phone && !data.user.phone_confirmed_at) {
          navigation.navigate('Otp', { phone: data.user.phone, email: email.trim() });
        }
      }
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, fetchProfile, navigation]);

  const handleForgotPassword = useCallback(async () => {
    if (!email.trim()) {
      showToast('Enter your email address first');
      return;
    }

    if (!isSupabaseConfigured) {
      showToast('Supabase is not configured. Add keys to .env');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) {
      showToast(error.message);
    } else {
      showToast('Password reset email sent!');
    }
  }, [email]);

  const handleGoogleSignIn = useCallback(async () => {
    if (!isSupabaseConfigured) {
      showToast('Supabase is not configured. Add keys to .env');
      return;
    }

    setIsGoogleLoading(true);
    try {
      const redirectUrl = makeRedirectUri();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error || !data.url) {
        showToast(error?.message ?? 'Google sign-in failed');
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (result.type === 'success' && result.url) {
        const hashParams = new URLSearchParams(result.url.split('#')[1] ?? '');
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            showToast(sessionError.message);
            return;
          }

          if (sessionData.user) {
            await fetchProfile(sessionData.user.id);
          }
        }
      }
    } catch {
      showToast('Google sign-in failed');
    } finally {
      setIsGoogleLoading(false);
    }
  }, [fetchProfile]);

  const handleAppleSignIn = useCallback(async () => {
    if (Platform.OS !== 'ios') return;

    if (!isSupabaseConfigured) {
      showToast('Supabase is not configured. Add keys to .env');
      return;
    }

    setIsAppleLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        showToast('Apple sign-in failed — no identity token');
        return;
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error) {
        showToast(error.message);
        return;
      }

      if (data.user) {
        await fetchProfile(data.user.id);
      }
    } catch (e: unknown) {
      if ((e as { code?: string }).code !== 'ERR_REQUEST_CANCELED') {
        showToast('Apple sign-in failed');
      }
    } finally {
      setIsAppleLoading(false);
    }
  }, [fetchProfile]);

  const isBusy = isLoading || isGoogleLoading || isAppleLoading;

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
        <Text style={styles.headerTitle}>Welcome Back 👋</Text>
        <Text style={styles.headerSubtitle}>Log in to your {brand.displayName} account</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formWrap}>
            <Text style={styles.loginArt}>🐶🐱</Text>
            <Text style={styles.intro}>
              Sign in to manage your bookings, chat with PawPros and order pet products
            </Text>

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isBusy}
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.muted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isBusy}
              />
              <Pressable
                style={styles.toggleBtn}
                onPress={() => setShowPassword((v) => !v)}
              >
                <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                pressed && styles.pressed,
                isBusy && styles.disabled,
              ]}
              onPress={handleContinue}
              disabled={isBusy}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Text style={styles.submitIcon}>→</Text>
                  <Text style={styles.submitText}>Continue</Text>
                </>
              )}
            </Pressable>

            <Text style={styles.divider}>or</Text>

            <Pressable
              style={({ pressed }) => [styles.socialBtn, pressed && styles.pressedSocial]}
              onPress={handleGoogleSignIn}
              disabled={isBusy}
            >
              {isGoogleLoading ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Text style={styles.socialBtnText}>🌐 Continue with Google</Text>
              )}
            </Pressable>

            {Platform.OS === 'ios' && (
              <Pressable
                style={({ pressed }) => [styles.appleBtn, pressed && styles.pressedApple]}
                onPress={handleAppleSignIn}
                disabled={isBusy}
              >
                {isAppleLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.appleBtnText}> Apple Sign In</Text>
                )}
              </Pressable>
            )}

            <Text style={styles.signUpRow}>
              Don&apos;t have an account?{' '}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate('RegisterPet')}
              >
                Sign Up
              </Text>
            </Text>

            <Pressable onPress={handleForgotPassword} style={styles.forgotWrap}>
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
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
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: typography.sizes.base,
    color: 'rgba(255,255,255,0.85)',
  },
  formContent: {
    flexGrow: 1,
  },
  formWrap: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    marginTop: -16,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  loginArt: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  intro: {
    fontFamily: 'Nunito_400Regular',
    fontSize: typography.sizes.lg,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.sizes.lg,
    marginBottom: spacing.xxl,
  },
  label: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: typography.sizes.sm,
    color: colors.dark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    fontFamily: 'Nunito_400Regular',
    fontSize: typography.sizes.base,
    color: colors.text,
    backgroundColor: colors.cream,
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
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: 14,
    marginBottom: spacing.lg,
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
  divider: {
    fontFamily: 'Nunito_400Regular',
    fontSize: typography.sizes.base,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  socialBtn: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  socialBtnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: typography.sizes.lg,
    color: colors.text,
  },
  appleBtn: {
    backgroundColor: '#000',
    borderRadius: borderRadius.full,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  appleBtnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: typography.sizes.lg,
    color: colors.white,
  },
  signUpRow: {
    fontFamily: 'Nunito_400Regular',
    fontSize: typography.sizes.base,
    color: colors.muted,
    textAlign: 'center',
  },
  link: {
    fontFamily: 'Nunito_800ExtraBold',
    color: colors.primary,
  },
  forgotWrap: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  pressed: {
    opacity: 0.85,
  },
  pressedSocial: {
    backgroundColor: colors.primaryTint,
  },
  pressedApple: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.7,
  },
});
