import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Bouncy } from '../components/Motion';
import ScreenHeader from '../components/ScreenHeader';
import WalletCardView from '../components/WalletCardView';
import { useWalletCtx } from '../contexts/WalletContext';
import type { WalletStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<WalletStackParamList, 'CardDetail'>;

export default function CardDetailScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const { cards, toggleCardFrozen, removeCard, setDefaultCard } = useWalletCtx();
  const card = cards.find((c) => c.id === route.params.cardId);

  if (!card) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title="Card" onBack={() => navigation.goBack()} />
        <Text style={{ color: colors.textMuted, padding: 20 }}>This card was removed.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Card details" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <WalletCardView card={card} style={styles.card} />

        <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
          <View style={styles.row}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>Freeze card</Text>
            <Switch value={!!card.frozen} onValueChange={() => toggleCardFrozen(card.id)} />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.row}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>Default card</Text>
            {card.isDefault ? (
              <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 12 }}>
                Default
              </Text>
            ) : (
              <TouchableOpacity onPress={() => setDefaultCard(card.id)}>
                <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 12 }}>
                  Set as default
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {card.frozen && (
          <Text style={[styles.frozenNote, { color: colors.textMuted }]}>
            This card is frozen — payments with it are paused in this demo.
          </Text>
        )}

        <Bouncy
          style={[styles.removeButton, { borderColor: colors.danger }]}
          onPress={() => {
            removeCard(card.id);
            navigation.goBack();
          }}
        >
          <Ionicons name="trash-outline" size={16} color={colors.danger} />
          <Text style={{ color: colors.danger, fontWeight: '700', marginLeft: 6 }}>
            Remove card
          </Text>
        </Bouncy>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  card: { width: '100%', marginRight: 0 },
  settingsCard: { borderRadius: 16, paddingHorizontal: 16, marginTop: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  divider: { height: StyleSheet.hairlineWidth },
  frozenNote: { fontSize: 12, marginTop: 10, textAlign: 'center' },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 30,
  },
});
