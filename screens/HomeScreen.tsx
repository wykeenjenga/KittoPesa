import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bouncy, FadeSlideIn } from '../components/Motion';
import type { TabKey } from '../components/TabBar';
import { METHOD_COLOR, METHOD_ICON } from '../constants';
import type { WalletViewModel } from '../hooks/useWallet';
import { METHOD_LABEL } from '../types';

export default function HomeScreen({
  wallet,
  onNavigate,
}: {
  wallet: WalletViewModel;
  onNavigate: (tab: TabKey) => void;
}) {
  const { balance, transactions, openPay, setAddCardVisible } = wallet;
  const preview = transactions.slice(0, 3);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, Wycliff 👋</Text>
          <Text style={styles.subGreeting}>Welcome back to KittoPesa</Text>
        </View>
        <Bouncy style={styles.avatar} onPress={() => onNavigate('profile')}>
          <Text style={styles.avatarText}>🐱</Text>
        </Bouncy>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available balance</Text>
        <Text style={styles.balanceValue}>
          KES {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
        <Bouncy style={styles.viewWalletRow} onPress={() => onNavigate('wallet')}>
          <Text style={styles.viewWalletText}>View wallet</Text>
          <Ionicons name="arrow-forward" size={14} color="#0f9d58" />
        </Bouncy>
      </View>

      <View style={styles.actionsRow}>
        <QuickAction
          icon="qr-code-outline"
          label="Pay"
          onPress={() => openPay({ method: 'mpesa' })}
        />
        <QuickAction icon="bag-outline" label="Shop" onPress={() => onNavigate('shop')} />
        <QuickAction
          icon="card-outline"
          label="Add card"
          onPress={() => setAddCardVisible(true)}
        />
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Recent activity</Text>
        {transactions.length > 0 && (
          <Bouncy onPress={() => onNavigate('wallet')}>
            <Text style={styles.seeAll}>See all</Text>
          </Bouncy>
        )}
      </View>

      {preview.length === 0 ? (
        <Text style={styles.emptyText}>
          Nothing yet — try the Shop tab or tap Pay above to make your first payment.
        </Text>
      ) : (
        preview.map((item) => (
          <FadeSlideIn key={item.id}>
            <View style={styles.txRow}>
              <View style={[styles.txIcon, { backgroundColor: METHOD_COLOR[item.method] }]}>
                <Ionicons name={METHOD_ICON[item.method]} size={16} color="#fff" />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txMerchant}>{item.merchant}</Text>
                <Text style={styles.txMethod}>{METHOD_LABEL[item.method]}</Text>
              </View>
              <Text style={styles.txAmount}>- KES {item.amount.toLocaleString()}</Text>
            </View>
          </FadeSlideIn>
        ))
      )}
    </ScrollView>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Bouncy style={styles.action} onPress={onPress}>
      <View style={styles.actionCircle}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Bouncy>
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
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
  },
  subGreeting: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eef0f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  balanceLabel: {
    color: '#8a8f9a',
    fontSize: 12,
    fontWeight: '500',
  },
  balanceValue: {
    color: '#111',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 10,
  },
  viewWalletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewWalletText: {
    color: '#0f9d58',
    fontWeight: '700',
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  action: {
    alignItems: 'center',
    flex: 1,
  },
  actionCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
  },
  seeAll: {
    color: '#999',
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
