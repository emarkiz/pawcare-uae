import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { useAuthStore } from '../../store/useAuthStore';
import type { AuthStackParamList } from '../../types';
import { borderRadius, colors, spacing, typography } from '../../utils/theme';
import { brand } from '../../utils/theme';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'RegisterSuccess'>;
type SuccessRouteProp = RouteProp<AuthStackParamList, 'RegisterSuccess'>;

export default function RegisterSuccessScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SuccessRouteProp>();
  const session = useAuthStore((s) => s.session);

  const { petName, needsEmailVerification } = route.params;

  const handleExplore = () => {
    if (session) {
      return;
    }
    navigation.navigate('Login');
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.circle}>
          <Text style={styles.emoji}>🎉</Text>
        </View>

        <Text style={styles.title}>You&apos;re all set!</Text>
        <Text style={styles.body}>
          Welcome to PawCare UAE! {petName} is registered and your account is ready.
          {needsEmailVerification
            ? ' Please check your email to verify your account.'
            : ' Start exploring pet care services near you.'}
        </Text>

        <View style={styles.pill}>
          <Text style={styles.pillLabel}>Pet Registered</Text>
          <Text style={styles.pillValue}>{petName} 🐾</Text>
        </View>

        <View style={styles.pill}>
          <Text style={styles.pillLabel}>Next Step</Text>
          <Text style={styles.pillValue}>
            {needsEmailVerification ? 'Check your email for verification' : 'Browse PawPros & book a service'}
          </Text>
        </View>

        {!session && (
          <Pressable style={styles.btn} onPress={handleExplore}>
            <Text style={styles.btnText}>
              {needsEmailVerification ? 'Go to Login' : 'Explore the App 🐾'}
            </Text>
          </Pressable>
        )}

        {session && (
          <Text style={styles.hint}>
            Taking you to {brand.displayName}…
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryTint,
    borderWidth: 4,
    borderColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: typography.sizes.h2 + 2,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  body: {
    fontFamily: 'Nunito_400Regular',
    fontSize: typography.sizes.lg,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: typography.lineHeights.loose * typography.sizes.lg,
    marginBottom: spacing.xxl,
  },
  pill: {
    width: '100%',
    backgroundColor: colors.primaryTint,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  pillLabel: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: typography.sizes.sm,
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  pillValue: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: typography.sizes.lg,
    color: colors.text,
  },
  btn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: 14,
  },
  btnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: typography.sizes.xl,
    color: colors.white,
  },
  hint: {
    marginTop: spacing.lg,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: typography.sizes.base,
    color: colors.muted,
  },
});
