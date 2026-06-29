import { onValue, ref, remove, set, update } from 'firebase/database';
import { db } from '../../api/firebaseConfig';
import { parseHistoryEntries, parseScheduleEntry } from '../model/FeederModel';

const HEARTBEAT_TIMEOUT_MS = 12000;

export class FeederRepository {
  subscribe(callbacks) {
    const feederRef = ref(db, '/dispensador');
    let lastHeartbeat = 0;
    let heartbeatTimer = null;

    const unsubscribe = onValue(feederRef, (snapshot) => {
      if (!snapshot.exists()) {
        callbacks.onData(null);
        callbacks.onLoading(false);
        return;
      }

      const raw = snapshot.val();
      callbacks.onData(this.normalize(raw));
      callbacks.onLoading(false);

      if (raw?.latido !== undefined && raw.latido !== lastHeartbeat) {
        lastHeartbeat = raw.latido;
        callbacks.onOnline(true);
        clearTimeout(heartbeatTimer);
        heartbeatTimer = setTimeout(() => callbacks.onOnline(false), HEARTBEAT_TIMEOUT_MS);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(heartbeatTimer);
    };
  }

  normalize(raw) {
    const schedules = Object.entries(raw.horarios ?? {})
      .map(([time, value]) => parseScheduleEntry(time, value))
      .filter((s) => s.enabled)
      .sort((a, b) => a.time.localeCompare(b.time));

    const history = parseHistoryEntries(raw.historial ?? {});
    const lastFeed = history[0] ?? null;

    return {
      name: raw.nombre ?? 'Dispensador Mascotas',
      foodLevel: raw.pesoActual ?? 0,
      isPoweredOn: Boolean(raw.estadoDispensador),
      hasAutoMode: raw.modoAutomatico !== undefined,
      autoMode: Boolean(raw.modoAutomatico),
      battery: raw.bateria ?? null,
      wifiConnected: raw.wifi ?? null,
      schedules,
      history,
      lastFeed,
      firmwareVersion: raw.firmware ?? null,
      deviceId: raw.deviceId ?? null,
    };
  }

  togglePower(isPoweredOn) {
    return update(ref(db, '/dispensador'), { estadoDispensador: !isPoweredOn });
  }

  feed(grams = 20) {
    return update(ref(db, '/dispensador'), {
      alimentarManual: true,
      cantidadAlimentacion: grams,
    });
  }

  setAutoMode(enabled) {
    return update(ref(db, '/dispensador'), { modoAutomatico: enabled });
  }

  addSchedule(time) {
    // Mismo formato que la app móvil y el ESP32: boolean true
    return set(ref(db, `/dispensador/horarios/${time}`), true);
  }

  updateSchedule(time, { enabled }) {
    if (!enabled) {
      return remove(ref(db, `/dispensador/horarios/${time}`));
    }
    return set(ref(db, `/dispensador/horarios/${time}`), true);
  }

  removeSchedule(time) {
    return remove(ref(db, `/dispensador/horarios/${time}`));
  }
}

export const feederRepository = new FeederRepository();
