import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Bouncy, FadeSlideIn } from '../components/Motion';
import ScreenBackground from '../components/ScreenBackground';
import { useWalletCtx } from '../contexts/WalletContext';
import { useProducts } from '../hooks/useProducts';
import type { ShopStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import type { Product } from '../types';

type Props = NativeStackScreenProps<ShopStackParamList, 'ShopMain'>;

export default function ShopScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { products, loading, error, reload } = useProducts();
  const { cartCount, addToCart } = useWalletCtx();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === 'All' || p.category === category) &&
          p.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [products, category, query],
  );

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Shop</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Real catalog data — try checkout with your wallet.
            </Text>
          </View>
          <Bouncy
            style={[styles.cartButton, { backgroundColor: colors.surfaceAlt }]}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={20} color={colors.text} />
            {cartCount > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: colors.danger }]}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </Bouncy>
        </View>

        <TextInput
          style={[
            styles.search,
            { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border },
          ]}
          placeholder="Search products"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCategory(c)}
              style={[
                styles.categoryChip,
                { borderColor: colors.border },
                category === c && {
                  backgroundColor: colors.primaryButtonBg,
                  borderColor: colors.primaryButtonBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: category === c ? colors.primaryButtonText : colors.text },
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.accent} />
            <Text style={{ color: colors.textMuted, marginTop: 10 }}>Loading products…</Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.centered}>
            <Text style={{ color: colors.danger, marginBottom: 10, textAlign: 'center' }}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={reload}
              style={[styles.retryButton, { backgroundColor: colors.primaryButtonBg }]}
            >
              <Text style={{ color: colors.primaryButtonText, fontWeight: '700' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && (
          <View style={styles.grid}>
            {filtered.map((product, i) => (
              <FadeSlideIn key={product.id} delay={i * 30} style={styles.cardWrap}>
                <ProductCard
                  product={product}
                  onPress={() => navigation.navigate('ProductDetail', { product })}
                  onAdd={() => addToCart(product, 1)}
                />
              </FadeSlideIn>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

function ProductCard({
  product,
  onPress,
  onAdd,
}: {
  product: Product;
  onPress: () => void;
  onAdd: () => void;
}) {
  const { colors } = useTheme();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd();
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.imageWrap, { backgroundColor: '#fff' }]}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={[styles.category, { color: colors.textMuted }]}>
        {product.category.toUpperCase()}
      </Text>
      <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
        {product.name}
      </Text>
      <View style={styles.ratingRow}>
        <Ionicons name="star" size={11} color="#f5a623" />
        <Text style={[styles.ratingText, { color: colors.textMuted }]}>
          {product.rating.toFixed(1)} ({product.ratingCount})
        </Text>
      </View>
      <Text style={[styles.price, { color: colors.text }]}>
        KES {product.price.toLocaleString()}
      </Text>
      <Bouncy
        style={[styles.buyButton, { backgroundColor: colors.primaryButtonBg }]}
        onPress={handleAdd}
      >
        <Text style={[styles.buyText, { color: colors.primaryButtonText }]}>
          {added ? 'Added ✓' : 'Add to cart'}
        </Text>
      </Bouncy>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
    maxWidth: 240,
  },
  cartButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  search: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  categoryRow: {
    marginBottom: 18,
  },
  categoryChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrap: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    borderRadius: 18,
    padding: 12,
  },
  imageWrap: {
    height: 90,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  category: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    minHeight: 34,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 10,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 10,
  },
  buyButton: {
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buyText: {
    fontWeight: '700',
    fontSize: 12,
  },
});
