import FullWidthList from "@/components/cmui/FullWidthList";
import ProfileScreen from "@/components/screens/ProfileScreen";
import { StyleSheet, View, Text } from "react-native";

export default function Profile() {
	return <ProfileScreen />;
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
