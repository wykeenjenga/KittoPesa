import { LinearGradient } from 'expo-linear-gradient';
import { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

/** Subtle gradient page background — used in place of a flat backgroundColor. */
export default function ScreenBackground({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <LinearGradient colors={colors.backgroundGradient} style={[{ flex: 1 }, style]}>
      {children}
    </LinearGradient>
  );
}
