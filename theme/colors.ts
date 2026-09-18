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
  background: '#faf5f0',
  backgroundGradient: ['#fff6ee', '#fce4d2'],
  surface: '#ffffff',
  surfaceAlt: '#fbeee2',
  text: '#111111',
  textMuted: '#8a7d73',
  border: '#f1e2d5',
  accent: '#ff7a1a',
  accentSoft: '#ffead9',
  danger: '#e5484d',
  dangerSoft: '#fdecec',
  primaryButtonBg: '#111111',
  primaryButtonText: '#ffffff',
  primaryGradient: ['#ff9a44', '#ff6a00'],
  neutralGradient: ['#26282e', '#0d0e10'],
  shadowOpacity: 0.14,
  statusBar: 'dark',
};

export const darkTheme: ThemeColors = {
  background: '#120d09',
  backgroundGradient: ['#1c130c', '#0a0705'],
  surface: '#221912',
  surfaceAlt: '#2c2117',
  text: '#f5f5f7',
  textMuted: '#a8968a',
  border: '#3a2c20',
  accent: '#ff8c3d',
  accentSoft: '#3a2313',
  danger: '#ff6b6f',
  dangerSoft: '#3a1f20',
  primaryButtonBg: '#f5f5f7',
  primaryButtonText: '#111111',
  primaryGradient: ['#ff9a44', '#ff6a00'],
  neutralGradient: ['#3a3d45', '#1c1e23'],
  shadowOpacity: 0.45,
  statusBar: 'light',
};
