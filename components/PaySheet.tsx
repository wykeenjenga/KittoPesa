import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import type { PaymentMethod, TransactionKind, WalletCard } from '../types';
import GradientButton from './GradientButton';
import { Bouncy, PopIn } from './Motion';
import WalletCardView from './WalletCardView';

type Stage = 'form' | 'processing' | 'success';

export default function PaySheet({
  visible,
  cards,
  initialMethod,
  initialMerchant,
  initialAmount,
  kind = 'pay',
  onClose,
  onComplete,
}: {
  visible: boolean;
  cards: WalletCard[];
  initialMethod: PaymentMethod;
  initialMerchant?: string;
  initialAmount?: number;
  kind?: TransactionKind;
  onClose: () => void;
  onComplete: (merchant: string, amount: number, method: PaymentMethod) => void;
}) {
  const { colors } = useTheme();
  const [method, setMethod] = useState<PaymentMethod>(initialMethod);
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('0712 345 678');
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id);
  const [stage, setStage] = useState<Stage>('form');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSend = kind === 'send';

  useEffect(() => {
    if (visible) {
      setMethod(initialMethod);
      setStage('form');
      setMerchant(initialMerchant ?? '');
      setAmount(initialAmount ? String(initialAmount) : '');
      setSelectedCardId(cards[0]?.id);
    }
  }, [visible, initialMethod, initialMerchant, initialAmount]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const numericAmount = parseFloat(amount) || 0;
  const canPay =
    merchant.trim().length > 0 &&
    numericAmount > 0 &&
    (method !== 'card' || !!selectedCardId);

  const startPay = () => {
    if (!canPay) return;
    setStage('processing');
    timer.current = setTimeout(() => {
      setStage('success');
    }, 1800);
  };

  const finish = () => {
    onComplete(merchant.trim(), numericAmount, method);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          {stage === 'form' && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.title, { color: colors.text }]}>
                {isSend ? 'Send money' : 'Pay for goods'}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Demo checkout — nothing is actually charged.
              </Text>

              <Text style={[styles.label, { color: colors.textMuted }]}>
                {isSend ? 'Recipient' : 'Merchant / till name'}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border },
                ]}
                placeholder={isSend ? 'e.g. Jane Doe' : 'e.g. Kitto Cafe'}
                placeholderTextColor={colors.textMuted}
                value={merchant}
                onChangeText={setMerchant}
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

              <Text style={[styles.label, { color: colors.textMuted }]}>Pay with</Text>
              <View style={styles.methodRow}>
                <MethodChip
                  active={method === 'mpesa'}
                  label="M-Pesa"
                  icon={
                    <Ionicons
                      name="phone-portrait-outline"
                      size={18}
                      color={method === 'mpesa' ? '#fff' : '#0f9d58'}
                    />
                  }
                  color="#0f9d58"
                  onPress={() => setMethod('mpesa')}
                />
                <MethodChip
                  active={method === 'card'}
                  label="Card"
                  icon={
                    <Ionicons
                      name="card-outline"
                      size={18}
                      color={method === 'card' ? '#fff' : '#3b5bdb'}
                    />
                  }
                  color="#3b5bdb"
                  onPress={() => setMethod('card')}
                />
                <MethodChip
                  active={method === 'applepay'}
                  label="Apple Pay"
                  icon={
                    <Ionicons
                      name="logo-apple"
                      size={18}
                      color={method === 'applepay' ? '#fff' : colors.text}
                    />
                  }
                  color={colors.text}
                  onPress={() => setMethod('applepay')}
                />
              </View>

              {method === 'mpesa' && (
                <View style={styles.methodDetail}>
                  <Text style={[styles.label, { color: colors.textMuted }]}>
                    M-Pesa phone number
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.surfaceAlt,
                        color: colors.text,
                        borderColor: colors.border,
                      },
                    ]}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                  <Text style={[styles.hint, { color: colors.textMuted }]}>
                    You'll get a prompt on your phone to enter your M-Pesa PIN.
                  </Text>
                </View>
              )}

              {method === 'card' && (
                <View style={styles.methodDetail}>
                  {cards.length === 0 ? (
                    <Text style={[styles.hint, { color: colors.textMuted }]}>
                      No cards yet — add one from the wallet screen.
                    </Text>
                  ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {cards.map((c) => (
                        <TouchableOpacity
                          key={c.id}
                          onPress={() => setSelectedCardId(c.id)}
                          style={[
                            styles.miniCardWrap,
                            selectedCardId === c.id && styles.miniCardSelected,
                          ]}
                        >
                          <WalletCardView card={c} />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}

              {method === 'applepay' && (
                <View style={styles.methodDetail}>
                  <Text style={[styles.hint, { color: colors.textMuted }]}>
                    Confirm with Face ID to pay instantly.
                  </Text>
                </View>
              )}

              <GradientButton
                label={
                  method === 'applepay'
                    ? 'Pay'
                    : `${isSend ? 'Send' : 'Pay'}${
                        numericAmount > 0 ? ` KES ${numericAmount.toLocaleString()}` : ''
                      }`
                }
                icon={
                  method === 'applepay' ? (
                    <Ionicons name="logo-apple" size={18} color="#fff" />
                  ) : undefined
                }
                variant="accent"
                onPress={startPay}
                disabled={!canPay}
                style={styles.payButton}
              />

              <TouchableOpacity onPress={onClose} style={styles.cancelLink}>
                <Text style={[styles.cancelLinkText, { color: colors.textMuted }]}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {stage === 'processing' && (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={[styles.processingText, { color: colors.textMuted }]}>
                {method === 'mpesa'
                  ? 'Check your phone to enter your M-Pesa PIN...'
                  : method === 'applepay'
                  ? 'Confirming with Face ID...'
                  : 'Processing card payment...'}
              </Text>
            </View>
          )}

          {stage === 'success' && (
            <View style={styles.centered}>
              <PopIn style={[styles.successCircle, { backgroundColor: colors.accent }]}>
                <Ionicons name="checkmark" size={40} color="#fff" />
              </PopIn>
              <Text style={[styles.successTitle, { color: colors.text }]}>
                {isSend ? 'Money sent' : 'Payment successful'}
              </Text>
              <Text style={[styles.successAmount, { color: colors.text }]}>
                KES {numericAmount.toLocaleString()}
              </Text>
              <Text style={[styles.successMerchant, { color: colors.textMuted }]}>
                to {merchant}
              </Text>
              <GradientButton
                label="Done"
                variant="accent"
                onPress={finish}
                style={styles.doneButton}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

function MethodChip({
  active,
  label,
  icon,
  color,
  onPress,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, { borderColor: color }, active && { backgroundColor: color }]}
    >
      {icon}
      <Text style={[styles.chipText, { color: active ? '#fff' : color }]}>{label}</Text>
    </TouchableOpacity>
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
    maxHeight: '88%',
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
  methodRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  methodDetail: {
    marginTop: 14,
  },
  hint: {
    fontSize: 12,
    marginTop: 6,
  },
  miniCardWrap: {
    marginRight: 4,
    opacity: 0.5,
    borderRadius: 20,
  },
  miniCardSelected: {
    opacity: 1,
  },
  payButton: {
    marginTop: 24,
  },
  cancelLink: {
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 4,
  },
  cancelLinkText: {
    fontWeight: '600',
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  processingText: {
    marginTop: 18,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  successAmount: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 6,
  },
  successMerchant: {
    fontSize: 14,
    marginTop: 2,
  },
  doneButton: {
    marginTop: 24,
    width: '100%',
  },
});
