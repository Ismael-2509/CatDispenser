import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';

/** Calcula métricas responsive para pantallas Wear OS (redondas, pequeñas, grandes). */
export function getWearLayout(window) {
  const { width, height } = window;
  const minSide = Math.min(width, height);
  const maxSide = Math.max(width, height);
  const isCircular = Math.abs(width - height) < 40;
  const isLandscape = width > height;

  let sizeClass = 'large';
  if (minSide < 220) sizeClass = 'tiny';
  else if (minSide < 280) sizeClass = 'small';
  else if (minSide < 340) sizeClass = 'medium';

  const scale = Math.max(0.68, Math.min(1.12, minSide / 360));

  const circularInset = isCircular ? Math.round(minSide * 0.11) : 0;
  const horizontalPadding =
    sizeClass === 'tiny' ? 10 : sizeClass === 'small' ? 10 : isCircular ? Math.max(14, circularInset) : 12;

  const verticalPadding = sizeClass === 'tiny' ? 4 : sizeClass === 'small' ? 6 : 8;

  return {
    width,
    height,
    minSide,
    maxSide,
    isCircular,
    isLandscape,
    sizeClass,
    scale,
    horizontalPadding,
    verticalPadding,
    contentWidth: width - horizontalPadding * 2,
    safeTop: isCircular ? Math.max(4, Math.round(minSide * 0.04)) : verticalPadding,
    fonts: {
      hero: Math.round(32 * scale),
      title: Math.round(18 * scale),
      subtitle: Math.round(14 * scale),
      body: Math.round(13 * scale),
      caption: Math.round(11 * scale),
      button: Math.round(13 * scale),
      value: Math.round(28 * scale),
    },
    icon: {
      sm: Math.round(14 * scale),
      md: Math.round(18 * scale),
      lg: Math.round(22 * scale),
      xl: Math.round(28 * scale),
    },
    tile: {
      width: sizeClass === 'tiny' || (isCircular && minSide < 300) ? '100%' : '48%',
      minHeight: Math.round((sizeClass === 'tiny' ? 64 : 88) * scale),
      iconCircle: Math.round(44 * scale),
      padding: Math.round(12 * scale),
    },
    dial: {
      size: Math.round((sizeClass === 'tiny' ? 96 : 120) * scale),
      control: Math.round(40 * scale),
      grams: Math.round((sizeClass === 'tiny' ? 28 : 36) * scale),
    },
    button: {
      minHeight: Math.round((sizeClass === 'tiny' ? 40 : 48) * scale),
      paddingVertical: Math.round((sizeClass === 'tiny' ? 10 : 14) * scale),
    },
    chart: {
      barHeight: Math.round((sizeClass === 'tiny' ? 56 : 80) * scale),
      barWidth: Math.round((sizeClass === 'tiny' ? 14 : 18) * scale),
    },
    radius: {
      sm: Math.round(12 * scale),
      md: Math.round(16 * scale),
      lg: Math.round(22 * scale),
      xl: Math.round(28 * scale),
    },
    spacing: {
      xs: Math.round(4 * scale),
      sm: Math.round(8 * scale),
      md: Math.round(12 * scale),
      lg: Math.round(16 * scale),
    },
    showPageIndicator: sizeClass !== 'tiny',
    compactHeader: minSide < 300,
  };
}

export function useWearLayout() {
  const [layout, setLayout] = useState(() => getWearLayout(Dimensions.get('window')));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setLayout(getWearLayout(window));
    });
    return () => subscription?.remove();
  }, []);

  return layout;
}

const WearLayoutContext = createContext(null);

export function WearLayoutProvider({ children }) {
  const layout = useWearLayout();
  const value = useMemo(() => layout, [layout]);
  return <WearLayoutContext.Provider value={value}>{children}</WearLayoutContext.Provider>;
}

export function useWearLayoutContext() {
  const context = useContext(WearLayoutContext);
  if (!context) {
    return getWearLayout(Dimensions.get('window'));
  }
  return context;
}
