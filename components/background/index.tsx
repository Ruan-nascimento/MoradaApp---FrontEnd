import { LinearGradient } from "expo-linear-gradient"
import { Image, Pressable, Text, View } from "react-native"

export const BackgroundLogin = () => {


    return (
        <LinearGradient
            colors={[
                "#3f3f46",
                "#18181b",
            ]}
            start={{
                x: 0, y: 0
            }}
            end={{
                x: 0, y: 1
            }}
            className="flex-1 w-full flex items-center p-6 pt-12"

        >

            <View className="z-50 flex justify-center items-center w-full h-72 top-20">

                <Image
                    source={require("../../assets/moradaIcon.png")}
                    className="w-[250px] h-[250px]"
                />

                <Text className="text-white text-5xl font-bold -top-12">Morada</Text>

                <Text className="text-white text-lg -top-4 text-center max-w-56">Encontre <Text className="text-warm-yellow font-bold">Lugares Incriveis</Text> para chamar de seu</Text>


            </View>

            <Pressable
                className="w-[80%] h-14 flex-row bg-[#D7B13F] rounded-xl justify-center items-center top-56 gap-4">
                <Image
                    source={require("../../assets/googleIcon.png")}
                    className="w-8 h-8 mr-3"
                />

                <Text className="text-off-white font-bold">
                    Logar com Google
                </Text>
            </Pressable>

            <Text className="text-white/70 text-sm bottom-10 absolute z-50">
                Direitos Reservados © Group By Cornos Corporation
            </Text>

            <View className="w-[600px] h-[600px] bg-third rounded-full -top-1/3 absolute" />

            <View className="w-[600px] h-[600px] bg-warm-yellow rounded-full -bottom-1/3 left-52 absolute" />

        </LinearGradient>
    )
}