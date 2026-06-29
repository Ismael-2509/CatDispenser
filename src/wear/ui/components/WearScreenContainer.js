import { StyleSheet, View } from 'react-native';
import { useWearLayoutContext } from '../hooks/useWearLayout';

/** Contenedor que respeta la zona segura en pantallas circulares de smartwatch. */
export default function WearScreenContainer({ children, style }) {
  const layout = useWearLayoutContext();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: layout.horizontalPadding,
          paddingTop: layout.safeTop,
          width: layout.width,
        },
        layout.isCircular && styles.circular,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circular: {
    alignSelf: 'center',
  },
});
