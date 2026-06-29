import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WearLayoutProvider, useWearLayoutContext } from '../ui/hooks/useWearLayout';
import PageIndicator from '../ui/components/PageIndicator';
import ConsumptionScreen from '../ui/screens/ConsumptionScreen';
import DashboardScreen from '../ui/screens/DashboardScreen';
import FeedScreen from '../ui/screens/FeedScreen';
import PowerScreen from '../ui/screens/PowerScreen';
import SchedulesScreen from '../ui/screens/SchedulesScreen';
import { useFeederViewModel } from '../viewmodel/useFeederViewModel';
import { WearColors } from '../ui/theme/wearTheme';

const SCREEN_IDS = ['dashboard', 'feed', 'power', 'schedules', 'consumption'];

export default function WearNavigator() {
  return (
    <WearLayoutProvider>
      <WearNavigatorContent />
    </WearLayoutProvider>
  );
}

function WearNavigatorContent() {
  const layout = useWearLayoutContext();
  const {
    feeder,
    isOnline,
    loading,
    consumption,
    consumptionPeriod,
    setConsumptionPeriod,
    togglePower,
    feed,
    toggleAutoMode,
    addSchedule,
    toggleSchedule,
  } = useFeederViewModel();

  const [pageIndex, setPageIndex] = useState(0);
  const [grams, setGrams] = useState(20);
  const [feeding, setFeeding] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const flatListRef = useRef(null);
  const pageWidth = layout.width;

  const goToPage = useCallback(
    (index) => {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setPageIndex(index);
    },
    []
  );

  const goBack = useCallback(() => goToPage(0), [goToPage]);

  const handleFeed = useCallback(async () => {
    if (!feeder?.isPoweredOn || feeding) return;
    setFeeding(true);
    setShowAnimation(true);
    feed(grams);
    setTimeout(() => {
      setFeeding(false);
      setShowAnimation(false);
    }, 1600);
  }, [feeder, feeding, feed, grams]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color={WearColors.primary} />
        <Text style={[styles.loadingText, { fontSize: layout.fonts.caption }]}>Conectando...</Text>
      </View>
    );
  }

  if (!feeder) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.errorText, { fontSize: layout.fonts.caption }]}>
          Sin datos del dispensador
        </Text>
        <Text style={[styles.errorHint, { fontSize: layout.fonts.caption - 1 }]}>
          Verifica Firebase y que el ESP32 esté activo
        </Text>
      </View>
    );
  }

  const renderScreen = ({ item }) => {
    const content = (() => {
      switch (item) {
        case 'dashboard':
          return <DashboardScreen feeder={feeder} isOnline={isOnline} onNavigate={goToPage} />;
        case 'feed':
          return (
            <FeedScreen
              feeder={feeder}
              grams={grams}
              onGramsChange={setGrams}
              onFeed={handleFeed}
              feeding={feeding}
              showAnimation={showAnimation}
              onBack={goBack}
            />
          );
        case 'power':
          return (
            <PowerScreen
              feeder={feeder}
              isOnline={isOnline}
              onTogglePower={togglePower}
              onToggleAuto={toggleAutoMode}
              onBack={goBack}
            />
          );
        case 'schedules':
          return (
            <SchedulesScreen
              feeder={feeder}
              onToggleSchedule={toggleSchedule}
              onAddSchedule={addSchedule}
              onBack={goBack}
            />
          );
        case 'consumption':
          return (
            <ConsumptionScreen
              consumption={consumption}
              period={consumptionPeriod}
              onPeriodChange={setConsumptionPeriod}
              onBack={goBack}
            />
          );
        default:
          return null;
      }
    })();

    return <View style={[styles.page, { width: pageWidth }]}>{content}</View>;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <FlatList
        ref={flatListRef}
        data={SCREEN_IDS}
        renderItem={renderScreen}
        keyExtractor={(item) => item}
        extraData={{ pageWidth, pageIndex, feeder, feeding }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        decelerationRate="fast"
        snapToInterval={pageWidth}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: pageWidth,
          offset: pageWidth * index,
          index,
        })}
        onMomentumScrollEnd={(e) => {
          setPageIndex(Math.round(e.nativeEvent.contentOffset.x / pageWidth));
        }}
      />

      {layout.showPageIndicator && (
        <PageIndicator count={SCREEN_IDS.length} activeIndex={pageIndex} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WearColors.background,
  },
  page: { flex: 1 },
  centered: {
    flex: 1,
    backgroundColor: WearColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 8,
    color: WearColors.textSecondary,
    fontWeight: '600',
  },
  errorText: {
    color: WearColors.danger,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorHint: {
    color: WearColors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
});
