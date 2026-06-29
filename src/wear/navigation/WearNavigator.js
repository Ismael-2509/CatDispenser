import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WearLayoutProvider, useWearLayoutContext } from '../ui/hooks/useWearLayout';
import PageIndicator from '../ui/components/PageIndicator';
import ConsumptionScreen from '../ui/screens/ConsumptionScreen';
import DashboardScreen from '../ui/screens/DashboardScreen';
import FeedScreen from '../ui/screens/FeedScreen';
import PowerScreen from '../ui/screens/PowerScreen';
import SchedulesScreen from '../ui/screens/SchedulesScreen';
import SettingsScreen from '../ui/screens/SettingsScreen';
import { useFeederViewModel } from '../viewmodel/useFeederViewModel';
import { WearColors } from '../ui/theme/wearTheme';

const SCREEN_IDS = ['dashboard', 'feed', 'power', 'schedules', 'consumption', 'settings'];

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
  const scrollX = useSharedValue(0);
  const pageWidth = layout.width;

  const goToPage = useCallback(
    (index) => {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setPageIndex(index);
      scrollX.value = index * pageWidth;
    },
    [pageWidth, scrollX]
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
        <Text style={[styles.errorText, { fontSize: layout.fonts.caption }]}>Sin datos del dispensador</Text>
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
        case 'settings':
          return <SettingsScreen feeder={feeder} onBack={goBack} />;
        default:
          return null;
      }
    })();

    return (
      <View style={[styles.page, { width: pageWidth }]}>
        {content}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <FlatList
        ref={flatListRef}
        data={SCREEN_IDS}
        renderItem={renderScreen}
        keyExtractor={(item) => item}
        extraData={pageWidth}
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
          const index = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
          setPageIndex(index);
          scrollX.value = index * pageWidth;
        }}
        onScroll={(e) => {
          scrollX.value = e.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
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
    paddingHorizontal: 16,
  },
});
