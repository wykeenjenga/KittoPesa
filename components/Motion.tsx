import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

// Properties that affect how a box is sized/placed by its OWN parent.
// Everything else (alignItems, justifyContent, padding, border*,
// backgroundColor, borderRadius...) is layout/visual for a box's CHILDREN
// and must stay off the outer Pressable — otherwise e.g. alignItems:
// 'center' makes Pressable shrink-wrap its single child instead of
// stretching it to fill, which is invisible on filled buttons but shows up
// as a second, wrongly-sized box on border-only ones.
const SIZE_KEYS = [
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'flex',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'alignSelf',
  'aspectRatio',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
] as const;

function pickSizeStyle(style: StyleProp<ViewStyle>): ViewStyle {
  const flat = StyleSheet.flatten(style) ?? {};
  const picked: ViewStyle = {};
  for (const key of SIZE_KEYS) {
    if (flat[key] !== undefined) {
      (picked as Record<string, unknown>)[key] = flat[key];
    }
  }
  return picked;
}

/** Fades and slides content in from below on mount. Used for list rows. */
export function FadeSlideIn({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

/** Fades and scales content in — used when a different card becomes the hero card. */
export function ScaleIn({
  children,
  style,
  scaleFrom = 0.92,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleFrom?: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(scaleFrom)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}

/** A pressable that scales down slightly on press for tactile feedback. */
export function Bouncy({
  children,
  onPress,
  style,
  disabled,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 50 }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  return (
    // Only sizing props (width, flex, alignSelf, margin...) go on Pressable,
    // so it's correctly sized by its own parent — e.g. width: '100%' has
    // something to resolve against instead of collapsing. Visual/layout
    // props (alignItems, padding, border, background) stay on the inner
    // Animated.View only, so it always fills Pressable exactly rather than
    // shrink-wrapping to its own content inside it.
    <Pressable
      style={pickSizeStyle(style)}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      disabled={disabled}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

/** A view that pulses (scale up then back) whenever `trigger` changes. */
export function usePulse(trigger: unknown) {
  const scale = useRef(new Animated.Value(1)).current;
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.06, duration: 120, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }),
    ]).start();
  }, [trigger]);

  return scale;
}

/** Springs in from scale 0 — used for the success checkmark. */
export function PopIn({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 140,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
  );
}
