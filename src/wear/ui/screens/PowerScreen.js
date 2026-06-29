import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ScreenHeader from '../components/ScreenHeader';
import WearCard from '../components/WearCard';
import WearScreenContainer from '../components/WearScreenContainer';
import WearSwitch from '../components/WearSwitch';
import { useWearLayoutContext } from '../hooks/useWearLayout';
import { WearColors } from '../theme/wearTheme';

export default function PowerScreen({ feeder, isOnline, onTogglePower, onToggleAuto, onBack }) {
  const layout = useWearLayoutContext();
  const { fonts, spacing, contentWidth } = layout;

  const infoRows = [
    { label: 'Estado', value: isOnline ? 'En línea' : 'Sin conexión', highlight: isOnline },
    { label: 'Alimento', value: `${feeder.foodLevel} g` },
    ...(feeder.battery != null ? [{ label: 'Batería', value: `${feeder.battery}%` }] : []),
    ...(feeder.firmwareVersion ? [{ label: 'Firmware', value: feeder.firmwareVersion }] : []),
  ];

  return (
    <WearScreenContainer>
      <View style={{ width: contentWidth, flex: 1 }}>
        <ScreenHeader title="Encender / Apagar" onBack={onBack} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={[
              styles.switchSection,
              { marginVertical: layout.compactHeader ? spacing.sm : spacing.lg, gap: spacing.sm },
            ]}
          >
            <Text style={[styles.stateLabel, { fontSize: fonts.title }]}>
              {feeder.isPoweredOn ? 'Encendido' : 'Apagado'}
            </Text>
            <WearSwitch value={feeder.isPoweredOn} onToggle={onTogglePower} activeColor={WearColors.primary} />
          </Animated.View>

          {feeder.hasAutoMode && (
            <WearCard delay={100} style={[styles.card, { padding: spacing.md, marginBottom: spacing.md }]}>
              <View style={styles.row}>
                <Text style={[styles.rowLabel, { fontSize: fonts.body }]}>Modo automático</Text>
                <WearSwitch
                  value={feeder.autoMode}
                  onToggle={onToggleAuto}
                  activeColor={WearColors.secondary}
                />
              </View>
            </WearCard>
          )}

          <WearCard delay={200} style={[styles.card, { padding: spacing.md }]}>
            {infoRows.map((row, index) => (
              <View
                key={row.label}
                style={[styles.infoRow, index < infoRows.length - 1 && styles.infoBorder]}
              >
                <Text style={[styles.infoLabel, { fontSize: fonts.caption }]}>{row.label}</Text>
                <Text
                  style={[
                    styles.infoValue,
                    { fontSize: fonts.caption },
                    row.highlight && { color: WearColors.primary },
                  ]}
                  numberOfLines={1}
                >
                  {row.value}
                </Text>
              </View>
            ))}
          </WearCard>
        </ScrollView>
      </View>
    </WearScreenContainer>
  );
}

const styles = StyleSheet.create({
  switchSection: { alignItems: 'center' },
  stateLabel: { color: WearColors.textPrimary, fontWeight: '700' },
  card: {},
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLabel: { color: WearColors.textPrimary },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, gap: 8 },
  infoBorder: { borderBottomWidth: 1, borderBottomColor: WearColors.border },
  infoLabel: { color: WearColors.textSecondary, flex: 1 },
  infoValue: { color: WearColors.textPrimary, fontWeight: '700', flexShrink: 1, textAlign: 'right' },
});
