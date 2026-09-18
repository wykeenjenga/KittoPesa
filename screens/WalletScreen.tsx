import { Ionicons } from '@expo/vector-icons';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bouncy, FadeSlideIn, ScaleIn, usePulse } from '../components/Motion';
import WalletCardView, { AddCardGhost, MiniWalletCard } from '../components/WalletCardView';
import { METHOD_COLOR, METHOD_ICON } from '../constants';
import type { WalletViewModel } from '../hooks/useWallet';
import { METHOD_LABEL } from '../types';

export default function WalletScreen({ wallet }: { wallet: WalletViewModel }) {
  const {
    cards,
    selectedCardIndex,
    setSelectedCardIndex,
    balance,
    transactions,
    openPay,
    setAddCardVisible,
  } = wallet;

  const pulse = usePulse(balance);
  const heroCard = cards[selectedCardIndex] ?? cards[0];
  const backCard = cards.length > 1 ? cards[(selectedCardIndex + 1) % cards.length] : undefined;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.balanceLabel}>Available balance</Text>
      <Animated.Text style={[styles.balanceValue, { transform: [{ scale: pulse }] }]}>
        KES {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </Animated.Text>

      <Bouncy style={styles.payMainButton} onPress={() => openPay({ method: 'mpesa' })}>
        <Ionicons name="qr-code-outline" size={18} color="#fff" />
        <Text style={styles.payMainText}>Pay for goods</Text>
      </Bouncy>

      {heroCard && (
        <View style={styles.heroWrap}>
          {backCard && <WalletCardView card={backCard} style={styles.backCard} />}
          <ScaleIn key={heroCard.id} style={styles.heroFront}>
            <WalletCardView card={heroCard} />
          </ScaleIn>
        </View>
      )}

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>My cards</Text>
        <Text style={styles.sectionHint}>tap to switch</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.miniRow}>
        {cards.map((card, index) => (
          <MiniWalletCard
            key={card.id}
            card={card}
            active={index === selectedCardIndex}
            onPress={() => setSelectedCardIndex(index)}
          />
        ))}
        <AddCardGhost onPress={() => setAddCardVisible(true)} />
      </ScrollView>

      <Text style={styles.sectionTitle}>Pay with</Text>
      <View style={styles.methodsRow}>
        <MethodButton
          icon="phone-portrait-outline"
          label="M-Pesa"
          color={METHOD_COLOR.mpesa}
          onPress={() => openPay({ method: 'mpesa' })}
        />
        <MethodButton
          icon="card-outline"
          label="Card"
          color={METHOD_COLOR.card}
          onPress={() => openPay({ method: 'card' })}
        />
        <MethodButton
          icon="logo-apple"
          label="Apple Pay"
          color={METHOD_COLOR.applepay}
          onPress={() => openPay({ method: 'applepay' })}
        />
      </View>

      <Text style={styles.sectionTitle}>Recent activity</Text>
      {transactions.length === 0 ? (
        <Text style={styles.emptyText}>No transactions yet. Make your first payment above.</Text>
      ) : (
        transactions.map((item) => (
          <FadeSlideIn key={item.id}>
            <View style={styles.txRow}>
              <View style={[styles.txIcon, { backgroundColor: METHOD_COLOR[item.method] }]}>
                <Ionicons name={METHOD_ICON[item.method]} size={16} color="#fff" />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txMerchant}>{item.merchant}</Text>
                <Text style={styles.txMethod}>
                  {METHOD_LABEL[item.method]} ·{' '}
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <Text style={styles.txAmount}>- KES {item.amount.toLocaleString()}</Text>
            </View>
          </FadeSlideIn>
        ))
      )}
    </ScrollView>
  );
}

function MethodButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Bouncy style={styles.methodButton} onPress={onPress}>
      <View style={[styles.methodIconCircle, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <Text style={styles.methodLabel}>{label}</Text>
    </Bouncy>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  balanceLabel: {
    color: '#8a8f9a',
    fontSize: 13,
    fontWeight: '500',
  },
  balanceValue: {
    color: '#111',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 16,
  },
  payMainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    borderRadius: 28,
    paddingVertical: 15,
    gap: 8,
    marginBottom: 26,
  },
  payMainText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  heroWrap: {
    height: 190,
    marginBottom: 20,
  },
  backCard: {
    position: 'absolute',
    top: 14,
    left: 18,
    right: -6,
    opacity: 0.55,
    transform: [{ scale: 0.96 }],
  },
  heroFront: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionTitle: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionHint: {
    color: '#aaa',
    fontSize: 11,
  },
  miniRow: {
    marginBottom: 22,
  },
  methodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  methodButton: {
    alignItems: 'center',
    flex: 1,
  },
  methodIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  methodLabel: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    color: '#999',
    fontSize: 13,
    fontStyle: 'italic',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txMerchant: {
    color: '#111',
    fontWeight: '600',
    fontSize: 14,
  },
  txMethod: {
    color: '#999',
    fontSize: 11,
    marginTop: 2,
  },
  txAmount: {
    color: '#e5484d',
    fontWeight: '700',
    fontSize: 14,
  },
});
