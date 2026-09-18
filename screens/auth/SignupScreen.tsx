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

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { signup, status, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = async () => {
    setLocalError(null);
    if (password !== confirm) {
      setLocalError('Passwords do not match.');
      return;
    }
    try {
      await signup(name, email, password);
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

        <Text style={[styles.title, { color: colors.text }]}>Create your account</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Join KittoPesa in under a minute.
        </Text>

        <AuthInput label="Full name" value={name} onChangeText={setName} placeholder="Jane Doe" />
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
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          secureTextEntry
        />
        <AuthInput
          label="Confirm password"
          value={confirm}
          onChangeText={setConfirm}
          placeholder="••••••••"
          secureTextEntry
        />

        {(localError || error) && (
          <Text style={[styles.error, { color: colors.danger }]}>{localError ?? error}</Text>
        )}

        <GradientButton
          label="Create account"
          variant="neutral"
          onPress={submit}
          loading={status === 'loading'}
          style={styles.submitButton}
        />

        <View style={styles.footerRow}>
          <Text style={{ color: colors.textMuted }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.link, { color: colors.accent }]}>Log in</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Demo signup — no real account is created anywhere.
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
    marginTop: 10,
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
