import { Feather } from '@expo/vector-icons';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ScreenHeader from '../components/ScreenHeader';
import WearCard from '../components/WearCard';
import WearScreenContainer from '../components/WearScreenContainer';
import { useWearLayoutContext } from '../hooks/useWearLayout';
import { WearColors } from '../theme/wearTheme';

const SETTINGS_ITEMS = [
  { icon: 'clock', label: 'Historial', message: 'Consulta el historial desde la app del teléfono.' },
  { icon: 'bell', label: 'Notificaciones', message: 'Las notificaciones se gestionan desde el dispositivo móvil.' },
  { icon: 'wifi', label: 'Configuración WiFi', message: 'El WiFi se configura directamente en el ESP32.' },
  { icon: 'cpu', label: 'Info del dispositivo', message: null },
  { icon: 'download-cloud', label: 'Actualizar firmware', message: 'No hay actualizaciones disponibles.' },
  { icon: 'help-circle', label: 'Ayuda', message: 'Soporte: revisa la conexión Firebase y el ESP32.' },
  { icon: 'info', label: 'Acerca de', message: 'Dispensador Mascotas v1.0\nWear OS Edition' },
];

export default function SettingsScreen({ feeder, onBack }) {
  const layout = useWearLayoutContext();
  const { fonts, spacing, contentWidth, icon } = layout;

  const showAlert = (title, message) => Alert.alert(title, message);

  return (
    <WearScreenContainer>
      <View style={{ width: contentWidth, flex: 1 }}>
        <ScreenHeader title="Configuración" onBack={onBack} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl, gap: spacing.xs }}>
          {SETTINGS_ITEMS.map((item, index) => (
            <Animated.View key={item.label} entering={FadeInDown.delay(index * 50).duration(350)}>
              <WearCard
                style={[styles.item, { padding: layout.compactHeader ? spacing.sm : spacing.md, gap: spacing.sm }]}
                onPress={() => {
                  if (item.label === 'Info del dispositivo') {
                    showAlert(
                      'Dispositivo',
                      `ID: ${feeder.deviceId}\nFirmware: ${feeder.firmwareVersion}\nAlimento: ${feeder.foodLevel}g`
                    );
                  } else if (item.message) {
                    showAlert(item.label, item.message);
                  }
                }}
              >
                <Feather name={item.icon} size={icon.md} color={WearColors.info} />
                <Text style={[styles.itemLabel, { fontSize: fonts.body }]} numberOfLines={1}>
                  {item.label}
                </Text>
                <Feather name="chevron-right" size={icon.sm + 2} color={WearColors.textMuted} />
              </WearCard>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </WearScreenContainer>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLabel: { color: WearColors.textPrimary, flex: 1 },
});
