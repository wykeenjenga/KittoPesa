import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Bouncy } from '../components/Motion';
import ScreenHeader from '../components/ScreenHeader';
import { useWalletCtx } from '../contexts/WalletContext';
import type { ProfileStackParamList } from '../navigation/types';
import { useTheme, ThemeMode } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const { colors, mode, setMode } = useTheme();
  const wallet = useWalletCtx();
  const [biometric, setBiometric] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState<'KES' | 'USD'>('KES');
  const [justReset, setJustReset] = useState(false);

  const handleReset = () => {
    wallet.resetDemo();
    setJustReset(true);
    setTimeout(() => setJustReset(false), 1500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>APPEARANCE</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.appearanceRow}>
            {(['system', 'light', 'dark'] as ThemeMode[]).map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.appearanceChip,
                  { borderColor: colors.border },
                  mode === m && {
                    backgroundColor: colors.primaryButtonBg,
                    borderColor: colors.primaryButtonBg,
                  },
                ]}
                onPress={() => setMode(m)}
              >
                <Text
                  style={[
                    styles.appearanceText,
                    { color: mode === m ? colors.primaryButtonText : colors.text },
                  ]}
                >
                  {m === 'system' ? 'System' : m === 'light' ? 'Light' : 'Dark'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>PREFERENCES</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Row label="Face ID / Biometric login" colors={colors}>
            <Switch value={biometric} onValueChange={setBiometric} />
          </Row>
          <Divider colors={colors} />
          <Row label="Push notifications" colors={colors}>
            <Switch value={notifications} onValueChange={setNotifications} />
          </Row>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>CURRENCY</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.currencyRow}>
            {(['KES', 'USD'] as const).map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.currencyChip,
                  { borderColor: colors.border },
                  currency === c && {
                    backgroundColor: colors.primaryButtonBg,
                    borderColor: colors.primaryButtonBg,
                  },
                ]}
                onPress={() => setCurrency(c)}
              >
                <Text
                  style={[
                    styles.currencyText,
                    { color: currency === c ? colors.primaryButtonText : colors.text },
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            Display only here — use the Convert tool on Home for live conversion.
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>DEMO DATA</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            Restore the starting balance, cards, and clear all transactions made in this session.
          </Text>
          <Bouncy
            style={[styles.resetButton, { backgroundColor: colors.primaryButtonBg }]}
            onPress={handleReset}
          >
            <Text style={[styles.resetButtonText, { color: colors.primaryButtonText }]}>
              {justReset ? 'Done ✓' : 'Reset demo data'}
            </Text>
          </Bouncy>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ABOUT</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Row label="Version" colors={colors}>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>1.0.0 (Demo)</Text>
          </Row>
        </View>
      </ScrollView>
    </View>
  );
}

function Row({
  label,
  colors,
  children,
}: {
  label: string;
  colors: { text: string };
  children: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <Text style={{ fontSize: 14, color: colors.text, fontWeight: '500' }}>{label}</Text>
      {children}
    </View>
  );
}

function Divider({ colors }: { colors: { border: string } }) {
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 18,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  appearanceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  appearanceChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  appearanceText: {
    fontWeight: '700',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
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
  },
  currencyText: {
    fontWeight: '700',
    fontSize: 13,
  },
  hint: {
    fontSize: 12,
    marginBottom: 10,
  },
  resetButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontWeight: '700',
    fontSize: 13,
  },
});
