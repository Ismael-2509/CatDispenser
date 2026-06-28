import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useFeeder } from '../hooks/useFeeder';
import { Colors } from '../theme/theme';

export default function SchedulesScreenWatch() {
  const { data } = useFeeder();
  const schedules = data?.horarios ? Object.keys(data.horarios).sort() : [];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Horarios Programados</Text>
      
      {schedules.length > 0 ? (
        schedules.map((time) => (
          <View key={time} style={styles.item}>
            <Text style={styles.itemText}>🕐 {time}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>Sin horarios programados</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 12 },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 16, color: Colors.textPrimary, textAlign: 'center' },
  item: { backgroundColor: Colors.card, padding: 14, borderRadius: 14, marginBottom: 10, alignItems: 'center', elevation: 2 },
  itemText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  empty: { textAlign: 'center', color: Colors.textSecondary, fontSize: 14, fontWeight: '600', marginTop: 20 }
});
