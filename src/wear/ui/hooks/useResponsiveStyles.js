import { useWearLayoutContext } from './useWearLayout';

/** Helper para crear estilos dinámicos basados en el layout del reloj. */
export function useResponsiveStyles(factory) {
  const layout = useWearLayoutContext();
  return factory(layout);
}
