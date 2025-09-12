/* * */

import { ListSectionItem, type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface ListSectionProps {
	items?: ListSectionItemProps[]
	title: string
}

/* * */

export function ListSection({ items = [], title = 'Section Title' }: ListSectionProps) {
	return (
		<View accessibilityLabel={title} role="list" style={useStyles().container}>
			<Text style={useStyles().title}>{title}</Text>
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
