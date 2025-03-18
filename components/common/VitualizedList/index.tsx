/* * */

import { NoDatabLabel } from '@/components/common/layout/NoDataLabel';
import { LineDisplay } from '@/components/lines/LineDisplay';
import { RegularListItem } from '@/components/RegularListItem';
import { StyleSheet, Text, VirtualizedList } from 'react-native';

/* * */
interface Props {
	data: unknown[]
	items: number
	variant?: 'lines' | 'stops'
}
/* * */
export function VirtualizedListing({ data, items, variant,
}: Props) {
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
		variant === 'lines'
			? (
				<RegularListItem href="#">
					<LineDisplay lineData={item} />
				</RegularListItem>
			)
			: (
				<RegularListItem href="#">
					<Text style={styles.itemText}>{item.long_name}</Text>
				</RegularListItem>
			)

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
