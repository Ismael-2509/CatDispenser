import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFeeder } from '../hooks/useFeeder';
import { Colors, Spacing } from '../theme/theme';

export default function HomeScreen() {
  const { data, isOnline, togglePower, manualFeed } = useFeeder();

  if (!data) return null;

  return (
    <ScrollView style={styles.container}>
      {/* Status Bar */}
      <View style={[styles.statusBanner, { backgroundColor: isOnline ? Colors.primary : Colors.danger }]}>
        <Feather name={isOnline ? "wifi" : "wifi-off"} size={18} color="white" />
        <Text style={styles.statusText}>
          {isOnline ? "ESP32 EN LÍNEA" : "ESP32 FUERA DE LÍNEA"}
        </Text>
      </View>

      {/* Hero Card - Peso Actual */}
      <View style={styles.heroCard}>
        <Text style={styles.label}>Nivel de Alimento</Text>
        <Text style={styles.weightText}>{data.pesoActual}<Text style={styles.unit}>g</Text></Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${(data.pesoActual / 1000) * 100}%` }]} />
        </View>
      </View>

      {/* Main Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity 
          style={[styles.controlCard, !data.estadoDispensador && styles.cardDisabled]} 
          onPress={togglePower}
        >
          <Feather name="power" size={32} color={data.estadoDispensador ? Colors.primary : Colors.danger} />
          <Text style={styles.controlLabel}>{data.estadoDispensador ? "Encendido" : "Apagado"}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlCard, !data.estadoDispensador && { opacity: 0.5 }]} 
          disabled={!data.estadoDispensador}
          onPress={manualFeed}
        >
          <Feather name="zap" size={32} color={Colors.secondary} />
          <Text style={styles.controlLabel}>Alimentar Ahora</Text>
        </TouchableOpacity>
      </View>

      {/* Historial Rápido */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Últimas Actividades</Text>
      </View>
      
      {Object.entries(data.historial || {}).reverse().slice(0, 5).map(([key, value]) => (
        <View key={key} style={styles.historyItem}>
          <Feather name="clock" size={16} color={Colors.textSecondary} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.historyText}>{value}</Text>
            <Text style={styles.historyDate}>{key.replace('_', ' ')}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.m },
  statusBanner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 10, 
    borderRadius: 12,
    marginBottom: Spacing.m
  },
  statusText: { color: 'white', fontWeight: 'bold', marginLeft: 8, fontSize: 12 },
  heroCard: { 
    backgroundColor: Colors.card, 
    padding: Spacing.l, 
    borderRadius: 24, 
    elevation: 4, 
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    marginBottom: Spacing.m
  },
  label: { color: Colors.textSecondary, fontSize: 14, fontWeight: '600' },
  weightText: { fontSize: 48, fontWeight: '800', color: Colors.textPrimary, marginVertical: 8 },
  unit: { fontSize: 20, color: Colors.textSecondary },
  progressBarBg: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: Colors.primary },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.l },
  controlCard: { 
    backgroundColor: Colors.card, 
    width: '48%', 
    padding: Spacing.m, 
    borderRadius: 20, 
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2
  },
  controlLabel: { marginTop: 8, fontWeight: 'bold', color: Colors.textPrimary },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: Spacing.m },
  historyItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.card, 
    padding: Spacing.m, 
    borderRadius: 15, 
    marginBottom: 8 
  },
  historyText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  historyDate: { fontSize: 12, color: Colors.textSecondary }
});