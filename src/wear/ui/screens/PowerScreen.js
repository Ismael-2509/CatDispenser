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

  return (
    <WearScreenContainer>
      <View style={{ width: contentWidth, flex: 1 }}>
        <ScreenHeader title="Encender / Apagar" onBack={onBack} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={[styles.switchSection, { marginVertical: layout.compactHeader ? spacing.sm : spacing.lg, gap: spacing.sm }]}
          >
            <Text style={[styles.stateLabel, { fontSize: fonts.title }]}>
              {feeder.isPoweredOn ? 'Encendido' : 'Apagado'}
            </Text>
            <WearSwitch value={feeder.isPoweredOn} onToggle={onTogglePower} activeColor={WearColors.primary} />
          </Animated.View>

          <WearCard delay={100} style={[styles.card, { padding: spacing.md, marginBottom: spacing.md }]}>
            <Row label="Modo automático" labelSize={fonts.body} trailing={
              <WearSwitch value={feeder.autoMode} onToggle={onToggleAuto} activeColor={WearColors.secondary} />
            } />
          </WearCard>

          <WearCard delay={200} style={[styles.card, { padding: spacing.md }]}>
            <InfoRow label="Batería" value={`${feeder.battery}%`} labelSize={fonts.caption} valueSize={fonts.caption} />
            <InfoRow label="Estado" value={isOnline ? 'Operativo' : 'Sin conexión'} highlight={isOnline} labelSize={fonts.caption} valueSize={fonts.caption} />
            <InfoRow label="Alimento restante" value={`${feeder.foodLevel} g`} labelSize={fonts.caption} valueSize={fonts.caption} />
            <InfoRow label="Firmware" value={feeder.firmwareVersion} last labelSize={fonts.caption} valueSize={fonts.caption} />
          </WearCard>
        </ScrollView>
      </View>
    </WearScreenContainer>
  );
}

function Row({ label, trailing, labelSize }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { fontSize: labelSize }]}>{label}</Text>
      {trailing}
    </View>
  );
}

function InfoRow({ label, value, highlight, last, labelSize, valueSize }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoBorder]}>
      <Text style={[styles.infoLabel, { fontSize: labelSize }]}>{label}</Text>
      <Text style={[styles.infoValue, { fontSize: valueSize }, highlight && { color: WearColors.primary }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
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
