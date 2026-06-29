import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import CircularGramPicker from '../components/CircularGramPicker';
import FeedAnimation from '../components/FeedAnimation';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import WearCard from '../components/WearCard';
import WearScreenContainer from '../components/WearScreenContainer';
import { formatDateTime } from '../../model/FeederModel';
import { useWearLayoutContext } from '../hooks/useWearLayout';
import { WearColors } from '../theme/wearTheme';

export default function FeedScreen({
  feeder,
  grams,
  onGramsChange,
  onFeed,
  feeding,
  showAnimation,
  onBack,
}) {
  const layout = useWearLayoutContext();
  const { fonts, spacing, contentWidth } = layout;
  const lastFeed = feeder.lastFeed;
  const canFeed = feeder.isPoweredOn && !feeding;

  return (
    <WearScreenContainer>
      <View style={{ width: contentWidth, flex: 1 }}>
        <FeedAnimation playing={showAnimation} />
        <ScreenHeader title="Alimentar" onBack={onBack} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
          <CircularGramPicker value={grams} onChange={onGramsChange} />

          <PrimaryButton label="Dispensar ahora" onPress={onFeed} disabled={!canFeed} loading={feeding} />

          {!feeder.isPoweredOn && (
            <Text style={[styles.hint, { fontSize: fonts.caption, marginTop: spacing.sm }]}>
              Enciende el dispensador para alimentar
            </Text>
          )}

          <Animated.View entering={FadeIn.delay(200).duration(400)}>
            <WearCard style={[styles.lastCard, { padding: spacing.md, marginTop: spacing.lg }]}>
              <Text style={[styles.lastTitle, { fontSize: fonts.caption }]}>Última porción</Text>
              {lastFeed ? (
                <>
                  <Text style={[styles.lastGrams, { fontSize: fonts.value }]}>{lastFeed.grams} g</Text>
                  <Text style={[styles.lastMeta, { fontSize: fonts.caption - 1 }]}>{formatDateTime(lastFeed.timestamp)}</Text>
                  <Text style={[styles.lastLabel, { fontSize: fonts.caption - 1 }]} numberOfLines={2}>{lastFeed.label}</Text>
                </>
              ) : (
                <Text style={[styles.lastMeta, { fontSize: fonts.caption }]}>Sin registros recientes</Text>
              )}
            </WearCard>
          </Animated.View>
        </ScrollView>
      </View>
    </WearScreenContainer>
  );
}

const styles = StyleSheet.create({
  hint: { color: WearColors.warning, textAlign: 'center' },
  lastCard: {},
  lastTitle: { color: WearColors.textSecondary, marginBottom: 4 },
  lastGrams: { color: WearColors.primary, fontWeight: '800' },
  lastMeta: { color: WearColors.textMuted, marginTop: 2 },
  lastLabel: { color: WearColors.textSecondary, marginTop: 4 },
});
