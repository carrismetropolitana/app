import { useConsentContext } from "@/contexts/Consent.context";
import { Link } from "expo-router";
import { View, Text, StyleSheet, Button } from "react-native";
import { useTranslation } from 'react-i18next';
import i18n from "@/i18n";
import { useLocaleContext } from "@/contexts/Locale.context";

export default function HomeScreen() {

	const { t } = useTranslation();
  const localeContext = useLocaleContext();

	const changeLocale = (locale: string) => {
		i18n.changeLanguage(locale);
	  };

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Home</Text>
			<Link href="/profile">Open profile</Link>
			<Text>{t('hello')}</Text>
			<Button title="Switch to English" onPress={localeContext.actions.changeToEnglish} />
     		 <View style={{ marginTop: 10 }}>
        		<Button title="Switch to Portuguese" onPress={localeContext.actions.changeToPortuguese} />
     	 </View>	
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
