import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GradientButton from '../components/GradientButton';
import { Bouncy, FadeSlideIn, ScaleIn, usePulse } from '../components/Motion';
import WalletCardView, { AddCardGhost, MiniWalletCard } from '../components/WalletCardView';
import { METHOD_COLOR, METHOD_ICON } from '../constants';
import { useWalletCtx } from '../contexts/WalletContext';
import type { WalletStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { METHOD_LABEL } from '../types';

type Props = NativeStackScreenProps<WalletStackParamList, 'WalletMain'>;

export default function WalletScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const {
    cards,
    selectedCardIndex,
    setSelectedCardIndex,
    balance,
    transactions,
    openPay,
    setAddCardVisible,
  } = useWalletCtx();

  const pulse = usePulse(balance);
  const heroCard = cards[selectedCardIndex] ?? cards[0];
  const backCard = cards.length > 1 ? cards[(selectedCardIndex + 1) % cards.length] : undefined;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.balanceLabel, { color: colors.textMuted }]}>Available balance</Text>
      <Animated.Text
        style={[styles.balanceValue, { color: colors.text, transform: [{ scale: pulse }] }]}
      >
        KES {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </Animated.Text>

      <GradientButton
        label="Pay for goods"
        variant="accent"
        icon={<Ionicons name="qr-code-outline" size={18} color="#fff" />}
        onPress={() => openPay({ method: 'mpesa', kind: 'pay' })}
        radius={28}
        style={styles.payMainButton}
      />

      {heroCard && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('CardDetail', { cardId: heroCard.id })}
        >
          <View style={styles.heroWrap}>
            {backCard && <WalletCardView card={backCard} style={styles.backCard} />}
            <ScaleIn key={heroCard.id} style={styles.heroFront}>
              <WalletCardView card={heroCard} />
            </ScaleIn>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>My cards</Text>
        <Text style={[styles.sectionHint, { color: colors.textMuted }]}>tap card for details</Text>
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

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Pay with</Text>
      <View style={styles.methodsRow}>
        <MethodButton
          icon="phone-portrait-outline"
          label="M-Pesa"
          color={METHOD_COLOR.mpesa}
          onPress={() => openPay({ method: 'mpesa', kind: 'pay' })}
        />
        <MethodButton
          icon="card-outline"
          label="Card"
          color={METHOD_COLOR.card}
          onPress={() => openPay({ method: 'card', kind: 'pay' })}
        />
        <MethodButton
          icon="logo-apple"
          label="Apple Pay"
          color={METHOD_COLOR.applepay}
          onPress={() => openPay({ method: 'applepay', kind: 'pay' })}
        />
      </View>

      <TouchableOpacity
        style={[styles.insightsRow, { backgroundColor: colors.surface }]}
        onPress={() => navigation.navigate('Insights')}
      >
        <Ionicons name="stats-chart-outline" size={18} color={colors.accent} />
        <Text style={[styles.insightsText, { color: colors.text }]}>View spending insights</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </TouchableOpacity>

      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent activity</Text>
      </View>
      {transactions.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          No transactions yet. Make your first payment above.
        </Text>
      ) : (
        transactions.map((item) => (
          <FadeSlideIn key={item.id}>
            <TouchableOpacity
              style={[styles.txRow, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('TransactionDetail', { transactionId: item.id })}
              activeOpacity={0.7}
            >
              <View style={[styles.txIcon, { backgroundColor: METHOD_COLOR[item.method] }]}>
                <Ionicons name={METHOD_ICON[item.method]} size={16} color="#fff" />
              </View>
              <View style={styles.txInfo}>
                <Text style={[styles.txMerchant, { color: colors.text }]}>{item.merchant}</Text>
                <Text style={[styles.txMethod, { color: colors.textMuted }]}>
                  {METHOD_LABEL[item.method]} ·{' '}
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <Text style={[styles.txAmount, { color: colors.danger }]}>
                - KES {item.amount.toLocaleString()}
              </Text>
            </TouchableOpacity>
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
  const { colors } = useTheme();
  return (
    <Bouncy style={styles.methodButton} onPress={onPress}>
      <View style={[styles.methodIconCircle, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <Text style={[styles.methodLabel, { color: colors.text }]}>{label}</Text>
    </Bouncy>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  balanceValue: {
    fontSize: 34,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 16,
  },
  payMainButton: {
    marginBottom: 26,
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
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionHint: {
    fontSize: 11,
  },
  miniRow: {
    marginBottom: 22,
  },
  methodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
    fontSize: 12,
    fontWeight: '600',
  },
  insightsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
  },
  insightsText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
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
    fontWeight: '600',
    fontSize: 14,
  },
  txMethod: {
    fontSize: 11,
    marginTop: 2,
  },
  txAmount: {
    fontWeight: '700',
    fontSize: 14,
  },
});
