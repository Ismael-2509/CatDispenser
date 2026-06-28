import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Dimensions } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import HomeScreenWatch from '../screens/HomeScreenWatch';

export default function Page() {
  const [screenMode, setScreenMode] = useState(null);

  useEffect(() => {
    const handleDimensionChange = ({ window }) => {
      const { width, height } = window;
      // Detectar smartwatch: pantalla pequeña (< 380px en su lado más pequeño)
      // o pantalla circular/cuadrada (diferencia < 30px entre ancho y alto)
      const isWatch =
        Math.min(width, height) <= 380 ||
        Math.abs(width - height) < 30;
      setScreenMode(isWatch ? 'watch' : 'mobile');
    };

    const subscription = Dimensions.addEventListener(
      'change',
      handleDimensionChange
    );

    // Inicializar con tamaño actual
    const { width, height } = Dimensions.get('window');
    const isWatch =
      Math.min(width, height) <= 380 ||
      Math.abs(width - height) < 30;
    setScreenMode(isWatch ? 'watch' : 'mobile');

    return () => subscription?.remove();
  }, []);

  if (!screenMode) return null; // Esperar a que se determine el modo

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      {screenMode === 'watch' ? <HomeScreenWatch /> : <HomeScreen />}
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