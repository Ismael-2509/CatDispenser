import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import WearApp from '../wear/WearApp';
import { isWatchDevice, isWatchDimensions } from '../utils/isWatchDevice';
import { WearColors } from '../wear/ui/theme/wearTheme';

export default function Page() {
  const [screenMode, setScreenMode] = useState(null);

  useEffect(() => {
    let mounted = true;

    const detectMode = async (event) => {
      const { width, height } = event?.window ?? Dimensions.get('window');
      const isWatch = (await isWatchDevice()) || isWatchDimensions({ width, height });
      if (mounted) setScreenMode(isWatch ? 'watch' : 'mobile');
    };

    detectMode();

    const subscription = Dimensions.addEventListener('change', detectMode);
    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  if (!screenMode) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, styles.loading]}>
          <ActivityIndicator size="large" color={WearColors.primary} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (screenMode === 'watch') {
    return (
      <SafeAreaProvider>
        <View style={styles.watchContainer}>
          <StatusBar barStyle="light-content" backgroundColor={WearColors.background} />
          <WearApp />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
        <HomeScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  watchContainer: {
    flex: 1,
    backgroundColor: WearColors.background,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WearColors.background,
  },
});
