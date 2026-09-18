import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GradientButton from '../components/GradientButton';
import { FadeSlideIn } from '../components/Motion';
import ScreenHeader from '../components/ScreenHeader';
import { useWalletCtx } from '../contexts/WalletContext';
import type { ShopStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<ShopStackParamList, 'Cart'>;

export default function CartScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { cart, updateCartQuantity, removeFromCart, cartTotal, checkoutCart } = useWalletCtx();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Your cart" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {cart.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="cart-outline" size={40} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Your cart is empty. Add something from Shop.
            </Text>
          </View>
        ) : (
          cart.map((item) => (
            <FadeSlideIn key={item.product.id}>
              <View style={[styles.row, { backgroundColor: colors.surface }]}>
                <View style={[styles.imageWrap, { backgroundColor: '#fff' }]}>
                  <Image
                    source={{ uri: item.product.image }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.info}>
                  <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  <Text style={[styles.price, { color: colors.text }]}>
                    KES {item.product.price.toLocaleString()}
                  </Text>
                  <View style={styles.stepper}>
                    <TouchableOpacity
                      style={[styles.stepButton, { backgroundColor: colors.surfaceAlt }]}
                      onPress={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Ionicons name="remove" size={14} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.quantity, { color: colors.text }]}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={[styles.stepButton, { backgroundColor: colors.surfaceAlt }]}
                      onPress={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Ionicons name="add" size={14} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeFromCart(item.product.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </FadeSlideIn>
          ))
        )}
      </ScrollView>

      {cart.length > 0 && (
        <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View style={styles.totalRow}>
            <Text style={{ color: colors.textMuted }}>Subtotal</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>
              KES {cartTotal.toLocaleString()}
            </Text>
          </View>
          <GradientButton
            label="Checkout"
            variant="accent"
            onPress={checkoutCart}
            style={styles.checkoutButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 20,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  imageWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  image: {
    width: '75%',
    height: '75%',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  stepButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 16,
    textAlign: 'center',
  },
  removeButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  checkoutButton: {
    width: '100%',
  },
});
