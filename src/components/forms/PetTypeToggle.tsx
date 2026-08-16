import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PetType } from '../../types';
import { PET_TYPE_OPTIONS } from '../../utils/registration';
import { borderRadius, colors, spacing, typography } from '../../utils/theme';

interface PetTypeToggleProps {
  value: PetType;
  onChange: (type: PetType) => void;
}

export function PetTypeToggle({ value, onChange }: PetTypeToggleProps) {
  return (
    <View style={styles.row}>
      {PET_TYPE_OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <Pressable
            key={option.value}
            style={[styles.btn, selected && styles.btnSelected]}
            onPress={() => onChange(option.value)}
          >
            <Text style={styles.emoji}>{option.emoji}</Text>
            <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    backgroundColor: colors.cream,
  },
  btnSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  emoji: {
    fontSize: typography.sizes.lg,
  },
  label: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: typography.sizes.base,
    color: colors.text,
  },
  labelSelected: {
    color: colors.primary,
  },
});
