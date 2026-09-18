import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import type { HomeStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'Calculator'>;

type Operator = '+' | '-' | '×' | '÷' | null;

function compute(a: number, b: number, op: Operator): number {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

function formatDisplay(value: number): string {
  if (Number.isNaN(value)) return 'Error';
  if (!Number.isFinite(value)) return 'Error';
  const rounded = Math.round(value * 1e10) / 1e10;
  return rounded.toString();
}

export default function CalculatorScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [display, setDisplay] = useState('0');
  const [previous, setPrevious] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [overwrite, setOverwrite] = useState(true);

  const inputDigit = (digit: string) => {
    if (overwrite) {
      setDisplay(digit === '.' ? '0.' : digit);
      setOverwrite(false);
      return;
    }
    if (digit === '.' && display.includes('.')) return;
    setDisplay((prev) => (prev === '0' && digit !== '.' ? digit : prev + digit));
  };

  const clear = () => {
    setDisplay('0');
    setPrevious(null);
    setOperator(null);
    setOverwrite(true);
  };

  const toggleSign = () => setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));

  const inputPercent = () => setDisplay((prev) => formatDisplay(parseFloat(prev) / 100));

  const chooseOperator = (nextOp: Exclude<Operator, null>) => {
    const current = parseFloat(display);
    if (previous !== null && operator && !overwrite) {
      const result = compute(previous, current, operator);
      setPrevious(result);
      setDisplay(formatDisplay(result));
    } else {
      setPrevious(current);
    }
    setOperator(nextOp);
    setOverwrite(true);
  };

  const equals = () => {
    if (previous === null || operator === null) return;
    const current = parseFloat(display);
    const result = compute(previous, current, operator);
    setDisplay(formatDisplay(result));
    setPrevious(null);
    setOperator(null);
    setOverwrite(true);
  };

  const buttons: { label: string; type: 'fn' | 'op' | 'num' | 'eq'; span?: number }[] = [
    { label: 'C', type: 'fn' },
    { label: '+/-', type: 'fn' },
    { label: '%', type: 'fn' },
    { label: '÷', type: 'op' },
    { label: '7', type: 'num' },
    { label: '8', type: 'num' },
    { label: '9', type: 'num' },
    { label: '×', type: 'op' },
    { label: '4', type: 'num' },
    { label: '5', type: 'num' },
    { label: '6', type: 'num' },
    { label: '-', type: 'op' },
    { label: '1', type: 'num' },
    { label: '2', type: 'num' },
    { label: '3', type: 'num' },
    { label: '+', type: 'op' },
    { label: '0', type: 'num', span: 2 },
    { label: '.', type: 'num' },
    { label: '=', type: 'eq' },
  ];

  const press = (label: string, type: string) => {
    if (type === 'num') return inputDigit(label);
    if (label === 'C') return clear();
    if (label === '+/-') return toggleSign();
    if (label === '%') return inputPercent();
    if (label === '=') return equals();
    return chooseOperator(label as Exclude<Operator, null>);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Calculator" onBack={() => navigation.goBack()} />
      <View style={styles.displayWrap}>
        <Text style={[styles.display, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>
      <View style={styles.grid}>
        {buttons.map((b) => (
          <TouchableOpacity
            key={b.label}
            onPress={() => press(b.label, b.type)}
            style={[
              styles.button,
              b.span === 2 && styles.buttonWide,
              {
                backgroundColor:
                  b.type === 'op' || b.type === 'eq'
                    ? colors.accent
                    : b.type === 'fn'
                    ? colors.surfaceAlt
                    : colors.surface,
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: b.type === 'op' || b.type === 'eq' ? '#fff' : colors.text,
                },
              ]}
            >
              {b.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  displayWrap: {
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: 'flex-end',
  },
  display: {
    fontSize: 56,
    fontWeight: '300',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  button: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWide: {
    width: '48%',
    aspectRatio: 2.15,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
  },
});
