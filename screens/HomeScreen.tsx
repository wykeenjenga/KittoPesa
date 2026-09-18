import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { describeWeatherCode } from '../api/weather';
import { Bouncy, FadeSlideIn } from '../components/Motion';
import { METHOD_COLOR, METHOD_ICON } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { useRates } from '../contexts/RatesContext';
import { useWalletCtx } from '../contexts/WalletContext';
import { useWeather } from '../hooks/useWeather';
import type { HomeStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { METHOD_LABEL } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

export default function HomeScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const wallet = useWalletCtx();
  const { balance, transactions, openPay, setAddCardVisible, unreadCount } = wallet;
  const { weather, loading: weatherLoading } = useWeather();
  const { rates } = useRates();
  const preview = transactions.slice(0, 3);
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const eurToKes = rates ? rates.usdToKes / rates.usdToEur : null;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>Hi, {firstName} 👋</Text>
          <Text style={[styles.subGreeting, { color: colors.textMuted }]}>
            Welcome back to KittoPesa
          </Text>
        </View>
        <Bouncy
          style={[styles.iconButton, { backgroundColor: colors.surfaceAlt }]}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.text} />
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.danger }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </Bouncy>
      </View>

      <View style={[styles.weatherCard, { backgroundColor: colors.surface }]}>
        {weatherLoading ? (
          <ActivityIndicator color={colors.accent} />
        ) : weather ? (
          <>
            <Text style={styles.weatherEmoji}>{describeWeatherCode(weather.code).emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.weatherTemp, { color: colors.text }]}>
                {Math.round(weather.tempC)}°C · {describeWeatherCode(weather.code).label}
              </Text>
              <Text style={[styles.weatherLocation, { color: colors.textMuted }]}>
                {weather.locationLabel}
              </Text>
            </View>
          </>
        ) : (
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>Weather unavailable</Text>
        )}
      </View>

      <View style={[styles.balanceCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.balanceLabel, { color: colors.textMuted }]}>Available balance</Text>
        <Text style={[styles.balanceValue, { color: colors.text }]}>
          KES {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
        {rates && eurToKes && (
          <Text style={[styles.ratesLine, { color: colors.textMuted }]}>
            Live: 1 USD ≈ KES {rates.usdToKes.toFixed(2)} · 1 EUR ≈ KES {eurToKes.toFixed(2)}
          </Text>
        )}
      </View>

      <View style={styles.actionsRow}>
        <QuickAction
          icon="qr-code-outline"
          label="Pay"
          onPress={() => openPay({ method: 'mpesa', kind: 'pay' })}
        />
        <QuickAction
          icon="paper-plane-outline"
          label="Send"
          onPress={() => navigation.navigate('SendMoney')}
        />
        <QuickAction
          icon="card-outline"
          label="Add card"
          onPress={() => setAddCardVisible(true)}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Tools</Text>
      <View style={styles.toolsRow}>
        <ToolCard
          icon="swap-horizontal-outline"
          label="Convert"
          onPress={() => navigation.navigate('CurrencyConverter')}
        />
        <ToolCard
          icon="calculator-outline"
          label="Calculator"
          onPress={() => navigation.navigate('Calculator')}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent activity</Text>

      {preview.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          Nothing yet — try the Shop tab or tap Pay above to make your first payment.
        </Text>
      ) : (
        preview.map((item) => (
          <FadeSlideIn key={item.id}>
            <View style={[styles.txRow, { backgroundColor: colors.surface }]}>
              <View style={[styles.txIcon, { backgroundColor: METHOD_COLOR[item.method] }]}>
                <Ionicons name={METHOD_ICON[item.method]} size={16} color="#fff" />
              </View>
              <View style={styles.txInfo}>
                <Text style={[styles.txMerchant, { color: colors.text }]}>{item.merchant}</Text>
                <Text style={[styles.txMethod, { color: colors.textMuted }]}>
                  {METHOD_LABEL[item.method]}
                </Text>
              </View>
              <Text style={[styles.txAmount, { color: colors.danger }]}>
                - KES {item.amount.toLocaleString()}
              </Text>
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
  const { colors } = useTheme();
  return (
    <Bouncy style={styles.action} onPress={onPress}>
      <View style={[styles.actionCircle, { backgroundColor: colors.primaryButtonBg }]}>
        <Ionicons name={icon} size={20} color={colors.primaryButtonText} />
      </View>
      <Text style={[styles.actionLabel, { color: colors.text }]}>{label}</Text>
    </Bouncy>
  );
}

function ToolCard({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Bouncy style={[styles.toolCard, { backgroundColor: colors.surface }]} onPress={onPress}>
      <Ionicons name={icon} size={22} color={colors.accent} />
      <Text style={[styles.toolLabel, { color: colors.text }]}>{label}</Text>
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
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
  },
  subGreeting: {
    fontSize: 13,
    marginTop: 2,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
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
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  weatherEmoji: {
    fontSize: 32,
  },
  weatherTemp: {
    fontSize: 15,
    fontWeight: '700',
  },
  weatherLocation: {
    fontSize: 12,
    marginTop: 2,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 8,
  },
  ratesLine: {
    fontSize: 11,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  action: {
    alignItems: 'center',
    flex: 1,
  },
  actionCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  toolsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  toolCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  toolLabel: {
    fontSize: 12,
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
