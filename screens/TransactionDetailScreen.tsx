import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PopIn } from '../components/Motion';
import ScreenHeader from '../components/ScreenHeader';
import { useWalletCtx } from '../contexts/WalletContext';
import type { WalletStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { METHOD_LABEL } from '../types';

type Props = NativeStackScreenProps<WalletStackParamList, 'TransactionDetail'>;

export default function TransactionDetailScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const { transactions } = useWalletCtx();
  const tx = transactions.find((t) => t.id === route.params.transactionId);

  if (!tx) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title="Transaction" onBack={() => navigation.goBack()} />
        <Text style={{ color: colors.textMuted, padding: 20 }}>Transaction not found.</Text>
      </View>
    );
  }

  const share = () => {
    Share.share({
      message:
        `KittoPesa receipt\n` +
        `${tx.kind === 'send' ? 'Sent to' : 'Paid to'} ${tx.merchant}\n` +
        `Amount: KES ${tx.amount.toLocaleString()}\n` +
        `Method: ${METHOD_LABEL[tx.method]}\n` +
        `Reference: ${tx.reference}\n` +
        `Date: ${new Date(tx.timestamp).toLocaleString()}`,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Receipt" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <PopIn style={[styles.iconCircle, { backgroundColor: colors.accentSoft }]}>
          <Ionicons name="checkmark-circle" size={40} color={colors.accent} />
        </PopIn>
        <Text style={[styles.amount, { color: colors.text }]}>
          KES {tx.amount.toLocaleString()}
        </Text>
        <Text style={[styles.status, { color: colors.accent }]}>
          {tx.kind === 'send' ? 'Sent successfully' : 'Paid successfully'}
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <DetailRow
            label={tx.kind === 'send' ? 'Recipient' : 'Merchant'}
            value={tx.merchant}
            colors={colors}
          />
          <Divider colors={colors} />
          <DetailRow label="Method" value={METHOD_LABEL[tx.method]} colors={colors} />
          {tx.category && (
            <>
              <Divider colors={colors} />
              <DetailRow label="Category" value={tx.category} colors={colors} />
            </>
          )}
          <Divider colors={colors} />
          <DetailRow label="Reference" value={tx.reference} colors={colors} />
          <Divider colors={colors} />
          <DetailRow label="Date" value={new Date(tx.timestamp).toLocaleString()} colors={colors} />
        </View>

        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: colors.primaryButtonBg }]}
          onPress={share}
        >
          <Ionicons name="share-outline" size={16} color={colors.primaryButtonText} />
          <Text style={[styles.shareText, { color: colors.primaryButtonText }]}>
            Share receipt
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DetailRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ThemeColors;
}) {
  return (
    <View style={styles.row}>
      <Text style={{ color: colors.textMuted, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>{value}</Text>
    </View>
  );
}

function Divider({ colors }: { colors: ThemeColors }) {
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />;
}

const styles = StyleSheet.create({
  content: { padding: 20, alignItems: 'center' },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  amount: { fontSize: 28, fontWeight: '800', marginTop: 16 },
  status: { fontSize: 13, fontWeight: '700', marginTop: 4, marginBottom: 20 },
  card: { width: '100%', borderRadius: 16, padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginTop: 24,
  },
  shareText: { fontWeight: '700', fontSize: 14 },
});
