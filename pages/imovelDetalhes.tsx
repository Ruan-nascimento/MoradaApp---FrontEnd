import { View, ScrollView, Text, StyleSheet, StatusBar } from "react-native";
import { useState } from "react";
import { useImovelDetalhes } from "../hooks/useImovelDetalhes";
import { useClima } from "../hooks/useClima";
import { DetalhesHeader } from "../components/imovelDetalhes/DetalhesHeader";
import { DetalhesImagem } from "../components/imovelDetalhes/DetalhesImagem";
import { DetalhesInfo } from "../components/imovelDetalhes/DetalhesInfo";
import { HostCard } from "../components/imovelDetalhes/HostCard";
import { DestaquesList } from "../components/imovelDetalhes/DestaquesList";
import { ClimaCard } from "../components/imovelDetalhes/ClimaCard";
import { AvaliacaoResumo } from "../components/imovelDetalhes/AvaliacaoResumo";
import { ReviewItem } from "../components/imovelDetalhes/ReviewItem";
import { DetalhesFooter } from "../components/imovelDetalhes/DetalhesFooter";
import { DetalhesLoading } from "../components/imovelDetalhes/DetalhesLoading";


interface ImovelDetalhesPageProps {
  navigation: any;
  route: {
    params: {
      id: string;
    };
  };
}


export function ImovelDetalhesPage({ navigation, route }: ImovelDetalhesPageProps) {
  const { id } = route.params;

  const { imovel, loading, error } = useImovelDetalhes(id);
  const { clima, loading: climaLoading, error: climaError } = useClima(
    imovel?.city || "",
    imovel?.uf || ""
  );

  const [favoritado, setFavoritado] = useState(false);

  function handleVoltar() {
    navigation.goBack();
  }

  function handleFavoritar() {
    setFavoritado((prev) => !prev);
  }

  function handleReservar() {
    // TODO: Navegação futura para tela de reserva
  }

  if (loading) {
    return <DetalhesLoading />;
  }

  if (error || !imovel) {
    return (
      <View style={styles.erroContainer}>
        <Text style={styles.erroTexto}>
          {error || "Não foi possível carregar o imóvel"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <DetalhesImagem uri={imovel.photo} />
          <DetalhesHeader
            onVoltar={handleVoltar}
            favoritado={favoritado}
            onFavoritar={handleFavoritar}
          />
        </View>

        <DetalhesInfo
          titulo={imovel.title}
          cidade={imovel.city}
          uf={imovel.uf}
          reviews={imovel.reviews}
        />

        <HostCard host={imovel.host} />

        <DestaquesList highlights={imovel.highlights} />

        <ClimaCard
          cidade={imovel.city}
          clima={clima}
          loading={climaLoading}
          error={climaError}
        />

        <AvaliacaoResumo reviews={imovel.reviews} />

        {imovel.reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ScrollView>

      <DetalhesFooter
        preco={imovel.price}
        reviews={imovel.reviews}
        onReservar={handleReservar}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181B",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  erroContainer: {
    flex: 1,
    backgroundColor: "#18181B",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  erroTexto: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },
});
