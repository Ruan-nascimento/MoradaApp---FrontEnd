import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { LoginWrapper } from "../loginWrapper";
import { RegisterWrapper } from "../registerWrapper";

type AuthMode = "login" | "register";

export const BackgroundLogin = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  function handleChangeMode(mode: AuthMode) {
    if (mode === authMode) return;

    const exitTo = mode === "register" ? -80 : 80;
    const enterFrom = mode === "register" ? 80 : -80;

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: exitTo,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAuthMode(mode);

      translateX.setValue(enterFrom);
      opacity.setValue(0);

      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }

  return (
    <LinearGradient
      colors={["#3F3F46", "#18181B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1 w-full"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 w-full"
      >
        <View className="flex-1 w-full items-center justify-center px-6 pt-12 pb-8 overflow-hidden">
          <View className="absolute -top-72 w-[560px] h-[560px] rounded-full bg-third opacity-80" />

          <View className="absolute -bottom-72 -right-72 w-[560px] h-[560px] rounded-full bg-warm-yellow opacity-90" />

          <View className="absolute bottom-16 -left-40 w-72 h-72 rounded-full bg-blue-detail opacity-20" />

          <View className="w-full flex-1 items-center justify-center z-10">
            <View className="w-full items-center mb-8">
              <Image
                source={require("../../assets/moradaIcon.png")}
                className="w-44 h-44"
                resizeMode="contain"
              />

              <Text className="text-white text-5xl font-bold -mt-8">
                Morada
              </Text>

              <Text className="text-off-white/80 text-base text-center max-w-72 mt-3 leading-6">
                Encontre{" "}
                <Text className="text-warm-yellow font-bold">
                  lugares incríveis
                </Text>{" "}
                para chamar de seu
              </Text>
            </View>

            <Animated.View
              className="w-full"
              style={{
                opacity,
                transform: [{ translateX }],
              }}
            >
              {authMode === "login" ? (
                <LoginWrapper onChangeMode={() => handleChangeMode("register")} />
              ) : (
                <RegisterWrapper onChangeMode={() => handleChangeMode("login")} />
              )}
            </Animated.View>
          </View>

          <Text className="text-off-white/60 text-xs text-center z-10">
            Direitos Reservados © Group By Cornos Corporation
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};