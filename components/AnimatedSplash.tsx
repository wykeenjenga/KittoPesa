import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const SIZE = 120;

/**
 * A brief animated intro: a ring pops and pulses in, the logo scales into
 * the center, then the wordmark slides up before the whole thing fades to
 * reveal the app underneath (which is already mounted and loading data).
 *
 * Deliberately uses only Animated.View transforms/opacity — no animated SVG
 * props (e.g. Animated.createAnimatedComponent(Circle) with strokeDashoffset)
 * which is unreliable on react-native-web and was crashing the app on load.
 */
export default function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const { colors } = useTheme();
  const ringScale = useRef(new Animated.Value(0.5)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(12)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(ringScale, { toValue: 1, friction: 6, useNativeDriver: true }),
        Animated.timing(ringOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 260, useNativeDriver: true }),
        Animated.spring(pulse, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.spring(textTranslate, { toValue: 0, friction: 7, useNativeDriver: true }),
      ]),
      Animated.delay(400),
      Animated.timing(containerOpacity, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onFinish();
    });
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        { backgroundColor: colors.background, opacity: containerOpacity },
      ]}
    >
      <View style={styles.stack}>
        <Animated.View
          style={[
            styles.ring,
            {
              borderColor: colors.accent,
              opacity: ringOpacity,
              transform: [{ scale: Animated.multiply(ringScale, pulse) }],
            },
          ]}
        />
        <Animated.Text
          style={[
            styles.emoji,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          🐾💰
        </Animated.Text>
      </View>
      <Animated.Text
        style={[
          styles.wordmark,
          {
            color: colors.text,
            opacity: textOpacity,
            transform: [{ translateY: textTranslate }],
          },
        ]}
      >
        KittoPesa
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    elevation: 100,
  },
  stack: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 5,
  },
  emoji: {
    fontSize: 40,
  },
  wordmark: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
