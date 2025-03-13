import StopsScreen from '@/components/screens/StopsScreen';
import { useVehicles } from '@/hooks/dataFetching/useVehicles';
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

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
});
