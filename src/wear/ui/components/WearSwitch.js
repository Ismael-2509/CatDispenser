import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useWearLayoutContext } from '../hooks/useWearLayout';
import { WearColors } from '../theme/wearTheme';

export default function WearSwitch({ value, onToggle, activeColor = WearColors.primary }) {
  const layout = useWearLayoutContext();
  const scale = layout.scale;
  const trackWidth = Math.round(56 * scale);
  const trackHeight = Math.round(28 * scale);
  const thumbSize = Math.round(22 * scale);
  const travel = trackWidth - thumbSize - 6;

  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, { damping: 15, stiffness: 120 });
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [WearColors.surface, activeColor]
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * travel }],
  }));

  return (
    <Pressable onPress={onToggle} android_ripple={{ color: '#ffffff10' }} hitSlop={8}>
      <Animated.View
        style={[
          styles.track,
          trackStyle,
          { width: trackWidth, height: trackHeight, borderRadius: trackHeight / 2 },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            thumbStyle,
            { width: thumbSize, height: thumbSize, borderRadius: thumbSize / 2 },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    padding: 3,
    borderWidth: 1,
    borderColor: WearColors.border,
  },
  thumb: {
    backgroundColor: WearColors.textPrimary,
  },
});
