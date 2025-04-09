/* * */

import { NoDatabLabel } from '@/components/common/layout/NoDataLabel';
import { LineDisplay } from '@/components/lines/LineDisplay';
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
export function VirtualizedListingLines({ data, icon, itemClick, items, size }: Props) {
	//

	//
	// A. Fetch data

	const getItem = (data: [], index: number) => data[index];

	//
	// B. Render components

	const renderItem = ({ item }) => (
		<ListItem bottomDivider topDivider>
			<ListItem.Content>
				{itemClick
					? (
						<TouchableOpacity onPress={() => itemClick(item)}>
							<LineDisplay lineData={item} size={size} />
						</TouchableOpacity>
					)
					: (
						<Link href={`/line/${item.id}`}>
							<LineDisplay lineData={item} size={size} />
						</Link>
					)}
			</ListItem.Content>
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
