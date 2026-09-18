export type ThemeColors = {
  background: string;
  backgroundGradient: [string, string];
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  accentSoft: string;
  danger: string;
  dangerSoft: string;
  primaryButtonBg: string;
  primaryButtonText: string;
  primaryGradient: [string, string];
  neutralGradient: [string, string];
  shadowOpacity: number;
  statusBar: 'light' | 'dark';
};

export const lightTheme: ThemeColors = {
  background: '#f3f5fa',
  backgroundGradient: ['#f7f9fd', '#e9edf5'],
  surface: '#ffffff',
  surfaceAlt: '#f1f3f7',
  text: '#111111',
  textMuted: '#7d8493',
  border: '#e9ebf0',
  accent: '#0f9d58',
  accentSoft: '#e5f8ee',
  danger: '#e5484d',
  dangerSoft: '#fdecec',
  primaryButtonBg: '#111111',
  primaryButtonText: '#ffffff',
  primaryGradient: ['#17b978', '#0c8a4f'],
  neutralGradient: ['#26282e', '#0d0e10'],
  shadowOpacity: 0.1,
  statusBar: 'dark',
};

export const darkTheme: ThemeColors = {
  background: '#0c0d10',
  backgroundGradient: ['#16181d', '#08090b'],
  surface: '#1b1d22',
  surfaceAlt: '#25272d',
  text: '#f5f5f7',
  textMuted: '#9299a6',
  border: '#2e3138',
  accent: '#27d181',
  accentSoft: '#123524',
  danger: '#ff6b6f',
  dangerSoft: '#3a1f20',
  primaryButtonBg: '#f5f5f7',
  primaryButtonText: '#111111',
  primaryGradient: ['#22c274', '#0e8f56'],
  neutralGradient: ['#3a3d45', '#1c1e23'],
  shadowOpacity: 0.4,
  statusBar: 'light',
};
