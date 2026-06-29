import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ActionTile from '../components/ActionTile';
import StatusBadge from '../components/StatusBadge';
import WearCard from '../components/WearCard';
import WearScreenContainer from '../components/WearScreenContainer';
import { useWearLayoutContext } from '../hooks/useWearLayout';
import { WearColors } from '../theme/wearTheme';

const MAX_FOOD_CAPACITY = 1000;

export default function DashboardScreen({ feeder, isOnline, onNavigate }) {
  const layout = useWearLayoutContext();
  const { fonts, icon, spacing, contentWidth, sizeClass } = layout;
  const iconBox = layout.compactHeader ? 36 : 44;
  const foodPercent = Math.min(100, Math.round((feeder.foodLevel / MAX_FOOD_CAPACITY) * 100));

  return (
    <WearScreenContainer>
      <ScrollView
        style={[styles.scroll, { width: contentWidth }]}
        contentContainerStyle={[styles.content, { paddingBottom: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={[styles.header, { marginBottom: spacing.md, gap: spacing.sm }]}
        >
          <View
            style={[
              styles.deviceIcon,
              { width: iconBox, height: iconBox, borderRadius: iconBox / 2 },
            ]}
          >
            <Text style={{ fontSize: iconBox * 0.5 }}>🐾</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={[styles.name, { fontSize: fonts.title }]} numberOfLines={1}>
              {feeder.name}
            </Text>
            <StatusBadge online={isOnline} />
          </View>
        </Animated.View>

        <WearCard delay={80} style={[styles.heroCard, { padding: spacing.md, marginBottom: spacing.md }]}>
          <Text style={[styles.heroLabel, { fontSize: fonts.caption }]}>Nivel de alimento</Text>
          <Text style={[styles.heroValue, { fontSize: fonts.hero }]}>
            {feeder.foodLevel}
            <Text style={[styles.heroUnit, { fontSize: fonts.subtitle }]}> g</Text>
          </Text>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${foodPercent}%`,
                  backgroundColor: foodPercent < 20 ? WearColors.danger : WearColors.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.powerHint, { fontSize: fonts.caption - 1 }]}>
            {feeder.isPoweredOn ? '● Dispensador encendido' : '○ Dispensador apagado'}
          </Text>
        </WearCard>

        {(feeder.battery != null || feeder.wifiConnected != null) && (
          <WearCard delay={120} style={[styles.statsCard, { padding: spacing.md, marginBottom: spacing.md }]}>
            <View style={styles.statsRow}>
              {feeder.battery != null && (
                <>
                  <StatItem
                    icon="battery"
                    label="Batería"
                    value={`${feeder.battery}%`}
                    color={WearColors.primary}
                    iconSize={icon.sm}
                    labelSize={fonts.caption - 2}
                    valueSize={fonts.caption}
                  />
                  {feeder.wifiConnected != null && (
                    <View style={[styles.divider, { height: sizeClass === 'tiny' ? 24 : 32 }]} />
                  )}
                </>
              )}
              {feeder.wifiConnected != null && (
                <StatItem
                  icon="wifi"
                  label="WiFi"
                  value={feeder.wifiConnected ? 'Activo' : 'Off'}
                  color={WearColors.info}
                  iconSize={icon.sm}
                  labelSize={fonts.caption - 2}
                  valueSize={fonts.caption}
                />
              )}
            </View>
          </WearCard>
        )}

        {sizeClass !== 'tiny' && (
          <Text style={[styles.sectionTitle, { fontSize: fonts.caption - 1, marginBottom: spacing.sm }]}>
            Acciones
          </Text>
        )}

        <View style={styles.grid}>
          <ActionTile icon="zap" label="Alimentar" color={WearColors.primary} delay={150} onPress={() => onNavigate(1)} />
          <ActionTile
            icon="power"
            label={feeder.isPoweredOn ? 'Apagar' : 'Encender'}
            color={feeder.isPoweredOn ? WearColors.warning : WearColors.info}
            delay={200}
            onPress={() => onNavigate(2)}
          />
          <ActionTile icon="clock" label="Horarios" color={WearColors.secondary} delay={250} onPress={() => onNavigate(3)} />
          <ActionTile icon="bar-chart-2" label="Consumo" color={WearColors.info} delay={300} onPress={() => onNavigate(4)} />
        </View>
      </ScrollView>
    </WearScreenContainer>
  );
}

function StatItem({ icon, label, value, color, iconSize, labelSize, valueSize }) {
  return (
    <View style={styles.statItem}>
      <Feather name={icon} size={iconSize} color={color} />
      <Text style={[styles.statLabel, { fontSize: labelSize }]}>{label}</Text>
      <Text style={[styles.statValue, { fontSize: valueSize }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {},
  header: { flexDirection: 'row', alignItems: 'center' },
  deviceIcon: {
    backgroundColor: WearColors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: WearColors.border,
  },
  headerInfo: { flex: 1, gap: 4 },
  name: { color: WearColors.textPrimary, fontWeight: '700' },
  heroCard: { alignItems: 'center' },
  heroLabel: { color: WearColors.textSecondary, marginBottom: 4 },
  heroValue: { color: WearColors.textPrimary, fontWeight: '800' },
  heroUnit: { color: WearColors.textSecondary, fontWeight: '600' },
  progressBg: {
    width: '100%',
    height: 6,
    backgroundColor: WearColors.surface,
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  powerHint: { color: WearColors.textMuted, marginTop: 8 },
  statsCard: {},
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statLabel: { color: WearColors.textMuted },
  statValue: { color: WearColors.textPrimary, fontWeight: '700' },
  divider: { width: 1, backgroundColor: WearColors.border },
  sectionTitle: {
    color: WearColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
