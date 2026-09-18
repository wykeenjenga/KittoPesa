import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import type { ProfileStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<ProfileStackParamList, 'LinkedAccounts'>;

const SERVICES = [
  { id: 'mpesa', name: 'M-Pesa', icon: 'phone-portrait-outline' as const, connected: true },
  { id: 'bank', name: 'Equity Bank', icon: 'business-outline' as const, connected: false },
  { id: 'paypal', name: 'PayPal', icon: 'logo-paypal' as const, connected: false },
];

export default function LinkedAccountsScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [connections, setConnections] = useState<Record<string, boolean>>(
    Object.fromEntries(SERVICES.map((s) => [s.id, s.connected])),
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Linked accounts" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {SERVICES.map((s) => (
          <View key={s.id} style={[styles.row, { backgroundColor: colors.surface }]}>
            <View style={styles.left}>
              <View style={[styles.iconCircle, { backgroundColor: colors.surfaceAlt }]}>
                <Ionicons name={s.icon} size={18} color={colors.text} />
              </View>
              <Text style={[styles.name, { color: colors.text }]}>{s.name}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                connections[s.id]
                  ? { backgroundColor: colors.surfaceAlt }
                  : { backgroundColor: colors.primaryButtonBg },
              ]}
              onPress={() => setConnections((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
            >
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 12,
                  color: connections[s.id] ? colors.text : colors.primaryButtonText,
                }}
              >
                {connections[s.id] ? 'Connected' : 'Connect'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Demo only — no real accounts are linked.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 40 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 14, fontWeight: '600' },
  button: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 14 },
  hint: { fontSize: 11, textAlign: 'center', marginTop: 10 },
});
