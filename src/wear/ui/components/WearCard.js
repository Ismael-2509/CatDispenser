import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { WearColors, WearRadius, WearShadow } from '../theme/wearTheme';

export default function WearCard({ children, style, delay = 0, onPress, glowColor }) {
  const content = (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400).springify()}
      style={[styles.card, glowColor && WearShadow.glow(glowColor), style]}
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: 'rgba(255,255,255,0.08)', borderless: false }}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: WearColors.surfaceElevated,
    borderRadius: WearRadius.lg,
    borderWidth: 1,
    borderColor: WearColors.border,
    ...WearShadow.card,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
});
