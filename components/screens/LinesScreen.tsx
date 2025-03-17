/* * */

import { useLinesContext } from '@/contexts/Lines.context';
import { SafeAreaView, StyleSheet, Text, View, VirtualizedList } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/* * */

interface Stop {
	id: string
	long_name: string
}

/* * */
export default function LinesScreen() {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const lines = linesContext.data.lines;

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
	//
	// B. Fetch Data

	const getItem = (data: Stop[], index: number): Stop => data[index];

	//
	// C. Render components

	const renderItem = ({ item }: { item: Stop }) => (
		<View style={styles.itemContainer}>
			<Text style={styles.itemText}>{item.long_name}</Text>
		</View>
	);
	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<VirtualizedList
					data={lines}
					getItem={getItem}
					getItemCount={data => data?.length || 0}
					initialNumToRender={15}
					keyExtractor={(item: Stop) => item.id}
					renderItem={renderItem}
					ListEmptyComponent={(
						<View style={styles.itemContainer}>
							<Text>No Lines available</Text>
						</View>
					)}
				/>
			</SafeAreaView>
		</SafeAreaProvider>
	);

	//
}
