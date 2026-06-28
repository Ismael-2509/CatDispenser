import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useFeeder } from '../hooks/useFeeder';
import { Colors } from '../theme/theme';

export default function SchedulesScreenWatch() {
  const { data } = useFeeder();
  const schedules = data?.horarios ? Object.keys(data.horarios).sort() : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horarios</Text>
      <FlatList
        data={schedules}
        keyExtractor={(i) => i}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Sin horarios</Text>}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 10 },
  title: { textAlign: 'center', fontWeight: '700', marginBottom: 8, color: Colors.textPrimary },
  item: { backgroundColor: Colors.card, padding: 12, borderRadius: 12, marginBottom: 8, alignItems: 'center' },
  itemText: { fontSize: 16, color: Colors.textPrimary },
  empty: { textAlign: 'center', color: Colors.textSecondary, marginTop: 20 },
  button: { position: 'absolute', bottom: 12, left: 12, right: 12, backgroundColor: Colors.primary, padding: 10, borderRadius: 28, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '700' }
});
