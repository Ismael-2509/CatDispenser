import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import HomeScreen from '../screens/HomeScreen';

export default function Page() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Barra de estado con color claro moderno */}
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      {/* Tu pantalla principal que solita se conecta a useFeeder */}
      <HomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
});