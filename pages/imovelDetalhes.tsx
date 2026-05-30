import { View, ScrollView, Text, StyleSheet, StatusBar, Modal, Pressable, ActivityIndicator, Image, Alert, Clipboard, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useImovelDetalhes } from "../hooks/useImovelDetalhes";
import { useClima } from "../hooks/useClima";
import { useReservas } from "../hooks/useReservas";
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
import { formatarPreco } from "../utils/formatters";

interface ImovelDetalhesPageProps {
  navigation?: any;
  route?: {
    params: {
      id: string;
    };
  };
}

const MESES_NOMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function ImovelDetalhesPage({ navigation, route }: ImovelDetalhesPageProps) {
  const { id } = route?.params || { params: { id: "" } }.params;

  const { imovel, loading, error } = useImovelDetalhes(id);
  const { clima, loading: climaLoading, error: climaError } = useClima(
    imovel?.city || "",
    imovel?.uf || ""
  );
  const { criarReserva } = useReservas();

  const [favoritado, setFavoritado] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [confirmandoReserva, setConfirmandoReserva] = useState(false);

  function handleVoltar() {
    navigation.goBack();
  }

  function handleFavoritar() {
    setFavoritado((prev) => !prev);
  }

  function handleReservar() {
    setShowModal(true);
  }

  function fecharModal() {
    setShowModal(false);
    setCheckIn(null);
    setCheckOut(null);
  }

  // Calendário Customizado helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const numDays = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= numDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handleSelectDay = (day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day < today) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(day);
      setCheckOut(null);
    } else {
      if (day < checkIn) {
        setCheckIn(day);
      } else if (day.getTime() === checkIn.getTime()) {
        setCheckIn(null);
      } else {
        setCheckOut(day);
      }
    }
  };

  const isDaySelected = (day: Date) => {
    if (!day) return false;
    if (checkIn && day.getTime() === checkIn.getTime()) return true;
    if (checkOut && day.getTime() === checkOut.getTime()) return true;
    return false;
  };

  const isDayInRange = (day: Date) => {
    if (!day || !checkIn || !checkOut) return false;
    return day > checkIn && day < checkOut;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleConfirmReservation = async () => {
    if (!checkIn || !checkOut || !imovel) return;
    setConfirmandoReserva(true);
    try {
      const [res] = await Promise.all([
        criarReserva(imovel.id, checkIn.toISOString(), checkOut.toISOString()),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);

      if (res.success && res.data) {
        Alert.alert("Sucesso", "Pagamento simulado com sucesso e reserva confirmada!");
        fecharModal();
        navigation.navigate("MainTabs", { screen: "Reserves" });
      } else {
        Alert.alert("Erro", res.message || "Erro ao criar reserva");
      }
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Erro ao realizar reserva");
    } finally {
      setConfirmandoReserva(false);
    }
  };

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

  const calendarDays = getDaysInMonth(currentMonth);
  const nightsCount = getNights();
  const totalPrice = imovel.price * nightsCount;

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

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {confirmandoReserva ? "Simulando Pagamento..." : "Escolha as datas"}
              </Text>
              <TouchableOpacity onPress={fecharModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {confirmandoReserva ? (
              /* TELA DE LOADING SIMULADO */
              <View style={styles.loadingWrapper}>
                <ActivityIndicator size="large" color="#F2B705" />
                <Text style={styles.loadingText}>Processando pagamento...</Text>
                <Text style={styles.loadingSubtext}>Simulando transação financeira local de forma segura.</Text>
              </View>
            ) : (
              /* CALENDÁRIO / INTERVALO SELEÇÃO */
              <View style={styles.calendarWrapper}>
                {/* Month Navigator */}
                <View style={styles.monthHeader}>
                  <TouchableOpacity onPress={handlePrevMonth} style={styles.navMonthBtn}>
                    <Text style={styles.navMonthText}>◀</Text>
                  </TouchableOpacity>
                  <Text style={styles.monthLabel}>
                    {MESES_NOMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </Text>
                  <TouchableOpacity onPress={handleNextMonth} style={styles.navMonthBtn}>
                    <Text style={styles.navMonthText}>▶</Text>
                  </TouchableOpacity>
                </View>

                {/* Days of week header */}
                <View style={styles.weekDaysHeader}>
                  {DIAS_SEMANA.map((day, idx) => (
                    <Text key={idx} style={styles.weekDayLabel}>
                      {day}
                    </Text>
                  ))}
                </View>

                {/* Days grid */}
                <View style={styles.daysGrid}>
                  {calendarDays.map((day, idx) => {
                    const isSelected = day ? isDaySelected(day) : false;
                    const inRange = day ? isDayInRange(day) : false;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isPast = day ? day < today : false;

                    return (
                      <Pressable
                        key={idx}
                        disabled={!day || isPast}
                        onPress={() => day && handleSelectDay(day)}
                        style={[
                          styles.dayCell,
                          isSelected && styles.dayCellSelected,
                          inRange && styles.dayCellInRange,
                          isPast && styles.dayCellPast,
                        ]}
                      >
                        {day && (
                          <Text
                            style={[
                              styles.dayCellText,
                              isSelected && styles.dayCellTextSelected,
                              inRange && styles.dayCellTextInRange,
                              isPast && styles.dayCellTextPast,
                            ]}
                          >
                            {day.getDate()}
                          </Text>
                        )}
                      </Pressable>
                    );
                  })}
                </View>

                {/* Summary Info */}
                <View style={styles.resumoDatas}>
                  <View style={styles.resumoItem}>
                    <Text style={styles.resumoLabel}>Check-In (12:00)</Text>
                    <Text style={styles.resumoValor}>
                      {checkIn ? checkIn.toLocaleDateString("pt-BR") : "Selecionar"}
                    </Text>
                  </View>
                  <View style={styles.resumoItem}>
                    <Text style={styles.resumoLabel}>Check-Out (12:00)</Text>
                    <Text style={styles.resumoValor}>
                      {checkOut ? checkOut.toLocaleDateString("pt-BR") : "Selecionar"}
                    </Text>
                  </View>
                </View>

                {checkIn && checkOut && (
                  <View style={styles.priceSummary}>
                    <Text style={styles.nightsLabel}>
                      {nightsCount} {nightsCount === 1 ? "noite" : "noites"} x {formatarPreco(imovel.price)}
                    </Text>
                    <Text style={styles.totalLabel}>
                      Total: <Text style={styles.totalPriceText}>{formatarPreco(totalPrice)}</Text>
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  disabled={!checkIn || !checkOut}
                  onPress={handleConfirmReservation}
                  style={[
                    styles.confirmBtn,
                    (!checkIn || !checkOut) && styles.confirmBtnDisabled,
                  ]}
                >
                  <Text style={styles.confirmBtnText}>Confirmar e Pagar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
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

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingBottom: 24,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  closeButton: {
    padding: 4,
  },

  closeButtonText: {
    fontSize: 20,
    color: "rgba(255, 255, 255, 0.6)",
  },

  calendarWrapper: {
    padding: 16,
  },

  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  navMonthBtn: {
    padding: 8,
  },

  navMonthText: {
    fontSize: 16,
    color: "#F2B705",
  },

  monthLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  weekDaysHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  weekDayLabel: {
    width: "14%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.4)",
  },

  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  dayCell: {
    width: "14%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderRadius: 8,
  },

  dayCellSelected: {
    backgroundColor: "#F2B705",
  },

  dayCellInRange: {
    backgroundColor: "rgba(242, 183, 5, 0.15)",
  },

  dayCellPast: {
    opacity: 0.25,
  },

  dayCellText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },

  dayCellTextSelected: {
    color: "#18181B",
    fontWeight: "700",
  },

  dayCellTextInRange: {
    color: "#F2B705",
  },

  dayCellTextPast: {
    color: "rgba(255, 255, 255, 0.3)",
  },

  resumoDatas: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },

  resumoItem: {
    flex: 1,
    alignItems: "center",
  },

  resumoLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.4)",
    marginBottom: 4,
  },

  resumoValor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  priceSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 4,
  },

  nightsLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },

  totalLabel: {
    fontSize: 14,
    color: "#FFFFFF",
  },

  totalPriceText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F2B705",
  },

  confirmBtn: {
    backgroundColor: "#F2B705",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  confirmBtnDisabled: {
    backgroundColor: "rgba(242, 183, 5, 0.3)",
  },

  confirmBtnText: {
    color: "#18181B",
    fontSize: 16,
    fontWeight: "700",
  },

  // Loading modal styles
  loadingWrapper: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },

  loadingSubtext: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
