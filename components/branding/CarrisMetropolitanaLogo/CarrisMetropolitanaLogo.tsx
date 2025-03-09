import { useColorScheme } from "react-native";
import { CarrisMetropolitanaLogoLight } from "./variants/CarrisMetropolitanaLogoLight";
import { CarrisMetropolitanaLogoDark } from "./variants/CarrisMetropolitanaLogoDark";

export const CarrisMetropolitanaLogo = ({
	theme,
}: { theme?: "light" | "dark" }) => {
	return (theme || useColorScheme()) === "dark" ? (
		<CarrisMetropolitanaLogoDark />
	) : (
		<CarrisMetropolitanaLogoLight />
	);
};
