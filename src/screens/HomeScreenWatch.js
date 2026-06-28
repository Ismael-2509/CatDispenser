import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFeeder } from '../hooks/useFeeder';
import { Colors } from '../theme/theme';

export default function HomeScreenWatch() {
  const { data, isOnline, manualFeed } = useFeeder();

  if (!data) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.status, { backgroundColor: isOnline ? Colors.primary : Colors.danger }]}>
        <Text style={styles.statusText}>{isOnline ? 'En línea' : 'Desconectado'}</Text>
      </View>

      <View style={styles.circle}>
        <Text style={styles.weight}>{data.pesoActual}</Text>
        <Text style={styles.unit}>g</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={manualFeed}>
        <Text style={styles.buttonText}>Alimentar ahora</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondary]}>
        <Text style={styles.buttonText}>Horarios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 12, backgroundColor: Colors.background },
  status: { position: 'absolute', top: 12, left: 12, right: 12, padding: 6, borderRadius: 12, alignItems: 'center' },
  statusText: { color: 'white', fontWeight: '700' },
  circle: { width: 160, height: 160, borderRadius: 80, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  weight: { fontSize: 40, fontWeight: '800', color: Colors.textPrimary },
  unit: { fontSize: 16, color: Colors.textSecondary },
  button: { marginTop: 18, backgroundColor: Colors.primary, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 28 },
  secondary: { backgroundColor: Colors.card, borderWidth: 1, borderColor: '#DDD' },
  buttonText: { color: 'white', fontWeight: '700' }
});
