import * as Device from 'expo-device';
import { Dimensions, Platform } from 'react-native';

let hardwareWatchResult = null;

/**
 * Detecta si la app corre en un smartwatch Wear OS.
 * Usa la feature nativa de Android (cacheada) y, como respaldo, el tamaño de pantalla.
 */
export async function isWatchDevice() {
  if (Platform.OS === 'android' && hardwareWatchResult === null) {
    try {
      hardwareWatchResult = await Device.hasPlatformFeatureAsync('android.hardware.type.watch');
    } catch {
      hardwareWatchResult = false;
    }
  }

  if (hardwareWatchResult) return true;

  const { width, height } = Dimensions.get('window');
  return isWatchDimensions({ width, height });
}

export function isWatchDimensions({ width, height }) {
  const minSide = Math.min(width, height);
  return minSide <= 280 || (minSide <= 380 && Math.abs(width - height) < 30);
}
