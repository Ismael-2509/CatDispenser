import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import WearCard from '../components/WearCard';
import WearScreenContainer from '../components/WearScreenContainer';
import WearSwitch from '../components/WearSwitch';
import { formatTime12h } from '../../model/FeederModel';
import { useWearLayoutContext } from '../hooks/useWearLayout';
import { WearColors } from '../theme/wearTheme';

function formatTime24(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export default function SchedulesScreen({ feeder, onToggleSchedule, onAddSchedule, onBack }) {
  const layout = useWearLayoutContext();
  const { fonts, spacing, contentWidth, icon } = layout;

  const [showPicker, setShowPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());
  const [saving, setSaving] = useState(false);

  const existingTimes = new Set(feeder.schedules.map((s) => s.time));

  const handleOpenPicker = () => {
    setPickerDate(new Date());
    setShowPicker(true);
  };

  const handleAddTime = async (date) => {
    const time = formatTime24(date);

    if (existingTimes.has(time)) {
      Alert.alert('Horario existente', `Ya tienes programado las ${formatTime12h(time)}.`);
      return;
    }

    setSaving(true);
    const result = await onAddSchedule(time);
    setSaving(false);

    if (result?.ok) {
      setShowPicker(false);
    } else {
      Alert.alert('Error', 'No se pudo guardar el horario. Revisa la conexión.');
    }
  };

  const onTimeChange = async (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'dismissed' || !selectedDate) {
      setShowPicker(false);
      return;
    }

    setPickerDate(selectedDate);

    if (Platform.OS === 'android') {
      await handleAddTime(selectedDate);
    }
  };

  const confirmIosPicker = async () => {
    setShowPicker(false);
    await handleAddTime(pickerDate);
  };

  const handleToggle = async (time) => {
    const result = await onToggleSchedule(time);
    if (!result?.ok) {
      Alert.alert('Error', 'No se pudo actualizar el horario.');
    }
  };

  return (
    <WearScreenContainer>
      <View style={[styles.wrapper, { width: contentWidth }]}>
        <ScreenHeader title="Horarios" onBack={onBack} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: spacing.sm }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {feeder.schedules.length === 0 ? (
            <WearCard style={[styles.emptyCard, { padding: spacing.lg }]}>
              <Feather name="clock" size={icon.xl} color={WearColors.textMuted} />
              <Text style={[styles.emptyText, { fontSize: fonts.body }]}>
                Sin horarios programados
              </Text>
            </WearCard>
          ) : (
            feeder.schedules.map((schedule, index) => (
              <Animated.View key={schedule.time} entering={FadeInDown.delay(index * 80).duration(350)}>
                <WearCard style={[styles.scheduleCard, { padding: spacing.md, marginBottom: spacing.sm }]}>
                  <View style={styles.scheduleInfo}>
                    <Text style={[styles.time, { fontSize: fonts.subtitle }]}>
                      {formatTime12h(schedule.time)}
                    </Text>
                    <Text style={[styles.grams, { fontSize: fonts.caption }]}>
                      {schedule.time}
                    </Text>
                  </View>
                  <WearSwitch
                    value={schedule.enabled}
                    onToggle={() => handleToggle(schedule.time)}
                  />
                </WearCard>
              </Animated.View>
            ))
          )}
        </ScrollView>

        <View style={[styles.footer, { paddingVertical: spacing.sm }]}>
          <PrimaryButton
            label="+ Agregar horario"
            onPress={handleOpenPicker}
            color={WearColors.secondary}
            textColor={WearColors.textPrimary}
            loading={saving}
            disabled={saving}
          />
        </View>

        {showPicker && (
          <>
            <DateTimePicker
              value={pickerDate}
              mode="time"
              is24Hour
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
            />
            {Platform.OS === 'ios' && (
              <View style={styles.iosConfirm}>
                <PrimaryButton
                  label="Confirmar"
                  onPress={confirmIosPicker}
                  loading={saving}
                  disabled={saving}
                />
              </View>
            )}
          </>
        )}
      </View>
    </WearScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  scroll: { flex: 1 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: WearColors.border,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scheduleInfo: { gap: 2, flex: 1 },
  time: { color: WearColors.textPrimary, fontWeight: '700' },
  grams: { color: WearColors.textSecondary, fontWeight: '600' },
  emptyCard: { alignItems: 'center', gap: 8, marginBottom: 8 },
  emptyText: { color: WearColors.textSecondary, textAlign: 'center' },
  iosConfirm: { marginTop: 8 },
});
