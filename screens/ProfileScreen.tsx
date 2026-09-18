import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { WalletViewModel } from '../hooks/useWallet';
import SettingsScreen from './SettingsScreen';

export default function ProfileScreen({ wallet }: { wallet: WalletViewModel }) {
  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) {
    return <SettingsScreen wallet={wallet} onBack={() => setShowSettings(false)} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🐱</Text>
        </View>
        <Text style={styles.name}>Wycliff K</Text>
        <Text style={styles.email}>wycliff@triply.co</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>KittoPesa member since 2026</Text>
        </View>
      </View>

      <View style={styles.card}>
        <ProfileRow icon="person-outline" label="Personal information" />
        <Divider />
        <ProfileRow icon="link-outline" label="Linked accounts" />
        <Divider />
        <ProfileRow icon="shield-checkmark-outline" label="Security" />
        <Divider />
        <ProfileRow icon="help-circle-outline" label="Help & support" />
        <Divider />
        <ProfileRow icon="settings-outline" label="Settings" onPress={() => setShowSettings(true)} />
      </View>

      <Text style={styles.footerNote}>Demo profile — for preview purposes only.</Text>
    </ScrollView>
  );
}

function ProfileRow({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={onPress ? 0.6 : 1}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>
          <Ionicons name={icon} size={18} color="#333" />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#ccc" />
    </TouchableOpacity>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 26,
    marginTop: 10,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#eef0f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  email: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  badge: {
    marginTop: 10,
    backgroundColor: '#eafbf1',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: '#0f9d58',
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eee',
  },
  footerNote: {
    textAlign: 'center',
    color: '#bbb',
    fontSize: 11,
    marginTop: 18,
  },
});
