import { StyleSheet, View } from 'react-native';
import { useWearLayoutContext } from '../hooks/useWearLayout';
import { WearColors } from '../theme/wearTheme';

export default function PageIndicator({ count, activeIndex }) {
  const layout = useWearLayoutContext();
  const dotSize = layout.sizeClass === 'small' ? 5 : 6;

  return (
    <View style={[styles.container, { paddingVertical: layout.spacing.xs }]}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              width: index === activeIndex ? dotSize * 2.5 : dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              opacity: index === activeIndex ? 1 : 0.35,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    backgroundColor: WearColors.primary,
  },
});
