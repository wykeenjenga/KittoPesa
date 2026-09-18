import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Bouncy } from '../components/Motion';
import ScreenHeader from '../components/ScreenHeader';
import { useRates } from '../contexts/RatesContext';
import type { HomeStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'CurrencyConverter'>;

type Currency = 'KES' | 'USD' | 'EUR';

export default function CurrencyConverterScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { rates, loading, reload } = useRates();
  const [amount, setAmount] = useState('1000');
  const [from, setFrom] = useState<Currency>('KES');
  const [to, setTo] = useState<Currency>('USD');

  const rateToKes: Record<Currency, number> = useMemo(
    () => ({
      KES: 1,
      USD: rates?.usdToKes ?? 129.5,
      EUR: rates ? rates.usdToKes / rates.usdToEur : 148.8,
    }),
    [rates],
  );

  const numericAmount = parseFloat(amount) || 0;
  const converted = (numericAmount * rateToKes[from]) / rateToKes[to];

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Currency converter" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textMuted }]}>Amount</Text>
          <TextInput
            style={[styles.amountInput, { color: colors.text }]}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          <View style={styles.currencyRow}>
            {(['KES', 'USD', 'EUR'] as Currency[]).map((c) => (
              <CurrencyChip key={c} label={c} active={from === c} onPress={() => setFrom(c)} />
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.swapButton} onPress={swap}>
          <View style={[styles.swapCircle, { backgroundColor: colors.primaryButtonBg }]}>
            <Ionicons name="swap-vertical" size={18} color={colors.primaryButtonText} />
          </View>
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.textMuted }]}>Converted</Text>
          <Text style={[styles.amountInput, { color: colors.accent }]}>
            {converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </Text>
          <View style={styles.currencyRow}>
            {(['KES', 'USD', 'EUR'] as Currency[]).map((c) => (
              <CurrencyChip key={c} label={c} active={to === c} onPress={() => setTo(c)} />
            ))}
          </View>
        </View>

        <View style={styles.rateInfoRow}>
          {loading ? (
            <ActivityIndicator color={colors.accent} />
          ) : (
            <Text style={[styles.rateInfo, { color: colors.textMuted }]}>
              1 {from} = {(rateToKes[from] / rateToKes[to]).toFixed(4)} {to}
              {rates && !rates.live ? ' (offline estimate)' : ''}
            </Text>
          )}
          <Bouncy onPress={reload}>
            <Ionicons name="refresh" size={16} color={colors.accent} />
          </Bouncy>
        </View>
      </ScrollView>
    </View>
  );
}

function CurrencyChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        { borderColor: colors.border },
        active && { backgroundColor: colors.primaryButtonBg, borderColor: colors.primaryButtonBg },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          { color: active ? colors.primaryButtonText : colors.text },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 18,
    padding: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  amountInput: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 14,
    padding: 0,
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: {
    fontWeight: '700',
    fontSize: 13,
  },
  swapButton: {
    alignItems: 'center',
    marginVertical: 12,
  },
  swapCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateInfoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  rateInfo: {
    fontSize: 12,
  },
});
