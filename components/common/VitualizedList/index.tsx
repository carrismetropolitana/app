/* * */

import { NoDatabLabel } from '@/components/common/layout/NoDataLabel';
import { LineDisplay } from '@/components/lines/LineDisplay';
import { useThemeContext } from '@/contexts/Theme.context';
import { ListItem, Text } from '@rneui/themed';
import { Link } from 'expo-router';
import { StyleSheet, VirtualizedList } from 'react-native';

/* * */
interface Props {
	data: unknown[]
	items: number
	size?: 'lg' | 'md'
	variant?: 'lines' | 'stops'
}
/* * */
export function VirtualizedListing({ data, items, size, variant }: Props) {
	//

	//
	// A. Setup variables
	const themeContext = useThemeContext();
	const styles = StyleSheet.create({
		itemText: {
			color: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.primary : themeContext.theme.darkColors?.primary,
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
				<ListItem bottomDivider topDivider>
					<ListItem.Content>
						<Link href={`/line/${item.id}`}>
							<LineDisplay lineData={item} size={size} />
						</Link>
					</ListItem.Content>
					<ListItem.Chevron />
				</ListItem>
			)
			: (
				<ListItem bottomDivider>
					<ListItem.Content>
						<Link href={`/line/${item.id}`}>
							<Text style={styles.itemText}>{item.long_name}</Text>
						</Link>
					</ListItem.Content>
					<ListItem.Chevron />
				</ListItem>
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
