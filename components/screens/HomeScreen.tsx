/* * */
import { useLinesContext } from '@/contexts/Lines.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useVehiclesContext } from '@/contexts/Vehicles.context';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, StyleSheet, Text, View } from 'react-native';
/* * */

export default function HomeScreen() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation();
	const localeContext = useLocaleContext();
	const vehiclesContext = useVehiclesContext();
	const linesContext = useLinesContext();

	const styles = StyleSheet.create({
		container: {
			alignItems: 'center',
			backgroundColor: '#fff',
			flex: 1,
			fontFamily: 'Inter',
			justifyContent: 'center',
		},
		text: {
			color: 'rgba(150, 150, 160, 1)',
			fontSize: 20,
			fontWeight: 900,
			textTransform: 'uppercase',
		},
		textBIG: {
			color: 'rgba(150, 150, 160, 1)',
			fontSize: 35,
			fontWeight: 900,
			textTransform: 'uppercase',
		},
	});

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Home</Text>
			<Link href="/profile">Open profile</Link>
			<Text>{t('hello')}</Text>

			<View style={{ marginTop: 10 }}>
				<Text style={styles.textBIG}>Vehicle Count : {vehiclesContext.data.vehicles.length}</Text>
			</View>
			<View style={{ marginTop: 10 }}>
				<Text style={styles.textBIG}>Lines Count : {linesContext.data.lines.length}</Text>
			</View>
			<View style={{ marginTop: 10 }}>
				<Text style={styles.textBIG}>Current Locale : {localeContext.locale}</Text>
			</View>

			<Button onPress={localeContext.actions.changeToEnglish} title="Switch to English" />
			<View style={{ marginTop: 10 }}>
				<Button onPress={localeContext.actions.changeToPortuguese} title="Switch to Portuguese" />
			</View>
		</View>
	);

	//
}
