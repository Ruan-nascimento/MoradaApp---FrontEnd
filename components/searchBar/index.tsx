import { TextInput, View } from "react-native";
import { SearchIcon } from "./searchIcon";

interface SearchBarProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
}

export const SearchBar = ({ value, onChangeText, placeholder = "Para onde Você vai?" }: SearchBarProps) => {
    return (
        <View className="flex-row items-center bg-second border-2 border-warm-yellow rounded-full px-5 py-3">
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#71717A"
                className="flex-1 text-white text-base mr-3"
            />
            <SearchIcon size={22} color="#F7F7F8" />
        </View>
    );
};
