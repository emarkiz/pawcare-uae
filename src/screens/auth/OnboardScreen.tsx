import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import type { AuthStackParamList } from '../../types';
import { borderRadius, colors, spacing, typography } from '../../utils/theme';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboard'>;

const PET_EMOJIS = ['🐕', '🐱', '🐶', '😺', '🦮'];

export default function OnboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [floatAnim]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <LinearGradient
      colors={[colors.primary, colors.dark]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.gradient}
    >
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.hero}>
          <Animated.Text style={[styles.logo, { transform: [{ translateY }] }]}>
            🐾
          </Animated.Text>
          <Text style={styles.title}>PawCare UAE</Text>
          <Text style={styles.tagline}>Your Pets Deserve the Best</Text>
          <View style={styles.emojiRow}>
            {PET_EMOJIS.map((emoji) => (
              <View key={emoji} style={styles.emojiBubble}>
                <Text style={styles.emoji}>{emoji}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
            onPress={() => navigation.navigate('RegisterPet')}
          >
            <Text style={styles.primaryBtnText}>Get Started 🐾</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.outlineBtn, pressed && styles.pressedOutline]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.outlineBtnText}>Log In / Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    paddingBottom: 44,
    paddingTop: 80,
  },
  hero: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 90,
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: typography.sizes.hero,
    fontWeight: typography.weights.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  tagline: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: typography.sizes.lg,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: typography.lineHeights.loose * typography.sizes.lg,
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.xxxl,
  },
  emojiRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  emojiBubble: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.overlay,
    borderWidth: 1.5,
    borderColor: colors.overlayBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
  },
  actions: {
    gap: spacing.md,
  },
  primaryBtn: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  outlineBtn: {
    borderRadius: borderRadius.full,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  outlineBtnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
  },
  pressed: {
    opacity: 0.85,
  },
  pressedOutline: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});
