import { useStopsContext } from '@/contexts/Stops.context';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function Stops() {
	//
	const stopsContext = useStopsContext();
	//
	// A. Setup variables

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

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Stops</Text>
			<FlatList
				data={stopsContext.data.stops}
				keyExtractor={item => item.id.toString()}
				renderItem={({ item }) => <Text>{item.long_name}</Text>}
			/>
		</View>
	);

	//
}
