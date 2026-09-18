import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Bouncy, FadeSlideIn, usePulse } from '../components/Motion';
import ScreenBackground from '../components/ScreenBackground';
import { useWalletCtx } from '../contexts/WalletContext';
import { useProducts } from '../hooks/useProducts';
import type { ShopStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import type { Product } from '../types';

type Props = NativeStackScreenProps<ShopStackParamList, 'ShopMain'>;

type Flyer = {
  id: number;
  image: string;
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
};

export default function ShopScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { products, loading, error, reload } = useProducts();
  const { cartCount, addToCart, orders } = useWalletCtx();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const activeOrderCount = orders.filter((o) => o.status !== 'delivered').length;

  const overlayRef = useRef<View>(null);
  const cartIconRef = useRef<View>(null);
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const cartBounce = usePulse(cartCount);

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

  const flyToCart = (image: string, originX: number, originY: number) => {
    const overlayNode = overlayRef.current;
    const cartNode = cartIconRef.current;
    if (!overlayNode || !cartNode) return;

    overlayNode.measureInWindow((ox, oy) => {
      cartNode.measureInWindow((cx, cy, cw, ch) => {
        const startX = originX - ox;
        const startY = originY - oy;
        const endX = cx - ox + cw / 2 - 22;
        const endY = cy - oy + ch / 2 - 22;

        const id = Date.now() + Math.random();
        const x = new Animated.Value(startX);
        const y = new Animated.Value(startY);
        const scale = new Animated.Value(1);
        const opacity = new Animated.Value(1);

        setFlyers((prev) => [...prev, { id, image, x, y, scale, opacity }]);

        Animated.parallel([
          Animated.timing(x, { toValue: endX, duration: 600, useNativeDriver: true }),
          Animated.timing(y, {
            toValue: endY,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scale, { toValue: 0.15, duration: 600, useNativeDriver: true }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 250,
            delay: 350,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setFlyers((prev) => prev.filter((f) => f.id !== id));
        });
      });
    });
  };

  return (
    <ScreenBackground>
      <View ref={overlayRef} style={styles.overlayAnchor} pointerEvents="none">
        {flyers.map((f) => (
          <Animated.Image
            key={f.id}
            source={{ uri: f.image }}
            style={[
              styles.flyer,
              {
                opacity: f.opacity,
                transform: [
                  { translateX: f.x },
                  { translateY: f.y },
                  { scale: f.scale },
                ],
              },
            ]}
            resizeMode="contain"
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Shop</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Real catalog data — try checkout with your wallet.
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <Bouncy
              style={[styles.cartButton, { backgroundColor: colors.surfaceAlt }]}
              onPress={() => navigation.navigate('Orders')}
            >
              <Ionicons name="cube-outline" size={20} color={colors.text} />
              {activeOrderCount > 0 && (
                <View style={[styles.cartBadge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.cartBadgeText}>{activeOrderCount}</Text>
                </View>
              )}
            </Bouncy>
            <View ref={cartIconRef} collapsable={false}>
              <Animated.View style={{ transform: [{ scale: cartBounce }] }}>
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
              </Animated.View>
            </View>
          </View>
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
                  onAdd={(originX, originY) => {
                    addToCart(product, 1);
                    flyToCart(product.image, originX, originY);
                  }}
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
  onAdd: (originX: number, originY: number) => void;
}) {
  const { colors } = useTheme();
  const [added, setAdded] = useState(false);
  const imageRef = useRef<View>(null);

  const handleAdd = () => {
    imageRef.current?.measureInWindow((x, y, width, height) => {
      onAdd(x + width / 2, y + height / 2);
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View ref={imageRef} collapsable={false} style={[styles.imageWrap, { backgroundColor: '#fff' }]}>
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
  overlayAnchor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    elevation: 50,
  },
  flyer: {
    position: 'absolute',
    width: 44,
    height: 44,
    left: 0,
    top: 0,
  },
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
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
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
