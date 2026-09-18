import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import GradientButton from '../components/GradientButton';
import ScreenHeader from '../components/ScreenHeader';
import { useWalletCtx } from '../contexts/WalletContext';
import type { HomeStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'SendMoney'>;

export default function SendMoneyScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { openPay } = useWalletCtx();
  const [recipient, setRecipient] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');

  const numericAmount = parseFloat(amount) || 0;
  const canContinue = recipient.trim().length > 1 && numericAmount > 0;

  const submit = () => {
    if (!canContinue) return;
    openPay({
      method: 'mpesa',
      merchant: recipient.trim(),
      amount: numericAmount,
      kind: 'send',
    });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Send money" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { color: colors.textMuted }]}>Recipient name</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border },
          ]}
          placeholder="e.g. John Mwangi"
          placeholderTextColor={colors.textMuted}
          value={recipient}
          onChangeText={setRecipient}
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>Phone number (optional)</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border },
          ]}
          placeholder="07XX XXX XXX"
          placeholderTextColor={colors.textMuted}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>Amount (KES)</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border },
          ]}
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <GradientButton
          label="Continue"
          variant="accent"
          onPress={submit}
          disabled={!canContinue}
          style={styles.button}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  button: { marginTop: 26, width: '100%' },
});
