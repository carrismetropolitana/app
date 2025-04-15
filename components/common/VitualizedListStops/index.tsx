/* * */

import { NoDatabLabel } from '@/components/common/layout/NoDataLabel';
import { StopDisplay } from '@/components/stops/StopDisplay';
import { ListItem } from '@rneui/themed';
import { Link } from 'expo-router';
import { TouchableOpacity, VirtualizedList } from 'react-native';

/* * */
interface Props {
	data: unknown[]
	icon?: React.ReactNode
	itemClick?: (item) => void
	items?: number
	size?: 'lg' | 'md'
}
/* * */
export function VirtualizedListingStops({ data, icon, itemClick, items, size }: Props) {
	//

	//
	// A. Fetch data

	const getItem = (data: [], index: number) => data[index];

	//
	// B. Render components
	const renderItem = ({ item }) => (
		<ListItem bottomDivider topDivider>
			{itemClick
				? (
					<ListItem.Content>
						<ListItem.Title>
							<TouchableOpacity onPress={() => itemClick(item)}>
								<StopDisplay size={size} stopData={item} />
							</TouchableOpacity>
						</ListItem.Title>
					</ListItem.Content>
				)
				: (
					<ListItem.Content>
						<Link href={`/stop/${item.id}`}>
							<StopDisplay size={size} stopData={item} />
						</Link>
					</ListItem.Content>
				)}

			{icon ? icon : <ListItem.Chevron /> }
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
			showsVerticalScrollIndicator={false}
			ListEmptyComponent={(
				<NoDatabLabel />
			)}
		/>
	);

	//
}
