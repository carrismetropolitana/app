/* * */

import { NoDatabLabel } from '@/components/common/layout/NoDataLabel';
import { StopDisplay } from '@/components/stops/StopDisplay';
import { ListItem } from '@rneui/themed';
import { Link } from 'expo-router';
import { VirtualizedList } from 'react-native';

/* * */
interface Props {
	data: unknown[]
	items: number
	size?: 'lg' | 'md'
}
/* * */
export function VirtualizedListingStops({ data, items, size }: Props) {
	//

	//
	// A. Fetch data

	const getItem = (data: [], index: number) => data[index];

	//
	// B. Render components

	const renderItem = ({ item }) => (
		<ListItem bottomDivider>
			<ListItem.Content>
				<Link href={`/stop/${item.id}`}>
					<StopDisplay size={size} stopData={item} />
				</Link>
			</ListItem.Content>
			<ListItem.Chevron />
		</ListItem>
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
