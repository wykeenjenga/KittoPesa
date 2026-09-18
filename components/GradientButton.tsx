import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Bouncy } from './Motion';

/**
 * A premium-feeling primary CTA: gradient fill + shadow + press animation.
 * `variant="accent"` is for money actions (Pay, Buy, Checkout, Send).
 * `variant="neutral"` is for general primary actions (Continue, Save, Log in).
 */
export default function GradientButton({
  label,
  onPress,
  disabled,
  loading,
  variant = 'accent',
  icon,
  radius = 16,
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'accent' | 'neutral';
  icon?: React.ReactNode;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const gradient = variant === 'accent' ? colors.primaryGradient : colors.neutralGradient;

  return (
    <Bouncy
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.shadowWrap,
        {
          borderRadius: radius,
          shadowColor: gradient[1],
          shadowOpacity: disabled ? 0 : colors.shadowOpacity,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: radius }]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            {icon}
            <Text style={[styles.label, icon ? { marginLeft: 8 } : null]}>{label}</Text>
          </>
        )}
      </LinearGradient>
    </Bouncy>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 6,
  },
  disabled: {
    opacity: 0.45,
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    fontWeight: '700',
    fontSize: 15,
    color: '#ffffff',
  },
});
