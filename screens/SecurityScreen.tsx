import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import type { ProfileStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Security'>;

export default function SecurityScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [changed, setChanged] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Security" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.row}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>
              Two-factor authentication
            </Text>
            <Switch value={twoFactor} onValueChange={setTwoFactor} />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.row}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>Login alerts</Text>
            <Switch value={loginAlerts} onValueChange={setLoginAlerts} />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.card, styles.actionRow, { backgroundColor: colors.surface }]}
          onPress={() => {
            setChanged(true);
            setTimeout(() => setChanged(false), 1200);
          }}
        >
          <Text style={{ color: colors.text, fontWeight: '600' }}>
            {changed ? 'PIN changed ✓' : 'Change M-Pesa PIN'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Demo controls — nothing here is connected to a real security system.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 40 },
  card: { borderRadius: 16, paddingHorizontal: 16, marginBottom: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  divider: { height: StyleSheet.hairlineWidth },
  actionRow: { paddingVertical: 14, alignItems: 'center' },
  hint: { fontSize: 11, textAlign: 'center', marginTop: 8 },
});
