import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useWearLayoutContext } from '../hooks/useWearLayout';
import { WearColors, WearRadius, WearShadow } from '../theme/wearTheme';

export default function ActionTile({ icon, label, color, onPress, delay = 0 }) {
  const layout = useWearLayoutContext();
  const { tile, fonts, icon: iconSizes, radius } = layout;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
      style={({ pressed }) => [
        styles.wrapper,
        { width: tile.width, marginBottom: layout.spacing.sm },
        pressed && styles.pressed,
      ]}
    >
      <Animated.View
        entering={FadeInDown.delay(delay).duration(450).springify()}
        style={[
          styles.tile,
          {
            minHeight: tile.minHeight,
            paddingVertical: tile.padding,
            borderRadius: radius.lg,
          },
          WearShadow.glow(color),
        ]}
      >
        <View
          style={[
            styles.iconCircle,
            {
              width: tile.iconCircle,
              height: tile.iconCircle,
              borderRadius: tile.iconCircle / 2,
              backgroundColor: `${color}22`,
            },
          ]}
        >
          <Feather name={icon} size={iconSizes.lg} color={color} />
        </View>
        <Text style={[styles.label, { fontSize: fonts.caption }]} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  pressed: { opacity: 0.85, transform: [{ scale: 0.96 }] },
  tile: {
    backgroundColor: WearColors.surfaceElevated,
    borderWidth: 1,
    borderColor: WearColors.border,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  label: {
    color: WearColors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
});
