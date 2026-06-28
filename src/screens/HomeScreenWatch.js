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
          {isOnline ? '● Online' : '● Offline'}
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
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, isSmall && styles.smallButtonText]}>Feed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondary, isSmall && styles.smallButton]}
          onPress={() => setActiveTab('schedules')}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, isSmall && styles.smallButtonText]}>Reloj</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SchedulesTab({ onBack, data, isCircular }) {
  const schedules = data?.horarios ? Object.keys(data.horarios).sort() : [];

  return (
    <ScrollView style={[styles.schedulesContainer, isCircular && styles.circularContainer]}>
      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.schedulesTitle}>Schedules</Text>

      {schedules.length > 0 ? (
        schedules.map((time) => (
          <View key={time} style={styles.scheduleItem}>
            <Text style={styles.scheduleTime}>{time}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No schedules</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: Colors.background, justifyContent: 'center' },
  circularContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  status: { position: 'absolute', top: 8, left: 8, right: 8, padding: 6, borderRadius: 10, alignItems: 'center', zIndex: 10 },
  statusText: { color: 'white', fontWeight: '700', fontSize: 11 },
  smallText: { fontSize: 9 },
  circle: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', elevation: 3, marginTop: 25, marginBottom: 12 },
  smallCircle: { width: 100, height: 100, borderRadius: 50, marginTop: 20, marginBottom: 10 },
  weight: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary },
  smallWeight: { fontSize: 24 },
  unit: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  smallUnit: { fontSize: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, width: '100%' },
  compactRow: { gap: 4 },
  button: { flex: 1, backgroundColor: Colors.primary, paddingVertical: 8, borderRadius: 16, alignItems: 'center', justifyContent: 'center', minHeight: 34 },
  smallButton: { paddingVertical: 7, minHeight: 32, borderRadius: 14 },
  secondary: { backgroundColor: Colors.card, borderWidth: 1.2, borderColor: Colors.primary },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 10 },
  smallButtonText: { fontSize: 9 },
  schedulesContainer: { flex: 1, backgroundColor: Colors.background, padding: 10 },
  backButton: { paddingVertical: 6, marginBottom: 8 },
  backText: { fontWeight: '700', fontSize: 12, color: Colors.primary },
  schedulesTitle: { fontSize: 14, fontWeight: '800', marginBottom: 8, color: Colors.textPrimary, textAlign: 'center' },
  scheduleItem: { backgroundColor: Colors.card, padding: 8, borderRadius: 10, marginBottom: 6, elevation: 1, alignItems: 'center' },
  scheduleTime: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  emptyText: { textAlign: 'center', color: Colors.textSecondary, marginTop: 12, fontWeight: '600', fontSize: 11 }
});
