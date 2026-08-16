import { Platform, StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { FormLabel } from './FormFields';
import { borderRadius, colors, spacing, typography } from '../../utils/theme';

interface FormPickerProps<T extends string> {
  label: string;
  value: T;
  options: { label: string; value: T }[];
  onValueChange: (value: T) => void;
}

export function FormPicker<T extends string>({
  label,
  value,
  options,
  onValueChange,
}: FormPickerProps<T>) {
  return (
    <View style={styles.wrap}>
      <FormLabel>{label}</FormLabel>
      <View style={styles.pickerShell}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onValueChange(itemValue as T)}
          style={styles.picker}
          dropdownIconColor={colors.primary}
          itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined}
        >
          {options.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  pickerShell: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.cream,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 120 : 48,
    color: colors.text,
  },
  pickerItem: {
    fontFamily: 'Nunito_400Regular',
    fontSize: typography.sizes.base,
  },
});
