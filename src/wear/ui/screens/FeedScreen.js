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
      <View style={[styles.wrapper, { width: contentWidth }]}>
        <FeedAnimation playing={showAnimation} />
        <ScreenHeader title="Alimentar" onBack={onBack} />

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.sm }}
        >
          <CircularGramPicker value={grams} onChange={onGramsChange} />

          {!feeder.isPoweredOn && (
            <Text style={[styles.hint, { fontSize: fonts.caption, marginBottom: spacing.sm }]}>
              Enciende el dispensador para alimentar
            </Text>
          )}

          <Animated.View entering={FadeIn.delay(200).duration(400)}>
            <WearCard style={[styles.lastCard, { padding: spacing.md }]}>
              <Text style={[styles.lastTitle, { fontSize: fonts.caption }]}>Última porción</Text>
              {lastFeed ? (
                <>
                  <Text style={[styles.lastGrams, { fontSize: fonts.value }]}>{lastFeed.grams} g</Text>
                  <Text style={[styles.lastMeta, { fontSize: fonts.caption - 1 }]}>
                    {formatDateTime(lastFeed.timestamp)}
                  </Text>
                </>
              ) : (
                <Text style={[styles.lastMeta, { fontSize: fonts.caption }]}>Sin registros recientes</Text>
              )}
            </WearCard>
          </Animated.View>
        </ScrollView>

        <View style={[styles.footer, { paddingVertical: spacing.sm }]}>
          <PrimaryButton
            label="Dispensar ahora"
            onPress={onFeed}
            disabled={!canFeed}
            loading={feeding}
          />
        </View>
      </View>
    </WearScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  scroll: { flex: 1 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: WearColors.border,
  },
  hint: { color: WearColors.warning, textAlign: 'center' },
  lastCard: { marginTop: 8 },
  lastTitle: { color: WearColors.textSecondary, marginBottom: 4 },
  lastGrams: { color: WearColors.primary, fontWeight: '800' },
  lastMeta: { color: WearColors.textMuted, marginTop: 2 },
});
