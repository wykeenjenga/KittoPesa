import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { WalletCard } from '../types';

export default function WalletCardView({
  card,
  style,
}: {
  card: WalletCard;
  style?: object;
}) {
  return (
    <LinearGradient
      colors={card.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, style]}
    >
      <View style={styles.topRow}>
        <Text style={styles.chip}>▮▮</Text>
        <Text style={styles.brand}>
          {card.brand === 'visa' ? 'VISA' : 'Mastercard'}
        </Text>
      </View>
      <Text style={styles.number}>•••• •••• •••• {card.last4}</Text>
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.smallLabel}>CARD HOLDER</Text>
          <Text style={styles.value}>{card.holder}</Text>
        </View>
        <View>
          <Text style={styles.smallLabel}>EXPIRES</Text>
          <Text style={styles.value}>{card.expiry}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

// A small thumbnail used in the horizontal card picker row.
export function MiniWalletCard({
  card,
  active,
  onPress,
}: {
  card: WalletCard;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.miniWrap, active && styles.miniWrapActive]}
    >
      <LinearGradient
        colors={card.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mini}
      >
        <Text style={styles.miniBrand}>
          {card.brand === 'visa' ? 'VISA' : 'MC'}
        </Text>
        <Text style={styles.miniNumber}>•• {card.last4}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export function AddCardGhost({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.ghost} onPress={onPress} activeOpacity={0.6}>
      <Text style={styles.ghostPlus}>+</Text>
      <Text style={styles.ghostText}>Add card</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 170,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    marginRight: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    letterSpacing: 1,
  },
  brand: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    fontStyle: 'italic',
  },
  number: {
    color: '#fff',
    fontSize: 18,
    letterSpacing: 2,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  value: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  ghost: {
    width: 96,
    height: 62,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#d8d8d8',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  ghostPlus: {
    fontSize: 20,
    color: '#999',
    lineHeight: 22,
  },
  ghostText: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
    fontWeight: '600',
  },
  miniWrap: {
    borderRadius: 14,
    marginRight: 10,
    opacity: 0.55,
  },
  miniWrapActive: {
    opacity: 1,
  },
  mini: {
    width: 96,
    height: 62,
    borderRadius: 14,
    padding: 10,
    justifyContent: 'space-between',
  },
  miniBrand: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 10,
    fontStyle: 'italic',
  },
  miniNumber: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
