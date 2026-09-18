import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Bouncy } from '../components/Motion';
import type { WalletViewModel } from '../hooks/useWallet';

export default function SettingsScreen({
  wallet,
  onBack,
}: {
  wallet: WalletViewModel;
  onBack: () => void;
}) {
  const [biometric, setBiometric] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState<'KES' | 'USD'>('KES');
  const [justReset, setJustReset] = useState(false);

  const handleReset = () => {
    wallet.resetDemo();
    setJustReset(true);
    setTimeout(() => setJustReset(false), 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.card}>
          <Row label="Face ID / Biometric login">
            <Switch value={biometric} onValueChange={setBiometric} />
          </Row>
          <Divider />
          <Row label="Push notifications">
            <Switch value={notifications} onValueChange={setNotifications} />
          </Row>
          <Divider />
          <Row label="Dark mode" hint="Coming soon">
            <Switch value={darkMode} onValueChange={setDarkMode} disabled />
          </Row>
        </View>

        <Text style={styles.sectionLabel}>CURRENCY</Text>
        <View style={styles.card}>
          <View style={styles.currencyRow}>
            {(['KES', 'USD'] as const).map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.currencyChip, currency === c && styles.currencyChipActive]}
                onPress={() => setCurrency(c)}
              >
                <Text style={[styles.currencyText, currency === c && styles.currencyTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.hint}>Display only in this demo — amounts stay in KES.</Text>
        </View>

        <Text style={styles.sectionLabel}>DEMO DATA</Text>
        <View style={styles.card}>
          <Text style={styles.hint}>
            Restore the starting balance, cards, and clear all transactions made in this session.
          </Text>
          <Bouncy style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>{justReset ? 'Done ✓' : 'Reset demo data'}</Text>
          </Bouncy>
        </View>

        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.card}>
          <Row label="Version">
            <Text style={styles.value}>1.0.0 (Demo)</Text>
          </Row>
        </View>
      </ScrollView>
    </View>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.rowLabel}>{label}</Text>
        {hint && <Text style={styles.rowHint}>{hint}</Text>}
      </View>
      {children}
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backButton: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rowLabel: {
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
  },
  rowHint: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eee',
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  currencyChip: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ddd',
  },
  currencyChipActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  currencyText: {
    fontWeight: '700',
    color: '#666',
    fontSize: 13,
  },
  currencyTextActive: {
    color: '#fff',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  value: {
    color: '#999',
    fontSize: 14,
  },
});
