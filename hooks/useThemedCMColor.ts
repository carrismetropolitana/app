import { CMColors } from "../constants/CMColors";
import { useColorScheme } from "react-native";

type ColorKeys = keyof typeof CMColors.light & keyof typeof CMColors.dark;

export default function useThemedCMColor(color: ColorKeys) {
    const theme = useColorScheme();

    if (theme === "dark") {
        return CMColors.dark[color];
    }

    return CMColors.light[color];
}
