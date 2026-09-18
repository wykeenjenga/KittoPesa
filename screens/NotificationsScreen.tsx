import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FadeSlideIn } from '../components/Motion';
import ScreenHeader from '../components/ScreenHeader';
import { useWalletCtx } from '../contexts/WalletContext';
import type { HomeStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'Notifications'>;

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  card: 'card-outline',
  gift: 'gift-outline',
  alert: 'information-circle-outline',
  bag: 'bag-outline',
};

export default function NotificationsScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useWalletCtx();
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title="Notifications"
        onBack={() => navigation.goBack()}
        right={
          hasUnread ? (
            <TouchableOpacity onPress={markAllNotificationsRead}>
              <Text style={[styles.markAll, { color: colors.accent }]}>Mark all read</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {notifications.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textMuted }]}>No notifications yet.</Text>
        ) : (
          notifications.map((n) => (
            <FadeSlideIn key={n.id}>
              <TouchableOpacity
                style={[
                  styles.row,
                  { backgroundColor: colors.surface, opacity: n.read ? 0.6 : 1 },
                ]}
                onPress={() => markNotificationRead(n.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, { backgroundColor: colors.accentSoft }]}>
                  <Ionicons name={ICON_MAP[n.icon]} size={18} color={colors.accent} />
                </View>
                <View style={styles.textCol}>
                  <Text style={[styles.title, { color: colors.text }]}>{n.title}</Text>
                  <Text style={[styles.body, { color: colors.textMuted }]}>{n.body}</Text>
                  <Text style={[styles.time, { color: colors.textMuted }]}>
                    {new Date(n.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                {!n.read && <View style={[styles.dot, { backgroundColor: colors.accent }]} />}
              </TouchableOpacity>
            </FadeSlideIn>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  markAll: {
    fontWeight: '700',
    fontSize: 11,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  empty: {
    fontStyle: 'italic',
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
  },
  body: {
    fontSize: 12,
    marginTop: 2,
  },
  time: {
    fontSize: 10,
    marginTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 4,
  },
});
