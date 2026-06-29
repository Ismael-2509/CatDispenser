export const WearColors = {
  background: '#0F1115',
  surface: '#1A1D24',
  surfaceElevated: '#22262F',
  primary: '#4ADE80',
  secondary: '#8B5CF6',
  info: '#38BDF8',
  danger: '#F87171',
  warning: '#FBBF24',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  border: '#2D3340',
  overlay: 'rgba(15, 17, 21, 0.85)',
};

export const WearTypography = {
  hero: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 14, fontWeight: '600' },
  body: { fontSize: 13, fontWeight: '500' },
  caption: { fontSize: 11, fontWeight: '500' },
  value: { fontSize: 28, fontWeight: '800' },
  button: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
};

export const WearSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

export const WearRadius = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  full: 999,
};

export const WearShadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  glow: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  }),
};

export const GRAM_OPTIONS = [5, 10, 20, 30, 40, 50, 60];

export const FEEDER_NAME = 'Dispensador Mascotas';
