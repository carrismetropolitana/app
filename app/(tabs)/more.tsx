import MoreScreen from "@/components/screens/MoreScreen";
import { View, Text, StyleSheet } from "react-native";

export default function More() {
	return (
		// <View style={styles.container}>
		// 	<Text style={styles.text}>More</Text>
		// </View>
		<MoreScreen />
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
