import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { useWearLayoutContext } from '../hooks/useWearLayout';
import { WearColors } from '../theme/wearTheme';

export default function ScreenHeader({ title, onBack }) {
  const layout = useWearLayoutContext();
  const { fonts, icon, compactHeader, spacing } = layout;

  return (
    <Animated.View
      entering={FadeInLeft.duration(350)}
      style={[styles.header, { paddingBottom: compactHeader ? spacing.xs : spacing.sm }]}
    >
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
          <Feather name="chevron-left" size={icon.md + 2} color={WearColors.primary} />
        </Pressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
      <Text
        style={[styles.title, { fontSize: fonts.subtitle }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {title}
      </Text>
      <View style={styles.backPlaceholder} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  backBtn: { width: 28, alignItems: 'flex-start' },
  backPlaceholder: { width: 28 },
  title: {
    color: WearColors.textPrimary,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
});
