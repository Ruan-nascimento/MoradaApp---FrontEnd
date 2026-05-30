import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";


function SkeletonPulse({ style }: { style: any }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.skeleton, style, animatedStyle]} />;
}


export function DetalhesLoading() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SkeletonPulse style={styles.imagem} />

      <View style={styles.body}>
        <SkeletonPulse style={styles.titulo} />
        <SkeletonPulse style={styles.localizacao} />
        <SkeletonPulse style={styles.estrelas} />

        <View style={styles.divisor} />

        <View style={styles.hostRow}>
          <SkeletonPulse style={styles.hostFoto} />
          <View style={styles.hostTextos}>
            <SkeletonPulse style={styles.hostNome} />
            <SkeletonPulse style={styles.hostBadge} />
          </View>
        </View>

        <View style={styles.divisor} />

        <SkeletonPulse style={styles.secaoTitulo} />
        <SkeletonPulse style={styles.destaqueItem} />
        <SkeletonPulse style={styles.destaqueItem} />
        <SkeletonPulse style={styles.destaqueItem} />

        <View style={styles.divisor} />

        <SkeletonPulse style={styles.secaoTitulo} />
        <SkeletonPulse style={styles.climaBloco} />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181B",
  },

  skeleton: {
    backgroundColor: "#3F3F46",
    borderRadius: 8,
  },

  imagem: {
    width: "100%",
    height: 320,
    borderRadius: 0,
  },

  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  titulo: {
    height: 24,
    width: "80%",
    marginBottom: 10,
  },

  localizacao: {
    height: 16,
    width: "45%",
    marginBottom: 8,
  },

  estrelas: {
    height: 16,
    width: "30%",
    marginBottom: 4,
  },

  divisor: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 16,
  },

  hostRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  hostFoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  hostTextos: {
    marginLeft: 12,
    gap: 6,
  },

  hostNome: {
    height: 16,
    width: 120,
  },

  hostBadge: {
    height: 12,
    width: 80,
  },

  secaoTitulo: {
    height: 20,
    width: 100,
    marginBottom: 14,
  },

  destaqueItem: {
    height: 14,
    width: "70%",
    marginBottom: 10,
  },

  climaBloco: {
    height: 80,
    width: "100%",
  },
});
