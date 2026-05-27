import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFeeder } from '../hooks/useFeeder';
import { Colors, Spacing } from '../theme/theme';

export default function SchedulesScreen() {
  const { data, addSchedule, removeSchedule } = useFeeder();
  const [showPicker, setShowPicker] = useState(false);

  const onTimeChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      addSchedule(`${hours}:${minutes}`);
    }
  };

  const schedulesArray = data?.horarios ? Object.keys(data.horarios).sort() : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Horarios de Comida</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowPicker(true)}>
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={schedulesArray}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="clock" size={20} color={Colors.primary} />
              <Text style={styles.timeText}>{item}</Text>
            </View>
            <TouchableOpacity onPress={() => removeSchedule(item)}>
              <Feather name="trash-2" size={20} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay horarios programados</Text>}
      />

      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          onChange={onTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.m },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.textPrimary },
  addButton: { backgroundColor: Colors.primary, padding: 12, borderRadius: 50 },
  card: { 
    backgroundColor: Colors.card, 
    padding: Spacing.l, 
    borderRadius: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2
  },
  timeText: { fontSize: 22, fontWeight: '700', marginLeft: 15, color: Colors.textPrimary },
  empty: { textAlign: 'center', marginTop: 40, color: Colors.textSecondary }
});