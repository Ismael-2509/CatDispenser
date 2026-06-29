import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, useAnimatedStyle, withDelay, withSpring } from 'react-native-reanimated';
import { useWearLayoutContext } from '../hooks/useWearLayout';
import { WearColors, WearTypography } from '../theme/wearTheme';

function AnimatedBar({ height, maxHeight, color, delay, label, barWidth, fontSize }) {
  const animatedStyle = useAnimatedStyle(() => ({
    height: withDelay(delay, withSpring(height, { damping: 14, stiffness: 90 })),
  }));

  return (
    <View style={styles.barCol}>
      <View style={[styles.barTrack, { height: maxHeight, width: barWidth }]}>
        <Animated.View style={[styles.barFill, { backgroundColor: color, width: barWidth }, animatedStyle]} />
      </View>
      <Text style={[styles.barLabel, { fontSize }]}>{label}</Text>
    </View>
  );
}

export default function BarChart({ bars, primaryColor = WearColors.primary, secondaryColor = WearColors.secondary }) {
  const layout = useWearLayoutContext();
  const maxGrams = Math.max(...bars.map((b) => b.grams), 1);
  const maxHeight = layout.chart.barHeight;
  const barWidth = layout.chart.barWidth;
  const labelSize = layout.sizeClass === 'tiny' ? 8 : 9;

  return (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.container}>
      {bars.map((bar, index) => {
        const ratio = bar.grams / maxGrams;
        const color = index % 2 === 0 ? primaryColor : secondaryColor;
        return (
          <AnimatedBar
            key={bar.label}
            label={bar.label}
            height={Math.max(ratio * maxHeight, bar.grams > 0 ? 8 : 4)}
            maxHeight={maxHeight}
            color={color}
            delay={index * 60}
            barWidth={barWidth}
            fontSize={labelSize}
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 8,
  },
  barCol: { alignItems: 'center', flex: 1 },
  barTrack: {
    justifyContent: 'flex-end',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: WearColors.surface,
  },
  barFill: {
    borderRadius: 8,
    minHeight: 4,
    opacity: 0.9,
  },
  barLabel: {
    color: WearColors.textMuted,
    marginTop: 4,
    fontWeight: '500',
  },
});
