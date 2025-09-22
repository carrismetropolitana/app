/* * */

import { ListSectionItem } from '@/components/list/ListSectionItem';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { IconCirclePlus } from '@tabler/icons-react-native';

/* * */

interface WidgetConfigSelectStopListItemProps {
	item: Stop
	onPress: (stop: Stop) => void
}

/* * */

export function WidgetConfigSelectStopListItem({ item, onPress }: WidgetConfigSelectStopListItemProps) {
	return (
		<ListSectionItem
			key={item.id}
			label={item.long_name}
			onPress={() => onPress(item)}
			replaceChevron={<IconCirclePlus size={24} />}
		/>
	);
}
