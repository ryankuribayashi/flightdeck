import { Platform } from 'react-native';

export const Colors = {
  bg: '#080B10',
  bgPanel: '#0D1117',
  bgCard: '#111820',
  bgElevated: '#161E2C',
  bgGlass: 'rgba(10, 13, 20, 0.88)',

  amber: '#F0A020',
  amberBright: '#FFB830',
  amberGlow: 'rgba(240, 160, 32, 0.28)',
  amberDim: 'rgba(240, 160, 32, 0.10)',
  amberStrong: 'rgba(240, 160, 32, 0.55)',

  cyan: '#00D4FF',
  cyanGlow: 'rgba(0, 212, 255, 0.22)',
  cyanDim: 'rgba(0, 212, 255, 0.08)',

  green: '#00FF88',
  greenGlow: 'rgba(0, 255, 136, 0.22)',

  red: '#FF4444',
  redGlow: 'rgba(255, 68, 68, 0.22)',
  redDim: 'rgba(255, 68, 68, 0.10)',

  blue: '#3B82F6',
  purple: '#8B5CF6',

  textPrimary: '#E2E8F4',
  textSecondary: '#7A8FA8',
  textMuted: '#3A4F63',
  textAmber: '#F0A020',
  textCyan: '#00D4FF',
  textGreen: '#00FF88',

  border: 'rgba(255,255,255,0.07)',
  borderAmber: 'rgba(240, 160, 32, 0.30)',
  borderCyan: 'rgba(0, 212, 255, 0.25)',

  navBg: '#060810',
  navBorder: 'rgba(240, 160, 32, 0.12)',

  ledOff: '#18222E',
  ledOn: '#F0A020',
};

export const Font = {
  mono: Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }) as string,
};

export const Space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const Radius = { sm: 4, md: 8, lg: 12, xl: 20, pill: 100 };
