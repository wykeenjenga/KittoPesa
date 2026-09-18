import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthInput from '../../components/AuthInput';
import GradientButton from '../../components/GradientButton';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { login, status, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    try {
      await login(email, password);
    } catch {
      // error already captured in context
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Log in to continue to KittoPesa.
        </Text>

        <AuthInput
          label="Email"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            clearError();
          }}
          placeholder="you@example.com"
          keyboardType="email-address"
        />
        <AuthInput
          label="Password"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            clearError();
          }}
          placeholder="••••••••"
          secureTextEntry
        />

        {error && <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>}

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={[styles.link, { color: colors.accent }]}>Forgot password?</Text>
        </TouchableOpacity>

        <GradientButton
          label="Log in"
          variant="neutral"
          onPress={submit}
          loading={status === 'loading'}
          style={styles.submitButton}
        />

        <View style={styles.footerRow}>
          <Text style={{ color: colors.textMuted }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={[styles.link, { color: colors.accent }]}>Sign up</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Demo login — any email + a password of 4+ characters will work.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  back: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 24,
  },
  error: {
    fontSize: 13,
    marginBottom: 8,
  },
  link: {
    fontWeight: '700',
    fontSize: 13,
  },
  submitButton: {
    marginTop: 18,
    marginBottom: 20,
    width: '100%',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  hint: {
    fontSize: 11,
    textAlign: 'center',
  },
});
