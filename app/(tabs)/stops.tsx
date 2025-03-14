import { useStopsContext } from '@/contexts/Stops.context';
import { SafeAreaView, StyleSheet, Text, View, VirtualizedList } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface Stop {
	id: string
	long_name: string
	// Add other properties from your actual data structure
}

export default function Stops() {
	const stopsContext = useStopsContext();
	const stops = stopsContext.data.stops;

	// Style definition
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			width: '100%',
		},
		itemContainer: {
			borderBottomColor: '#eee',
			borderBottomWidth: 1,
			padding: 16,
		},
		itemText: {
			fontSize: 16,
		},
	});

	// Get item function for VirtualizedList
	const getItem = (data: Stop[], index: number): Stop => data[index];

	// Render item component
	const renderItem = ({ item }: { item: Stop }) => (
		<View style={styles.itemContainer}>
			<Text style={styles.itemText}>{item.long_name}</Text>
		</View>
	);

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<VirtualizedList
					data={stops}
					getItem={getItem}
					getItemCount={data => data?.length || 0}
					initialNumToRender={15}
					keyExtractor={(item: Stop) => item.id}
					renderItem={renderItem}
					ListEmptyComponent={(
						<View style={styles.itemContainer}>
							<Text>No stops available</Text>
						</View>
					)}
				/>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}
