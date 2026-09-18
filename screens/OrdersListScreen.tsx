import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FadeSlideIn } from '../components/Motion';
import ScreenHeader from '../components/ScreenHeader';
import { ORDER_STATUS_COLOR } from '../constants';
import { useWalletCtx } from '../contexts/WalletContext';
import type { ShopStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { ORDER_STATUS_LABEL } from '../types';

type Props = NativeStackScreenProps<ShopStackParamList, 'Orders'>;

export default function OrdersListScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { orders } = useWalletCtx();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Your orders" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {orders.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="cube-outline" size={40} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No orders yet. Buy something from Shop to see it tracked here.
            </Text>
          </View>
        ) : (
          orders.map((order) => (
            <FadeSlideIn key={order.id}>
              <TouchableOpacity
                style={[styles.row, { backgroundColor: colors.surface }]}
                onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
                activeOpacity={0.8}
              >
                <View style={[styles.imageWrap, { backgroundColor: '#fff' }]}>
                  <Image
                    source={{ uri: order.items[0]?.product.image }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.info}>
                  <Text style={[styles.itemsLabel, { color: colors.text }]} numberOfLines={1}>
                    {order.items.length > 1
                      ? `${order.items[0]?.product.name} +${order.items.length - 1} more`
                      : order.items[0]?.product.name}
                  </Text>
                  <Text style={[styles.date, { color: colors.textMuted }]}>
                    {new Date(order.placedAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    · KES {order.total.toLocaleString()}
                  </Text>
                  <View style={styles.statusRow}>
                    <View
                      style={[styles.dot, { backgroundColor: ORDER_STATUS_COLOR[order.status] }]}
                    />
                    <Text style={[styles.statusText, { color: ORDER_STATUS_COLOR[order.status] }]}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </FadeSlideIn>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 40 },
  emptyWrap: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyText: { fontSize: 13, textAlign: 'center', paddingHorizontal: 30 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  imageWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  image: { width: '75%', height: '75%' },
  info: { flex: 1 },
  itemsLabel: { fontSize: 13, fontWeight: '600' },
  date: { fontSize: 11, marginTop: 3 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
});
