/* * */

import { ListSectionItem } from '@/components/list/ListSectionItem';
import { type Line } from '@carrismetropolitana/api-types/network';
import { IconCirclePlus } from '@tabler/icons-react-native';

/* * */

interface WidgetConfigSelectLineListItemProps {
	item: Line
	onPress: (line: Line) => void
}

/* * */

export function WidgetConfigSelectLineListItem({ item, onPress }: WidgetConfigSelectLineListItemProps) {
	return (
		<ListSectionItem
			key={item.id}
			label={item.long_name}
			onPress={() => onPress(item)}
			replaceChevron={<IconCirclePlus size={24} />}
		/>
	);
}
