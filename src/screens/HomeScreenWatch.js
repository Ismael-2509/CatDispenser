import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useFeeder } from '../hooks/useFeeder';
import { Colors } from '../theme/theme';

export default function HomeScreenWatch() {
  const { data, isOnline, manualFeed } = useFeeder();
  const [activeTab, setActiveTab] = useState('home');
  const { width, height } = Dimensions.get('window');
  const isCircular = Math.abs(width - height) < 30;
  const isSmall = Math.min(width, height) < 280;

  if (!data) return null;

  if (activeTab === 'schedules') {
    return <SchedulesTab onBack={() => setActiveTab('home')} data={data} isCircular={isCircular} />;
  }

  return (
    <View style={[styles.container, isCircular && styles.circularContainer]}>
      <View style={[styles.status, { backgroundColor: isOnline ? Colors.primary : Colors.danger }]}>
        <Text style={[styles.statusText, isSmall && styles.smallText]}>
          {isOnline ? '● En línea' : '● Desconectado'}
        </Text>
      </View>

      <View style={[styles.circle, isSmall && styles.smallCircle]}>
        <Text style={[styles.weight, isSmall && styles.smallWeight]}>{data.pesoActual}</Text>
        <Text style={[styles.unit, isSmall && styles.smallUnit]}>g</Text>
      </View>

      <View style={[styles.buttonRow, isSmall && styles.compactRow]}>
        <TouchableOpacity 
          style={[styles.button, isSmall && styles.smallButton]} 
          onPress={manualFeed}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, isSmall && styles.smallButtonText]}>Alimentar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondary, isSmall && styles.smallButton]} 
          onPress={() => setActiveTab('schedules')}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, isSmall && styles.smallButtonText]}>Horarios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SchedulesTab({ onBack, data, isCircular }) {
  const schedules = data?.horarios ? Object.keys(data.horarios).sort() : [];

  return (
    <ScrollView style={[styles.schedulesContainer, isCircular && styles.circularContainer]}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Atrás</Text>
      </TouchableOpacity>

      <Text style={styles.schedulesTitle}>Horarios</Text>
      
      {schedules.length > 0 ? (
        schedules.map((time) => (
          <View key={time} style={styles.scheduleItem}>
            <Text style={styles.scheduleTime}>{time}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Sin horarios</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: Colors.background },
  circularContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  status: { position: 'absolute', top: 10, left: 10, right: 10, padding: 8, borderRadius: 12, alignItems: 'center', zIndex: 10 },
  statusText: { color: 'white', fontWeight: '700', fontSize: 13 },
  smallText: { fontSize: 11 },
  circle: { width: 140, height: 140, borderRadius: 70, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', elevation: 4, marginTop: 50, marginBottom: 20 },
  smallCircle: { width: 110, height: 110, borderRadius: 55, marginTop: 35, marginBottom: 15 },
  weight: { fontSize: 36, fontWeight: '800', color: Colors.textPrimary },
  smallWeight: { fontSize: 28 },
  unit: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  smallUnit: { fontSize: 11 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  compactRow: { gap: 6 },
  button: { flex: 1, backgroundColor: Colors.primary, paddingVertical: 12, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  smallButton: { paddingVertical: 9, borderRadius: 16 },
  secondary: { backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.primary },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 12 },
  smallButtonText: { fontSize: 10 },
  schedulesContainer: { flex: 1, backgroundColor: Colors.background, padding: 12 },
  backButton: { padding: 10, marginBottom: 10 },
  backText: { fontWeight: '700', fontSize: 14, color: Colors.primary },
  schedulesTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12, color: Colors.textPrimary, textAlign: 'center' },
  scheduleItem: { backgroundColor: Colors.card, padding: 12, borderRadius: 12, marginBottom: 8, elevation: 2, alignItems: 'center' },
  scheduleTime: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  emptyText: { textAlign: 'center', color: Colors.textSecondary, marginTop: 20, fontWeight: '600' }
});
