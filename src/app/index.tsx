import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Dimensions } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import HomeScreenWatch from '../screens/HomeScreenWatch';

export default function Page() {
  const { width, height } = Dimensions.get('window');
  // Detectar pantallas pequeñas (relojes). Ajusta el umbral si hace falta.
  const isWatch = Math.min(width, height) <= 360;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      {isWatch ? <HomeScreenWatch /> : <HomeScreen />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
});