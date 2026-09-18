import { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import GradientButton from './GradientButton';
import { useTheme } from '../theme/ThemeContext';
import type { CardBrand, WalletCard } from '../types';

const GRADIENTS: [string, string][] = [
  ['#2b5876', '#4e4376'],
  ['#11998e', '#38ef7d'],
  ['#833ab4', '#fd1d1d'],
  ['#134e5e', '#71b280'],
];

function formatCardNumber(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function AddCardSheet({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (card: WalletCard) => void;
}) {
  const { colors } = useTheme();
  const [number, setNumber] = useState('');
  const [holder, setHolder] = useState('');
  const [expiry, setExpiry] = useState('');

  const digitsOnly = number.replace(/\D/g, '');
  const isValid = digitsOnly.length === 16 && holder.trim().length > 1 && expiry.length === 5;

  const reset = () => {
    setNumber('');
    setHolder('');
    setExpiry('');
  };

  const submit = () => {
    if (!isValid) return;
    const brand: CardBrand = digitsOnly.startsWith('4') ? 'visa' : 'mastercard';
    const cardColors = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
    onAdd({
      id: Date.now().toString(),
      brand,
      last4: digitsOnly.slice(-4),
      holder: holder.trim().toUpperCase(),
      expiry,
      colors: cardColors,
    });
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Text style={[styles.title, { color: colors.text }]}>Add a card</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Demo only — this card is stored on this device and never sent anywhere.
          </Text>

          <Text style={[styles.label, { color: colors.textMuted }]}>Card number</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            value={number}
            onChangeText={(t) => setNumber(formatCardNumber(t))}
            maxLength={19}
          />

          <Text style={[styles.label, { color: colors.textMuted }]}>Cardholder name</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="JANE DOE"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="characters"
            value={holder}
            onChangeText={setHolder}
          />

          <Text style={[styles.label, { color: colors.textMuted }]}>Expiry (MM/YY)</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="09/29"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            value={expiry}
            onChangeText={(t) => setExpiry(formatExpiry(t))}
            maxLength={5}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.surfaceAlt }]}
              onPress={() => {
                reset();
                onClose();
              }}
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <GradientButton
              label="Add card"
              variant="accent"
              onPress={submit}
              disabled={!isValid}
              style={styles.gradientButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 22,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  gradientButton: {
    flex: 1,
  },
  cancelText: {
    fontWeight: '600',
  },
});
