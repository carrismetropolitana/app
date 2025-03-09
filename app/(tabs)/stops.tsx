import StopsScreen from "@/components/screens/StopsScreen";
import { useVehicles } from "@/hooks/dataFetching/useVehicles";
import { View, Text, StyleSheet, SafeAreaView, TextInput } from "react-native";

export default function Stops() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Stops</Text>
		</View>
		// <StopsScreen />
	);
}

const styles = StyleSheet.create({
	container: {
		fontFamily: "Inter",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	text: {
		fontSize: 20,
		textTransform: "uppercase",
		fontWeight: 900,
		color: "rgba(150, 150, 160, 1)",
	},
});
