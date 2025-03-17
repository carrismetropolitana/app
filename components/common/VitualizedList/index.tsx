/* * */

import { NoDatabLabel } from '@/components/common/NoDataLabel';
import { StyleSheet, Text, View, VirtualizedList } from 'react-native';

/* * */
interface Props {
	data: unknown[]
}
/* * */
export function VirtualizedListing({ data }: Props) {
	//

	//
	// A. Setup variables

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
	// B. Fetch data

	const getItem = (data: [], index: number) => data[index];

	//
	// C. Render components

	const renderItem = ({ item }) => (
		<View style={styles.itemContainer}>
			<Text style={styles.itemText}>{item.long_name}</Text>
		</View>
	);

	return (
		<VirtualizedList
			data={data}
			getItem={getItem}
			getItemCount={data => data?.length || 0}
			initialNumToRender={15}
			keyExtractor={item => item.id}
			renderItem={renderItem}
			ListEmptyComponent={(
				<NoDatabLabel />
			)}
		/>
	);

	//
}
