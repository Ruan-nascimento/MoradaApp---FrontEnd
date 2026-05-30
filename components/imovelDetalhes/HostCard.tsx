import { View, Text, Image, StyleSheet } from "react-native";
import { Host } from "../../utils/interfaces/imoveis";
import { calcularTempoHost } from "../../utils/formatters";
import Svg, { Path, Circle } from "react-native-svg";


interface HostCardProps {
  host: Host;
}


function IconeVerificado() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
      <Path
        d="M9 12l2 2 4-4"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


export function HostCard({ host }: HostCardProps) {
  const tempo = calcularTempoHost(host.createdAt);

  return (
    <View style={styles.container}>
      <View style={styles.infoRow}>
        <Image
          source={{ uri: host.photo }}
          style={styles.foto}
        />

        <View style={styles.textos}>
          <Text style={styles.nome}>{host.name}</Text>
          <Text style={styles.badge}>
            SuperHost: <Text style={styles.tempo}>{tempo}</Text>
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <IconeVerificado />
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  foto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3F3F46",
  },

  textos: {
    flex: 1,
    marginLeft: 12,
  },

  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },

  badge: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.5)",
  },

  tempo: {
    color: "rgba(255, 255, 255, 0.5)",
  },

  iconContainer: {
    marginLeft: 8,
  },
});
