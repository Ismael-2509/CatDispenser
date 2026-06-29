import { StyleSheet, Text, View } from 'react-native';
import { useWearLayoutContext } from '../hooks/useWearLayout';
import { WearColors } from '../theme/wearTheme';

export default function StatusBadge({ online }) {
  const layout = useWearLayoutContext();

  return (
    <View style={[styles.badge, { backgroundColor: online ? '#4ADE8022' : '#F8717122' }]}>
      <View style={[styles.dot, { backgroundColor: online ? WearColors.primary : WearColors.danger }]} />
      <Text style={[styles.text, { fontSize: layout.fonts.caption - 1, color: online ? WearColors.primary : WearColors.danger }]}>
        {online ? 'Conectado' : 'Desconectado'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 6,
    alignSelf: 'flex-start',
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { fontWeight: '700' },
});
