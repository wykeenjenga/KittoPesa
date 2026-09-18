import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bouncy, FadeSlideIn } from '../components/Motion';
import { PRODUCTS } from '../data/products';
import type { WalletViewModel } from '../hooks/useWallet';
import type { Product } from '../types';

export default function ShopScreen({ wallet }: { wallet: WalletViewModel }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Shop</Text>
      <Text style={styles.subtitle}>Pick something to try checkout with your wallet.</Text>

      <View style={styles.grid}>
        {PRODUCTS.map((product, i) => (
          <FadeSlideIn key={product.id} delay={i * 40} style={styles.cardWrap}>
            <ProductCard
              product={product}
              onBuy={() =>
                wallet.openPay({
                  method: 'mpesa',
                  merchant: product.name,
                  amount: product.price,
                })
              }
            />
          </FadeSlideIn>
        ))}
      </View>
    </ScrollView>
  );
}

function ProductCard({ product, onBuy }: { product: Product; onBuy: () => void }) {
  return (
    <View style={styles.card}>
      <Text style={styles.category}>{product.category.toUpperCase()}</Text>
      <Text style={styles.emoji}>{product.emoji}</Text>
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.price}>KES {product.price.toLocaleString()}</Text>
      <Bouncy style={styles.buyButton} onPress={onBuy}>
        <Text style={styles.buyText}>Buy</Text>
      </Bouncy>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
  },
  subtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
    marginBottom: 20,
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
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  category: {
    fontSize: 9,
    fontWeight: '700',
    color: '#bbb',
    letterSpacing: 0.5,
  },
  emoji: {
    fontSize: 40,
    textAlign: 'center',
    marginVertical: 10,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
    minHeight: 34,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
    marginTop: 6,
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buyText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});
