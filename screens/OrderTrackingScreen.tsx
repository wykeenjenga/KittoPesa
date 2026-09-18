import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef } from 'react';
import { Animated, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Bouncy } from '../components/Motion';
import ScreenHeader from '../components/ScreenHeader';
import { ORDER_STATUS_COLOR } from '../constants';
import { useWalletCtx } from '../contexts/WalletContext';
import type { ShopStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { ORDER_STATUS_LABEL, OrderStatus } from '../types';

type Props = NativeStackScreenProps<ShopStackParamList, 'OrderTracking'>;

const STEPS: OrderStatus[] = ['placed', 'preparing', 'out_for_delivery', 'delivered'];
const STEP_ICON: Record<OrderStatus, keyof typeof Ionicons.glyphMap> = {
  placed: 'receipt-outline',
  preparing: 'restaurant-outline',
  out_for_delivery: 'bicycle-outline',
  delivered: 'checkmark-done-outline',
};

// Route curve endpoints (store -> home) inside a 340x200 viewBox.
const P0 = { x: 35, y: 165 };
const P1 = { x: 110, y: 25 };
const P2 = { x: 230, y: 178 };
const P3 = { x: 305, y: 38 };

function bezierPoint(t: number, p0: typeof P0, p1: typeof P0, p2: typeof P0, p3: typeof P0) {
  const mt = 1 - t;
  const x = mt ** 3 * p0.x + 3 * mt ** 2 * t * p1.x + 3 * mt * t ** 2 * p2.x + t ** 3 * p3.x;
  const y = mt ** 3 * p0.y + 3 * mt ** 2 * t * p1.y + 3 * mt * t ** 2 * p2.y + t ** 3 * p3.y;
  return { x, y };
}

const PATH_D = `M ${P0.x} ${P0.y} C ${P1.x} ${P1.y}, ${P2.x} ${P2.y}, ${P3.x} ${P3.y}`;

export default function OrderTrackingScreen({ route, navigation }: Props) {
  const { colors, isDark } = useTheme();
  const { orders } = useWalletCtx();
  const order = orders.find((o) => o.id === route.params.orderId);

  const pos = useRef(new Animated.ValueXY(bezierPoint(0, P0, P1, P2, P3))).current;

  useEffect(() => {
    if (!order) return;
    const target = bezierPoint(order.routeProgress, P0, P1, P2, P3);
    Animated.timing(pos, { toValue: target, duration: 950, useNativeDriver: false }).start();
  }, [order?.routeProgress]);

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title="Order" onBack={() => navigation.goBack()} />
        <Text style={{ color: colors.textMuted, padding: 20 }}>Order not found.</Text>
      </View>
    );
  }

  const stepIndex = STEPS.indexOf(order.status);
  const mapBg = isDark ? '#12241a' : '#eaf3ec';
  const roadColor = isDark ? '#2f5a41' : '#b9d8c2';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={order.id} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.mapCard, { backgroundColor: mapBg }]}>
          <Svg width="100%" height={200} viewBox="0 0 340 200">
            <Path
              d={PATH_D}
              stroke={roadColor}
              strokeWidth={4}
              strokeDasharray="2,10"
              strokeLinecap="round"
              fill="none"
            />
            <Circle cx={P0.x} cy={P0.y} r={16} fill={colors.surface} />
            <Circle cx={P3.x} cy={P3.y} r={16} fill={colors.surface} />
          </Svg>

          <View style={[styles.pin, { left: P0.x - 14, top: P0.y - 14 }]}>
            <Ionicons name="storefront" size={16} color={colors.accent} />
          </View>
          <View style={[styles.pin, { left: P3.x - 14, top: P3.y - 14 }]}>
            <Ionicons name="home" size={16} color={colors.accent} />
          </View>

          <Animated.View
            style={[
              styles.courierMarker,
              {
                backgroundColor: colors.accent,
                transform: [{ translateX: pos.x }, { translateY: pos.y }],
              },
            ]}
          >
            <Text style={styles.courierEmoji}>🛵</Text>
          </Animated.View>

          <View style={styles.mapLabels}>
            <Text style={[styles.mapLabelText, { color: colors.textMuted }]}>Store</Text>
            <Text style={[styles.mapLabelText, { color: colors.textMuted }]}>You</Text>
          </View>
        </View>

        <View style={[styles.etaCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.etaLabel, { color: colors.textMuted }]}>
            {order.status === 'delivered' ? 'Delivered' : 'Estimated arrival'}
          </Text>
          <Text style={[styles.etaValue, { color: colors.text }]}>
            {order.status === 'delivered'
              ? new Date(order.placedAt + 1000 * 60 * 5).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : `${order.etaMinutes} min`}
          </Text>
          <Text style={[styles.courierLine, { color: colors.textMuted }]}>
            Courier: {order.courierName}
          </Text>
        </View>

        <View style={styles.stepper}>
          {STEPS.map((step, i) => {
            const active = i <= stepIndex;
            return (
              <View key={step} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    {
                      backgroundColor: active ? ORDER_STATUS_COLOR[step] : colors.surfaceAlt,
                    },
                  ]}
                >
                  <Ionicons
                    name={STEP_ICON[step]}
                    size={16}
                    color={active ? '#fff' : colors.textMuted}
                  />
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    { color: active ? colors.text : colors.textMuted },
                  ]}
                >
                  {ORDER_STATUS_LABEL[step]}
                </Text>
                {i < STEPS.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      { backgroundColor: i < stepIndex ? colors.accent : colors.border },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>

        <Bouncy
          style={[styles.callButton, { backgroundColor: colors.surfaceAlt }]}
          onPress={() => Linking.openURL('tel:0712345678')}
        >
          <Ionicons name="call-outline" size={16} color={colors.text} />
          <Text style={[styles.callText, { color: colors.text }]}>Call courier</Text>
        </Bouncy>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Order items</Text>
        <View style={[styles.itemsCard, { backgroundColor: colors.surface }]}>
          {order.items.map((item) => (
            <View key={item.product.id} style={styles.itemRow}>
              <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                {item.quantity}× {item.product.name}
              </Text>
              <Text style={[styles.itemPrice, { color: colors.textMuted }]}>
                KES {(item.product.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.itemRow}>
            <Text style={[styles.itemName, { color: colors.text, fontWeight: '700' }]}>
              Total
            </Text>
            <Text style={[styles.itemPrice, { color: colors.text, fontWeight: '700' }]}>
              KES {order.total.toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 40 },
  mapCard: {
    borderRadius: 20,
    height: 200,
    overflow: 'hidden',
    marginBottom: 16,
  },
  pin: {
    position: 'absolute',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courierMarker: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    left: -14,
    top: -14,
  },
  courierEmoji: { fontSize: 15 },
  mapLabels: {
    position: 'absolute',
    bottom: 8,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapLabelText: { fontSize: 10, fontWeight: '600' },
  etaCard: { borderRadius: 16, padding: 16, marginBottom: 20 },
  etaLabel: { fontSize: 12 },
  etaValue: { fontSize: 22, fontWeight: '800', marginTop: 2 },
  courierLine: { fontSize: 12, marginTop: 6 },
  stepper: { marginBottom: 20 },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepLabel: { fontSize: 13, fontWeight: '600', flex: 1 },
  stepLine: {
    position: 'absolute',
    left: 15,
    top: 32,
    width: 2,
    height: 24,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 13,
    marginBottom: 24,
  },
  callText: { fontWeight: '700', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  itemsCard: { borderRadius: 16, padding: 16 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  itemName: { fontSize: 13, flex: 1, marginRight: 10 },
  itemPrice: { fontSize: 13 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 4 },
});
