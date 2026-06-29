import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useWearLayoutContext } from '../hooks/useWearLayout';
import { WearColors, WearShadow } from '../theme/wearTheme';

export default function PrimaryButton({
  label,
  onPress,
  color = WearColors.primary,
  disabled = false,
  loading = false,
  textColor = '#0F1115',
}) {
  const layout = useWearLayoutContext();
  const { button, fonts, radius } = layout;

  return (
    <Animated.View entering={FadeIn.duration(300)}>
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        delayPressIn={120}
        android_ripple={{ color: 'rgba(0,0,0,0.15)' }}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: color,
            opacity: disabled ? 0.4 : 1,
            minHeight: button.minHeight,
            paddingVertical: button.paddingVertical,
            borderRadius: radius.xl,
          },
          pressed && !disabled && styles.pressed,
          WearShadow.glow(color),
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <Text
            style={[styles.label, { color: textColor, fontSize: fonts.button }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {label}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { transform: [{ scale: 0.97 }] },
  label: { fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
});
