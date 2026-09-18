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
import type { PaymentMethod, WalletCard } from '../types';
import { Bouncy, PopIn } from './Motion';
import WalletCardView from './WalletCardView';

type Stage = 'form' | 'processing' | 'success';

export default function PaySheet({
  visible,
  cards,
  initialMethod,
  initialMerchant,
  initialAmount,
  onClose,
  onComplete,
}: {
  visible: boolean;
  cards: WalletCard[];
  initialMethod: PaymentMethod;
  initialMerchant?: string;
  initialAmount?: number;
  onClose: () => void;
  onComplete: (merchant: string, amount: number, method: PaymentMethod) => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>(initialMethod);
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('0712 345 678');
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id);
  const [stage, setStage] = useState<Stage>('form');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {stage === 'form' && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Pay for goods</Text>
              <Text style={styles.subtitle}>Demo checkout — nothing is actually charged.</Text>

              <Text style={styles.label}>Merchant / till name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Kitto Cafe"
                value={merchant}
                onChangeText={setMerchant}
              />

              <Text style={styles.label}>Amount (KES)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />

              <Text style={styles.label}>Pay with</Text>
              <View style={styles.methodRow}>
                <MethodChip
                  active={method === 'mpesa'}
                  label="M-Pesa"
                  icon={<Ionicons name="phone-portrait-outline" size={18} color={method === 'mpesa' ? '#fff' : '#0f9d58'} />}
                  color="#0f9d58"
                  onPress={() => setMethod('mpesa')}
                />
                <MethodChip
                  active={method === 'card'}
                  label="Card"
                  icon={<Ionicons name="card-outline" size={18} color={method === 'card' ? '#fff' : '#3b5bdb'} />}
                  color="#3b5bdb"
                  onPress={() => setMethod('card')}
                />
                <MethodChip
                  active={method === 'applepay'}
                  label="Apple Pay"
                  icon={<Ionicons name="logo-apple" size={18} color={method === 'applepay' ? '#fff' : '#111'} />}
                  color="#111"
                  onPress={() => setMethod('applepay')}
                />
              </View>

              {method === 'mpesa' && (
                <View style={styles.methodDetail}>
                  <Text style={styles.label}>M-Pesa phone number</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                  <Text style={styles.hint}>
                    You'll get a prompt on your phone to enter your M-Pesa PIN.
                  </Text>
                </View>
              )}

              {method === 'card' && (
                <View style={styles.methodDetail}>
                  {cards.length === 0 ? (
                    <Text style={styles.hint}>No cards yet — add one from the wallet screen.</Text>
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
                  <Text style={styles.hint}>
                    Confirm with Face ID to pay instantly.
                  </Text>
                </View>
              )}

              <Bouncy
                style={[styles.payButton, !canPay && styles.buttonDisabled]}
                onPress={startPay}
                disabled={!canPay}
              >
                {method === 'applepay' ? (
                  <View style={styles.applePayContent}>
                    <Ionicons name="logo-apple" size={18} color="#fff" />
                    <Text style={styles.applePayText}> Pay</Text>
                  </View>
                ) : (
                  <Text style={styles.payText}>
                    Pay {numericAmount > 0 ? `KES ${numericAmount.toLocaleString()}` : ''}
                  </Text>
                )}
              </Bouncy>

              <TouchableOpacity onPress={onClose} style={styles.cancelLink}>
                <Text style={styles.cancelLinkText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {stage === 'processing' && (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#0f9d58" />
              <Text style={styles.processingText}>
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
              <PopIn style={styles.successCircle}>
                <Ionicons name="checkmark" size={40} color="#fff" />
              </PopIn>
              <Text style={styles.successTitle}>Payment successful</Text>
              <Text style={styles.successAmount}>KES {numericAmount.toLocaleString()}</Text>
              <Text style={styles.successMerchant}>to {merchant}</Text>
              <Bouncy style={styles.doneButton} onPress={finish}>
                <Text style={styles.doneText}>Done</Text>
              </Bouncy>
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
      style={[
        styles.chip,
        { borderColor: color },
        active && { backgroundColor: color },
      ]}
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '88%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#fafafa',
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
    color: '#888',
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
    backgroundColor: '#111',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  applePayContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applePayText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  payText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelLink: {
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 4,
  },
  cancelLinkText: {
    color: '#999',
    fontWeight: '600',
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  processingText: {
    marginTop: 18,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0f9d58',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginTop: 16,
  },
  successAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#222',
    marginTop: 6,
  },
  successMerchant: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  doneButton: {
    marginTop: 24,
    backgroundColor: '#f1f1f1',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  doneText: {
    fontWeight: '700',
    color: '#333',
  },
});
