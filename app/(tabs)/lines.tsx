import { View, Text, StyleSheet } from "react-native";

export default function LinesScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Lines</Text>
		</View>
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
