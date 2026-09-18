import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import type { ProfileStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

export default function ProfileScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { user, logout } = useAuth();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.surfaceAlt }]}>
          <Text style={styles.avatarText}>🐱</Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{user?.name ?? 'Guest'}</Text>
        <Text style={[styles.email, { color: colors.textMuted }]}>{user?.email ?? ''}</Text>
        <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}>
          <Text style={[styles.badgeText, { color: colors.accent }]}>
            KittoPesa member since 2026
          </Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <ProfileRow
          icon="person-outline"
          label="Personal information"
          onPress={() => navigation.navigate('PersonalInfo')}
        />
        <Divider />
        <ProfileRow
          icon="link-outline"
          label="Linked accounts"
          onPress={() => navigation.navigate('LinkedAccounts')}
        />
        <Divider />
        <ProfileRow
          icon="shield-checkmark-outline"
          label="Security"
          onPress={() => navigation.navigate('Security')}
        />
        <Divider />
        <ProfileRow
          icon="help-circle-outline"
          label="Help & support"
          onPress={() => navigation.navigate('HelpSupport')}
        />
        <Divider />
        <ProfileRow
          icon="settings-outline"
          label="Settings"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      <TouchableOpacity style={[styles.logoutRow, { borderColor: colors.danger }]} onPress={logout}>
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={[styles.logoutText, { color: colors.danger }]}>Log out</Text>
      </TouchableOpacity>

      <Text style={[styles.footerNote, { color: colors.textMuted }]}>
        Demo profile — for preview purposes only.
      </Text>
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
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={onPress ? 0.6 : 1}>
      <View style={styles.rowLeft}>
        <View style={[styles.rowIcon, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name={icon} size={18} color={colors.text} />
        </View>
        <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

function Divider() {
  const { colors } = useTheme();
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
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
  },
  email: {
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    marginTop: 10,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 14,
  },
  logoutText: {
    fontWeight: '700',
    fontSize: 14,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 18,
  },
});
