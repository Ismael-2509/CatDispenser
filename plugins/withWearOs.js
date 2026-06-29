const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Configura el proyecto Android para instalarse y ejecutarse en Wear OS.
 * - Declara soporte de hardware watch (sin bloquear instalación en teléfono)
 * - Marca la app como standalone en el reloj (funciona sin el teléfono)
 */
function withWearOs(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    if (!manifest['uses-feature']) {
      manifest['uses-feature'] = [];
    }

    const hasWatchFeature = manifest['uses-feature'].some(
      (feature) => feature.$?.['android:name'] === 'android.hardware.type.watch'
    );

    if (!hasWatchFeature) {
      manifest['uses-feature'].push({
        $: {
          'android:name': 'android.hardware.type.watch',
          'android:required': 'false',
        },
      });
    }

    const application = manifest.application?.[0];
    if (application) {
      if (!application['meta-data']) {
        application['meta-data'] = [];
      }

      const hasStandalone = application['meta-data'].some(
        (meta) => meta.$?.['android:name'] === 'com.google.android.wearable.standalone'
      );

      if (!hasStandalone) {
        application['meta-data'].push({
          $: {
            'android:name': 'com.google.android.wearable.standalone',
            'android:value': 'true',
          },
        });
      }
    }

    return config;
  });
}

module.exports = withWearOs;
