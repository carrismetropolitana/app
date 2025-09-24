/* * */

import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface ListTitleProps {
	description?: string
	title: string
}

/* * */

export function ListTitle({ description, title = 'Section Title' }: ListTitleProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
			{description && <Text style={styles.description}>{description}</Text>}
		</View>
	);

	//
}
