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

// Neutral chrome, orange used only as an accent (buttons, icons, badges) —
// not tinted into the background, borders, or muted text.
export const lightTheme: ThemeColors = {
  background: '#f6f7f8',
  backgroundGradient: ['#f6f7f8', '#f6f7f8'],
  surface: '#ffffff',
  surfaceAlt: '#f1f2f4',
  text: '#111111',
  textMuted: '#7a8087',
  border: '#eaebee',
  accent: '#ff7a1a',
  accentSoft: '#fff0e4',
  danger: '#e5484d',
  dangerSoft: '#fdecec',
  primaryButtonBg: '#111111',
  primaryButtonText: '#ffffff',
  primaryGradient: ['#ff9a44', '#ff6a00'],
  neutralGradient: ['#26282e', '#0d0e10'],
  shadowOpacity: 0.1,
  statusBar: 'dark',
};

export const darkTheme: ThemeColors = {
  background: '#0d0e10',
  backgroundGradient: ['#0d0e10', '#0d0e10'],
  surface: '#1a1b1e',
  surfaceAlt: '#232427',
  text: '#f5f5f7',
  textMuted: '#93989f',
  border: '#2c2d31',
  accent: '#ff8c3d',
  accentSoft: '#3a2313',
  danger: '#ff6b6f',
  dangerSoft: '#3a1f20',
  primaryButtonBg: '#f5f5f7',
  primaryButtonText: '#111111',
  primaryGradient: ['#ff9a44', '#ff6a00'],
  neutralGradient: ['#3a3d45', '#1c1e23'],
  shadowOpacity: 0.4,
  statusBar: 'light',
};
