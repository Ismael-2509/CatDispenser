/** Normaliza un horario de Firebase (booleano u objeto) */
export function parseScheduleEntry(time, raw) {
  if (raw === false) {
    return { time, grams: 20, enabled: false };
  }
  if (raw === true || raw === null || raw === undefined) {
    return { time, grams: 20, enabled: true };
  }
  if (typeof raw === 'number') {
    return { time, grams: raw, enabled: true };
  }
  const enabled = raw.activo ?? raw.enabled ?? true;
  return {
    time,
    grams: raw.gramos ?? raw.grams ?? 20,
    enabled: Boolean(enabled),
  };
}

/** Convierte historial de Firebase en eventos de consumo */
export function parseHistoryEntries(historial = {}) {
  return Object.entries(historial)
    .map(([key, value]) => {
      const gramsMatch = String(value).match(/(\d+)\s*g/i);
      return {
        id: key,
        label: value,
        grams: gramsMatch ? Number(gramsMatch[1]) : 20,
        timestamp: parseHistoryKey(key),
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp);
}

function parseHistoryKey(key) {
  const normalized = key.replace(/_/g, ' ');
  const parsed = Date.parse(normalized);
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

/** Genera datos de gráfica a partir del historial */
export function buildConsumptionStats(historyEntries, period = 'week') {
  const now = new Date();
  const buckets = [];

  if (period === 'day') {
    for (let h = 0; h < 24; h += 4) {
      buckets.push({ label: `${String(h).padStart(2, '0')}h`, grams: 0, count: 0 });
    }
    historyEntries.forEach((entry) => {
      const d = new Date(entry.timestamp);
      if (!isSameDay(d, now)) return;
      const idx = Math.min(Math.floor(d.getHours() / 4), buckets.length - 1);
      buckets[idx].grams += entry.grams;
      buckets[idx].count += 1;
    });
  } else if (period === 'month') {
    for (let w = 0; w < 4; w++) {
      buckets.push({ label: `S${w + 1}`, grams: 0, count: 0 });
    }
    historyEntries.forEach((entry) => {
      const d = new Date(entry.timestamp);
      if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) return;
      const idx = Math.min(Math.floor((d.getDate() - 1) / 7), buckets.length - 1);
      buckets[idx].grams += entry.grams;
      buckets[idx].count += 1;
    });
  } else {
    const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    days.forEach((label) => buckets.push({ label, grams: 0, count: 0 }));
    historyEntries.forEach((entry) => {
      const d = new Date(entry.timestamp);
      const diffDays = Math.floor((now - d) / 86400000);
      if (diffDays < 0 || diffDays > 6) return;
      const idx = 6 - diffDays;
      buckets[idx].grams += entry.grams;
      buckets[idx].count += 1;
    });
  }

  const totalGrams = buckets.reduce((s, b) => s + b.grams, 0);
  const totalFeeds = buckets.reduce((s, b) => s + b.count, 0);
  const activeDays = buckets.filter((b) => b.count > 0).length || 1;

  return {
    bars: buckets,
    totalGrams,
    totalFeeds,
    dailyAverage: Math.round(totalGrams / activeDays),
  };
}

function isSameDay(a, b) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

export function formatTime12h(time24) {
  const [h, m] = time24.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date) {
  return new Date(date).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
