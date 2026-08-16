import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '../../utils/theme';

export function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{icon}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export function FormLabel({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function FormInput({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={colors.muted}
      {...props}
    />
  );
}

export function FormTextArea({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      style={[styles.input, styles.textArea, style]}
      placeholderTextColor={colors.muted}
      multiline
      textAlignVertical="top"
      {...props}
    />
  );
}

interface SubmitButtonProps {
  label: string;
  icon?: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function SubmitButton({ label, icon = '✓', onPress, loading, disabled }: SubmitButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.submitBtn,
        (pressed || loading || disabled) && styles.submitPressed,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <>
          <Text style={styles.submitIcon}>{icon}</Text>
          <Text style={styles.submitText}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  sectionIcon: {
    fontSize: typography.sizes.xxl,
  },
  sectionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: typography.sizes.lg,
    color: colors.primary,
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
  textArea: {
    height: 72,
    paddingTop: 11,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: 14,
    marginTop: spacing.sm,
  },
  submitPressed: {
    opacity: 0.85,
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
});
