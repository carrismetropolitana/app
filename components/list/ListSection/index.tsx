/* * */

import { ListSectionItem, type ListSectionItemProps } from '@/components/list/ListSectionItem';
import { ListTitle } from '@/components/list/ListTitle';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface ListSectionProps {
	description?: string
	items?: ListSectionItemProps[]
	title?: string
}

/* * */

export function ListSection({ description, items = [], title }: ListSectionProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View accessibilityLabel={title} role="list" style={styles.container}>
			{title && <ListTitle description={description} title={title} />}
			<View style={styles.itemsWrapper}>
				{items.map(element => (
					<ListSectionItem
						key={element.key}
						icon={element.icon}
						label={element.label}
						link={element.link}
						onPress={element.onPress}
						replaceChevron={element.replaceChevron}
					/>
				))}
			</View>
		</View>
	);
}
