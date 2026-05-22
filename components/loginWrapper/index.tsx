import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../contexts/authContext";

interface LoginWrapperProps {
  onChangeMode: () => void;
}

export const LoginWrapper = ({ onChangeMode }: LoginWrapperProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const {signIn} = useUser();

  const {saveToken} = useAuth();

  async function handleLogin() {
    if (isLoading) return;

    try {
        setIsLoading(true);

        const userData = await signIn(email, password);

        if (!userData.success || !userData.token) {
        throw new Error("Erro ao fazer login");
        }

        await saveToken(userData.token);

        console.log("Token salvo com sucesso:", userData.token);
    } catch (error) {
        console.log("Erro ao fazer login", error);
    } finally {
        setIsLoading(false);
    }
}

  const isButtonDisabled = isLoading || !email.trim() || !password.trim();

  return (
    <View className="w-full items-center">
      <View className="w-full max-w-md rounded-3xl bg-main/85 border border-white/10 px-5 py-6 shadow-lg">
        <Text className="text-white text-2xl font-bold">
          Entrar na conta
        </Text>

        <Text className="text-off-white/60 text-sm mt-1 mb-6">
          Acesse sua conta para continuar
        </Text>

        <View className="gap-5">
          <View className="gap-2">
            <Text className="text-off-white text-sm font-semibold">
              Email
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="Digite seu email"
              placeholderTextColor="#A1A1AA"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className={`
                w-full rounded-2xl px-4 py-4 text-white bg-second border
                ${emailFocused ? "border-warm-yellow" : "border-white/10"}
              `}
            />
          </View>

          <View className="gap-2">
            <Text className="text-off-white text-sm font-semibold">
              Senha
            </Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="Digite sua senha"
              placeholderTextColor="#A1A1AA"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              className={`
                w-full rounded-2xl px-4 py-4 text-white bg-second border
                ${passwordFocused ? "border-warm-yellow" : "border-white/10"}
              `}
            />
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={isButtonDisabled}
            className="mt-2"
          >
            {({ pressed }) => (
              <View
                className={`
                  h-14 w-full items-center justify-center rounded-2xl
                  ${isButtonDisabled ? "bg-third" : pressed ? "bg-blue-detail" : "bg-warm-yellow"}
                `}
              >
                {isLoading ? (
                  <ActivityIndicator color="#18181B" />
                ) : (
                  <Text
                    className={`
                      text-base font-bold
                      ${isButtonDisabled ? "text-off-white/40" : pressed ? "text-white" : "text-main"}
                    `}
                  >
                    Fazer login
                  </Text>
                )}
              </View>
            )}
          </Pressable>

          <View className="flex-row items-center justify-center mt-1">
            <Text className="text-off-white/60 text-sm">
              Novo no app?{" "}
            </Text>

            <Pressable onPress={onChangeMode}>
              {({ pressed }) => (
                <Text
                  className={`
                    text-sm font-bold
                    ${pressed ? "text-blue-detail" : "text-warm-yellow"}
                  `}
                >
                  Crie uma conta
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};