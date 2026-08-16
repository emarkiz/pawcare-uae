import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { useToastStore } from '../store/useToastStore';
import { borderRadius, colors, typography } from '../utils/theme';

export function Toast() {
  const { message, visible } = useToastStore();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 20, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { opacity, transform: [{ translateY }] }]}
      pointerEvents="none"
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: colors.dark,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
    maxWidth: '90%',
    zIndex: 9999,
  },
  text: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    textAlign: 'center',
  },
});
