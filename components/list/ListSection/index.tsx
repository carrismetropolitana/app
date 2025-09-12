/* * */

import { ListSectionItem, type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { Text, View } from 'react-native';

import { styles } from './styles';

/* * */

interface ListSectionProps {
	items?: ListSectionItemProps[]
	title: string
}

/* * */

export function ListSection({ items = [], title = 'Section Title' }: ListSectionProps) {
	//

	//
	// A. Setup variables

	const sectionStyles = styles();

	//
	// B. Render components

	return (
		<View accessibilityLabel={title} role="list" style={sectionStyles.container}>
			<Text style={sectionStyles.title}>{title}</Text>
			<View style={sectionStyles.itemsWrapper}>
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

	//
}
