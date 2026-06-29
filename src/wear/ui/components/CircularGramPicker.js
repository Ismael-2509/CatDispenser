import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useWearLayoutContext } from '../hooks/useWearLayout';
import { GRAM_OPTIONS, WearColors } from '../theme/wearTheme';

export default function CircularGramPicker({ value, onChange }) {
  const layout = useWearLayoutContext();
  const { dial, fonts } = layout;

  const currentIndex = GRAM_OPTIONS.indexOf(value);
  const safeIndex = currentIndex >= 0 ? currentIndex : 2;

  const decrement = () => {
    if (safeIndex > 0) onChange(GRAM_OPTIONS[safeIndex - 1]);
  };

  const increment = () => {
    if (safeIndex < GRAM_OPTIONS.length - 1) onChange(GRAM_OPTIONS[safeIndex + 1]);
  };

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={[styles.container, { gap: layout.spacing.sm, marginVertical: layout.spacing.md }]}
    >
      <Pressable
        onPress={decrement}
        style={[styles.controlBtn, { width: dial.control, height: dial.control, borderRadius: dial.control / 2 }]}
        android_ripple={{ color: '#ffffff15' }}
      >
        <Feather name="minus" size={layout.icon.md} color={WearColors.textPrimary} />
      </Pressable>

      <View
        style={[
          styles.dial,
          {
            width: dial.size,
            height: dial.size,
            borderRadius: dial.size / 2,
          },
        ]}
      >
        <Animated.Text
          key={value}
          entering={ZoomIn.duration(250)}
          style={[styles.grams, { fontSize: dial.grams }]}
        >
          {value}
        </Animated.Text>
        <Text style={[styles.unit, { fontSize: fonts.caption - 1 }]}>gramos</Text>
        <View style={styles.dots}>
          {GRAM_OPTIONS.map((g) => (
            <View
              key={g}
              style={[
                styles.dot,
                g === value && [styles.dotActive, { width: layout.sizeClass === 'tiny' ? 6 : 8 }],
              ]}
            />
          ))}
        </View>
      </View>

      <Pressable
        onPress={increment}
        style={[styles.controlBtn, { width: dial.control, height: dial.control, borderRadius: dial.control / 2 }]}
        android_ripple={{ color: '#ffffff15' }}
      >
        <Feather name="plus" size={layout.icon.md} color={WearColors.textPrimary} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtn: {
    backgroundColor: WearColors.surface,
    borderWidth: 1,
    borderColor: WearColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dial: {
    backgroundColor: WearColors.surfaceElevated,
    borderWidth: 2,
    borderColor: WearColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grams: { fontWeight: '800', color: WearColors.primary },
  unit: { color: WearColors.textSecondary, marginTop: -2 },
  dots: { flexDirection: 'row', gap: 3, marginTop: 4 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: WearColors.border },
  dotActive: { backgroundColor: WearColors.primary },
});
