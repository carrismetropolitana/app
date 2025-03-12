import { useConsentContext } from "@/contexts/Consent.context";
import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";



export default function HomeScreen() {
	const consentContext = useConsentContext();
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Home</Text>
			<Link href="/profile">Open profile</Link>
			<Text>{consentContext.data.init_status}</Text>
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
