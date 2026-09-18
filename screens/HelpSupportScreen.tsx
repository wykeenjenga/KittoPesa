import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import type { ProfileStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<ProfileStackParamList, 'HelpSupport'>;

const FAQS = [
  {
    q: 'Is this a real payments app?',
    a: 'No — KittoPesa is a demo. No real money, cards, or M-Pesa transactions are processed.',
  },
  {
    q: 'Where do product prices come from?',
    a: 'Shop uses a real public product catalog, converted from USD to KES using live exchange rates.',
  },
  {
    q: 'Can I use my real card?',
    a: 'You can add a card for the demo UI, but nothing is validated, stored remotely, or charged.',
  },
  {
    q: 'How do I reset my demo data?',
    a: 'Go to Profile → Settings → Reset demo data.',
  },
];

export default function HelpSupportScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Help & support" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>FAQ</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {FAQS.map((item, i) => (
            <View key={item.q}>
              <TouchableOpacity
                style={styles.faqRow}
                onPress={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <Text style={[styles.question, { color: colors.text }]}>{item.q}</Text>
                <Ionicons
                  name={openIndex === i ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
              {openIndex === i && (
                <Text style={[styles.answer, { color: colors.textMuted }]}>{item.a}</Text>
              )}
              {i < FAQS.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 },
  card: { borderRadius: 16, paddingHorizontal: 16 },
  faqRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  question: { fontSize: 14, fontWeight: '600', flex: 1, marginRight: 10 },
  answer: { fontSize: 13, paddingBottom: 14, lineHeight: 19 },
  divider: { height: StyleSheet.hairlineWidth },
});
