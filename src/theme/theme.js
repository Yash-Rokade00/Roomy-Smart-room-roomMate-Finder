import { moderateScale, scaleFont } from '../utils/responsive';

export const COLORS = {
  primary: '#f7a10c',
  primaryDark: '#ca8a04',
  primaryLight: '#fef3c7',
  secondary: '#400000',
  secondaryLight: '#7a2c01',
  background: '#fafad2',
  surface: '#ffffff',
  text: '#1f2937',
  textLight: '#4b5563',
  textMuted: '#9ca3af',
  border: '#e5e7eb',
  borderAccent: '#FFDF00',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  white: '#ffffff',
  black: '#000000',
  grey: '#6b7280',
  greyLight: '#f3f4f6',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const RADIUS = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(20),
  xl: moderateScale(30),
  round: 9999,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: scaleFont(32),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  h2: {
    fontSize: scaleFont(24),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  h3: {
    fontSize: scaleFont(20),
    fontWeight: '600',
    color: COLORS.text,
  },
  body: {
    fontSize: scaleFont(16),
    color: COLORS.text,
  },
  bodyLight: {
    fontSize: scaleFont(16),
    color: COLORS.textLight,
  },
  caption: {
    fontSize: scaleFont(12),
    color: COLORS.textMuted,
  },
  button: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    color: COLORS.white,
  },
};
