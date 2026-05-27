import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack>
      {/* Ocultamos la barra de navegación gris por defecto de Expo para usar la tuya premium */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}