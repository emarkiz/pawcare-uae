/**
 * PawCare — Jungle Fresh Design System
 * Pixel-perfect match to pawcare_app.html CSS variables
 *
 * Brand naming:
 *   displayName → in-app UI ("PawCare")
 *   storeName   → App Store / Play Store listing ("Pawcare")
 */

export const brand = {
  displayName: 'PawCare',
  storeName: 'Pawcare',
} as const;

export const colors = {
  // Primary palette
  primary: '#2D6A4F',
  primaryLight: '#3D8B62',
  primaryTint: '#E8F5EE',

  // Dark greens
  dark: '#1B4332',
  darkLight: '#2D6A4F',
  darkTint: '#DDEEE5',

  // Gold accent
  gold: '#D4A017',
  goldLight: '#E0B52A',
  goldTint: '#FDF5DC',

  // Surfaces
  cream: '#F9F5EC',
  background: '#EAF0E6',
  white: '#FFFFFF',

  // Text
  text: '#1A2E1C',
  muted: '#5A7A62',

  // Semantic
  danger: '#E05252',
  info: '#3A86C8',
  success: '#4CAF50',

  // Borders & overlays
  border: 'rgba(27, 67, 50, 0.14)',
  overlay: 'rgba(255, 255, 255, 0.2)',
  overlayBorder: 'rgba(255, 255, 255, 0.28)',

  // Gradients (start → end)
  heroGradient: ['#2D6A4F', '#1B4332'] as const,
  goldGradient: ['#D4A017', '#A07A10'] as const,
  adminGradient: ['#1B4332', '#0D2419'] as const,
  infoGradient: ['#3A86C8', '#1A5A9A'] as const,
  emergencyGradient: ['#C0392B', '#E74C3C'] as const,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const borderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 44,
  full: 9999,
} as const;

export const typography = {
  fonts: {
    body: 'Nunito',
    heading: 'Poppins',
  },
  sizes: {
    xs: 10,
    sm: 11,
    md: 12,
    base: 13,
    lg: 14,
    xl: 15,
    xxl: 16,
    h3: 16,
    h2: 20,
    h1: 23,
    hero: 28,
    display: 34,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.5,
    loose: 1.6,
  },
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  phone: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 28 },
    shadowOpacity: 0.32,
    shadowRadius: 72,
    elevation: 16,
  },
  serviceCard: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;

export const layout = {
  screenPadding: spacing.lg,
  cardPadding: spacing.lg,
  statusBarHeight: 44,
  bottomNavHeight: 72,
  maxContentWidth: 390,
} as const;

/** Service icon background variants matching .ic-p, .ic-g, .ic-d */
export const serviceIconVariants = {
  primary: { background: colors.primaryTint, color: colors.primary },
  gold: { background: colors.goldTint, color: colors.gold },
  dark: { background: colors.darkTint, color: colors.dark },
} as const;

/** Pill badge variants matching .pill-p, .pill-g, .pill-d, .pill-r */
export const pillVariants = {
  primary: { background: colors.primaryTint, color: colors.primary },
  gold: { background: colors.goldTint, color: colors.gold },
  dark: { background: colors.darkTint, color: colors.dark },
  danger: { background: '#FEEAEA', color: colors.danger },
} as const;

/** Booking status badge styles matching .sb-* classes */
export const bookingStatusVariants = {
  confirmed: { background: '#E8F5EE', color: colors.primary },
  completed: { background: colors.goldTint, color: colors.gold },
  pending: { background: '#FFF3E0', color: '#E67E00' },
  cancelled: { background: '#FEEAEA', color: colors.danger },
  active: { background: colors.primaryTint, color: colors.primary },
} as const;

export const theme = {
  brand,
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  layout,
  serviceIconVariants,
  pillVariants,
  bookingStatusVariants,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;

export default theme;
