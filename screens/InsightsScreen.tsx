import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import { METHOD_COLOR } from '../constants';
import { useWalletCtx } from '../contexts/WalletContext';
import type { WalletStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { METHOD_LABEL, PaymentMethod } from '../types';

type Props = NativeStackScreenProps<WalletStackParamList, 'Insights'>;

export default function InsightsScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { transactions } = useWalletCtx();

  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);

  const byMethod = useMemo(() => {
    const map = new Map<PaymentMethod, number>();
    transactions.forEach((t) => map.set(t.method, (map.get(t.method) ?? 0) + t.amount));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    transactions.forEach((t) => {
      const key = t.category ?? 'Other';
      map.set(key, (map.get(key) ?? 0) + t.amount);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const maxMethod = Math.max(1, ...byMethod.map(([, v]) => v));
  const maxCategory = Math.max(1, ...byCategory.map(([, v]) => v));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Spending insights" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.totalCard, { backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>Total spent (this session)</Text>
          <Text style={{ color: colors.text, fontSize: 26, fontWeight: '800', marginTop: 4 }}>
            KES {totalSpent.toLocaleString()}
          </Text>
        </View>

        {transactions.length === 0 ? (
          <Text style={{ color: colors.textMuted, fontStyle: 'italic' }}>
            Make a few payments to see your spending breakdown here.
          </Text>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>By payment method</Text>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              {byMethod.map(([method, value]) => (
                <View key={method} style={styles.barRow}>
                  <Text style={[styles.barLabel, { color: colors.text }]}>
                    {METHOD_LABEL[method]}
                  </Text>
                  <View style={[styles.barTrack, { backgroundColor: colors.surfaceAlt }]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${(value / maxMethod) * 100}%`,
                          backgroundColor: METHOD_COLOR[method],
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barValue, { color: colors.textMuted }]}>
                    KES {value.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>By category</Text>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              {byCategory.map(([category, value]) => (
                <View key={category} style={styles.barRow}>
                  <Text style={[styles.barLabel, { color: colors.text }]} numberOfLines={1}>
                    {category}
                  </Text>
                  <View style={[styles.barTrack, { backgroundColor: colors.surfaceAlt }]}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${(value / maxCategory) * 100}%`, backgroundColor: colors.accent },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barValue, { color: colors.textMuted }]}>
                    KES {value.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 40 },
  totalCard: { borderRadius: 18, padding: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  card: { borderRadius: 16, padding: 16, marginBottom: 24 },
  barRow: { marginBottom: 14 },
  barLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  barTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barValue: { fontSize: 11, marginTop: 4 },
});
