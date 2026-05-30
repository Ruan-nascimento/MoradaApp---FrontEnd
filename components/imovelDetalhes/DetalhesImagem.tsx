import { Image, View, StyleSheet } from "react-native";


interface DetalhesImagemProps {
  uri: string;
}


export function DetalhesImagem({ uri }: DetalhesImagemProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri }}
        style={styles.imagem}
        resizeMode="cover"
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 320,
    backgroundColor: "#27272A",
  },

  imagem: {
    width: "100%",
    height: "100%",
  },
});
