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
} from 'react-native';
import AuthInput from '../../components/AuthInput';
import GradientButton from '../../components/GradientButton';
import { PopIn } from '../../components/Motion';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { resetPassword, status, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async () => {
    try {
      await resetPassword(email);
      setSent(true);
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

        {!sent ? (
          <>
            <Text style={[styles.title, { color: colors.text }]}>Reset your password</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Enter your email and we'll send a reset link.
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

            {error && <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>}

            <GradientButton
              label="Send reset link"
              variant="neutral"
              onPress={submit}
              loading={status === 'loading'}
              style={styles.submitButton}
            />
          </>
        ) : (
          <PopIn style={styles.successWrap}>
            <>
              <Ionicons name="mail-outline" size={48} color={colors.accent} />
              <Text style={[styles.title, { color: colors.text, marginTop: 16 }]}>
                Check your email
              </Text>
              <Text style={[styles.subtitle, { color: colors.textMuted, textAlign: 'center' }]}>
                If an account exists for {email}, a reset link has been sent.
              </Text>
              <GradientButton
                label="Back to login"
                variant="neutral"
                onPress={() => navigation.navigate('Login')}
                style={styles.submitButton}
              />
            </>
          </PopIn>
        )}
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
  submitButton: {
    marginTop: 10,
    width: '100%',
  },
  successWrap: {
    alignItems: 'center',
    paddingTop: 40,
    width: '100%',
  },
});
