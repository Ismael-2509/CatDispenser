import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useWearLayoutContext } from '../hooks/useWearLayout';
import { WearColors } from '../theme/wearTheme';

const PARTICLES = [0, 1, 2, 3, 4];

function Particle({ index, playing, particleSize, spread }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (playing) {
      progress.value = 0;
      progress.value = withDelay(
        index * 80,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) }),
            withTiming(0, { duration: 0 })
          ),
          2,
          false
        )
      );
    }
  }, [playing, index, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateY: progress.value * spread },
      { translateX: (index - 2) * 8 * progress.value },
      { scale: 1 - progress.value * 0.5 },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: `${20 + index * 15}%`,
          width: particleSize,
          height: particleSize,
          borderRadius: particleSize / 2,
          backgroundColor: index % 2 ? WearColors.secondary : WearColors.primary,
        },
        style,
      ]}
    />
  );
}

export default function FeedAnimation({ playing }) {
  const layout = useWearLayoutContext();
  const particleSize = layout.sizeClass === 'tiny' ? 6 : 8;
  const spread = layout.sizeClass === 'tiny' ? 45 : 60;

  if (!playing) return null;

  return (
    <View style={[styles.container, { height: spread + 20 }]} pointerEvents="none">
      {PARTICLES.map((i) => (
        <Particle key={i} index={i} playing={playing} particleSize={particleSize} spread={spread} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  particle: {
    position: 'absolute',
    top: 10,
  },
});
