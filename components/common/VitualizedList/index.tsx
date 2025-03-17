/* * */

import { NoDatabLabel } from '@/components/common/layout/NoDataLabel';
import { StyleSheet, Text, View, VirtualizedList } from 'react-native';

/* * */
interface Props {
	data: unknown[]
	items: number
}
/* * */
export function VirtualizedListing({ data, items }: Props) {
	//

	//
	// A. Setup variables

	const styles = StyleSheet.create({
		itemContainer: {
			padding: 20,
		},
		itemText: {
			fontSize: 20,
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
			initialNumToRender={items}
			keyExtractor={item => item.id}
			renderItem={renderItem}
			ListEmptyComponent={(
				<NoDatabLabel />
			)}
		/>
	);

	//
}
