import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildConsumptionStats } from '../model/FeederModel';
import { feederRepository } from '../repository/FeederRepository';

export function useFeederViewModel() {
  const [feeder, setFeeder] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [consumptionPeriod, setConsumptionPeriod] = useState('week');

  useEffect(() => {
    return feederRepository.subscribe({
      onData: setFeeder,
      onOnline: setIsOnline,
      onLoading: setLoading,
    });
  }, []);

  const consumption = useMemo(
    () => buildConsumptionStats(feeder?.history ?? [], consumptionPeriod),
    [feeder?.history, consumptionPeriod]
  );

  const togglePower = useCallback(() => {
    if (!feeder) return;
    feederRepository.togglePower(feeder.isPoweredOn);
  }, [feeder]);

  const feed = useCallback(
    (grams) => {
      if (!feeder?.isPoweredOn) return;
      feederRepository.feed(grams);
    },
    [feeder]
  );

  const toggleAutoMode = useCallback(() => {
    if (!feeder) return;
    feederRepository.setAutoMode(!feeder.autoMode);
  }, [feeder]);

  const addSchedule = useCallback(async (time) => {
    try {
      await feederRepository.addSchedule(time);
      return { ok: true };
    } catch (error) {
      console.error('Error al agregar horario:', error);
      return { ok: false, error };
    }
  }, []);

  const toggleSchedule = useCallback(
    async (time) => {
      const schedule = feeder?.schedules.find((s) => s.time === time);
      if (!schedule) return { ok: false };
      try {
        await feederRepository.updateSchedule(time, { enabled: !schedule.enabled });
        return { ok: true };
      } catch (error) {
        console.error('Error al actualizar horario:', error);
        return { ok: false, error };
      }
    },
    [feeder]
  );

  const removeSchedule = useCallback(async (time) => {
    try {
      await feederRepository.removeSchedule(time);
      return { ok: true };
    } catch (error) {
      console.error('Error al eliminar horario:', error);
      return { ok: false, error };
    }
  }, []);

  return {
    feeder,
    isOnline,
    loading,
    consumption,
    consumptionPeriod,
    setConsumptionPeriod,
    togglePower,
    feed,
    toggleAutoMode,
    addSchedule,
    toggleSchedule,
    removeSchedule,
  };
}
