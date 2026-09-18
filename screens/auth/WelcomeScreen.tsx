import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { Bouncy } from '../../components/Motion';
import GradientButton from '../../components/GradientButton';
import { useTheme } from '../../theme/ThemeContext';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  const { colors } = useTheme();
  return (
    <LinearGradient colors={colors.neutralGradient} style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>🐾💰</Text>
        <Text style={styles.title}>KittoPesa</Text>
        <Text style={styles.tagline}>Your money, made simple.</Text>
      </View>

      <View style={styles.actions}>
        <GradientButton
          label="Create account"
          variant="accent"
          onPress={() => navigation.navigate('Signup')}
          radius={28}
        />
        <Bouncy style={styles.secondaryButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.secondaryText}>Log in</Text>
        </Bouncy>
      </View>

      <Text style={styles.footer}>Demo app — no real accounts or money are involved.</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 28,
    paddingTop: 100,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#ffffff',
  },
  tagline: {
    fontSize: 14,
    marginTop: 6,
    color: 'rgba(255,255,255,0.7)',
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    borderRadius: 28,
  },
  secondaryButton: {
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  secondaryText: {
    fontWeight: '700',
    fontSize: 15,
    color: '#ffffff',
  },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
  },
});
