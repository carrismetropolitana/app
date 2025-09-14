/* * */

import { ListSectionItem, type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { ListTitle } from '@/components/list/ListTitle';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface ListSectionProps {
	items?: ListSectionItemProps[]
	title?: string
}

/* * */

export function ListSection({ items = [], title }: ListSectionProps) {
	return (
		<View accessibilityLabel={title} role="list" style={useStyles().container}>
			{title && <ListTitle title={title} />}
			<View style={useStyles().itemsWrapper}>
				{items.map(element => (
					<ListSectionItem
						key={element.key}
						icon={element.icon}
						label={element.label}
						link={element.link}
						replaceChevron={element.replaceChevron}
					/>
				))}
			</View>
		</View>
	);
}
