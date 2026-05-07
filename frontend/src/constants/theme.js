export const colors = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceMuted: '#F3F4F6',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  redDark: '#B91C1C',
  blueSoft: '#DBEAFE',
  purpleSoft: '#F3E8FF',
  cyanSoft: '#CFFAFE',
  greenSoft: '#DCFCE7',
  redSoft: '#FEF2F2',
  redBorder: '#FCA5A5',
  blueTextSoft: '#DBEAFE',
  blueSurface: '#EFF6FF',
  shadow: '#111827',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 10,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const typography = {
  h1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
  h2: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
  },
  h3: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  captionStrong: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
};

export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  floating: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
};

const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
};

export default theme;
