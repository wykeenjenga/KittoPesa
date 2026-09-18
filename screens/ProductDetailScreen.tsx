import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GradientButton from '../components/GradientButton';
import { Bouncy } from '../components/Motion';
import ScreenHeader from '../components/ScreenHeader';
import { useWalletCtx } from '../contexts/WalletContext';
import type { ShopStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen({ route, navigation }: Props) {
  const { product } = route.params;
  const { colors } = useTheme();
  const { addToCart, openPay } = useWalletCtx();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const buyNow = () => {
    openPay({
      method: 'mpesa',
      merchant: product.name,
      amount: product.price * quantity,
      kind: 'pay',
      category: product.category,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Product" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.imageWrap, { backgroundColor: '#fff' }]}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        </View>

        <Text style={[styles.category, { color: colors.accent }]}>
          {product.category.toUpperCase()}
        </Text>
        <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#f5a623" />
          <Text style={[styles.ratingText, { color: colors.textMuted }]}>
            {product.rating.toFixed(1)} · {product.ratingCount} ratings
          </Text>
        </View>

        <Text style={[styles.price, { color: colors.text }]}>
          KES {product.price.toLocaleString()}
        </Text>
        <Text style={[styles.usdPrice, { color: colors.textMuted }]}>
          ≈ ${product.usdPrice.toFixed(2)} USD
        </Text>

        <Text style={[styles.description, { color: colors.textMuted }]}>
          {product.description}
        </Text>

        <View style={styles.quantityRow}>
          <Text style={[styles.quantityLabel, { color: colors.text }]}>Quantity</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[styles.stepButton, { backgroundColor: colors.surfaceAlt }]}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Ionicons name="remove" size={16} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.quantityValue, { color: colors.text }]}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.stepButton, { backgroundColor: colors.surfaceAlt }]}
              onPress={() => setQuantity((q) => q + 1)}
            >
              <Ionicons name="add" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Bouncy
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            onPress={handleAdd}
          >
            <Text style={[styles.secondaryText, { color: colors.text }]}>
              {added ? 'Added ✓' : 'Add to cart'}
            </Text>
          </Bouncy>
          <GradientButton
            label="Buy now"
            variant="accent"
            onPress={buyNow}
            style={styles.primaryButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  imageWrap: {
    height: 220,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  image: {
    width: '70%',
    height: '70%',
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  ratingText: {
    fontSize: 12,
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 14,
  },
  usdPrice: {
    fontSize: 12,
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 16,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  secondaryText: {
    fontWeight: '700',
    fontSize: 14,
  },
  primaryButton: {
    flex: 1,
  },
});
