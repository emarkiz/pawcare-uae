import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuthStore } from '../store/useAuthStore';
import { borderRadius, colors, spacing, typography } from '../utils/theme';

interface PlaceholderScreenProps {
  title: string;
  subtitle?: string;
  showSignOut?: boolean;
}

export default function PlaceholderScreen({
  title,
  subtitle = 'Coming in a future session',
  showSignOut = false,
}: PlaceholderScreenProps) {
  const signOut = useAuthStore((s) => s.signOut);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🐾</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {showSignOut && (
        <Pressable style={styles.btn} onPress={() => signOut()}>
          <Text style={styles.btnText}>Sign Out</Text>
        </Pressable>
      )}
      {!showSignOut && navigation.canGoBack() && (
        <Pressable style={styles.btnOutline} onPress={() => navigation.goBack()}>
          <Text style={styles.btnOutlineText}>Go Back</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xxl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: typography.sizes.h2,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: typography.sizes.lg,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.md,
  },
  btnText: {
    fontFamily: 'Nunito_800ExtraBold',
    color: colors.white,
    fontSize: typography.sizes.lg,
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.md,
  },
  btnOutlineText: {
    fontFamily: 'Nunito_800ExtraBold',
    color: colors.primary,
    fontSize: typography.sizes.lg,
  },
});
