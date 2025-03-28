/* * */

import { NoDatabLabel } from '@/components/common/layout/NoDataLabel';
import { LineDisplay } from '@/components/lines/LineDisplay';
import { useThemeContext } from '@/contexts/Theme.context';
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
export function VirtualizedListingLines({ data, items, size }: Props) {
	//

	//
	// A. Fetch data

	const getItem = (data: [], index: number) => data[index];

	//
	// B. Render components

	const renderItem = ({ item }) => (
		<ListItem bottomDivider topDivider>
			<ListItem.Content>
				<Link href={`/line/${item.id}`}>
					<LineDisplay lineData={item} size={size} />
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
