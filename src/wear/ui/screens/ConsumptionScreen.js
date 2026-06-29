import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import BarChart from '../components/BarChart';
import ScreenHeader from '../components/ScreenHeader';
import WearCard from '../components/WearCard';
import WearScreenContainer from '../components/WearScreenContainer';
import { useWearLayoutContext } from '../hooks/useWearLayout';
import { WearColors } from '../theme/wearTheme';

const PERIODS = [
  { key: 'day', label: 'Día' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mes' },
];

export default function ConsumptionScreen({ consumption, period, onPeriodChange, onBack }) {
  const layout = useWearLayoutContext();
  const { fonts, spacing, contentWidth, radius } = layout;

  return (
    <WearScreenContainer>
      <View style={{ width: contentWidth, flex: 1 }}>
        <ScreenHeader title="Consumo" onBack={onBack} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
          <View style={[styles.tabs, { marginBottom: spacing.md, borderRadius: radius.lg }]}>
            {PERIODS.map((p) => (
              <Pressable
                key={p.key}
                onPress={() => onPeriodChange(p.key)}
                style={[styles.tab, period === p.key && styles.tabActive, { borderRadius: radius.lg - 4 }]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { fontSize: fonts.caption },
                    period === p.key && styles.tabTextActive,
                  ]}
                >
                  {p.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <WearCard style={[styles.chartCard, { padding: spacing.md, marginBottom: spacing.md, minHeight: layout.chart.barHeight + 40 }]}>
            <BarChart bars={consumption.bars} />
          </WearCard>

          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.statsGrid, { gap: spacing.xs }]}>
            <StatBox label="Total" value={`${consumption.totalGrams}g`} color={WearColors.primary} fonts={fonts} spacing={spacing} />
            <StatBox label="Promedio" value={`${consumption.dailyAverage}g`} color={WearColors.info} fonts={fonts} spacing={spacing} />
            <StatBox label="Dispens." value={String(consumption.totalFeeds)} color={WearColors.secondary} fonts={fonts} spacing={spacing} />
          </Animated.View>
        </ScrollView>
      </View>
    </WearScreenContainer>
  );
}

function StatBox({ label, value, color, fonts, spacing }) {
  return (
    <WearCard style={[styles.statBox, { padding: spacing.sm }]}>
      <Text style={[styles.statValue, { color, fontSize: fonts.subtitle }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={[styles.statLabel, { fontSize: fonts.caption - 2 }]}>{label}</Text>
    </WearCard>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: WearColors.surface,
    padding: 3,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center' },
  tabActive: { backgroundColor: WearColors.surfaceElevated },
  tabText: { color: WearColors.textMuted, fontWeight: '600' },
  tabTextActive: { color: WearColors.primary },
  chartCard: {},
  statsGrid: { flexDirection: 'row' },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontWeight: '800' },
  statLabel: { color: WearColors.textMuted, marginTop: 2 },
});
