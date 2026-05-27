import Svg, { Path, Circle } from "react-native-svg";

interface SearchIconProps {
    size?: number;
    color?: string;
}

export const SearchIcon = ({ size = 24, color = "#F7F7F8" }: SearchIconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={2} />
            <Path d="M16 16L21 21" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );
};
