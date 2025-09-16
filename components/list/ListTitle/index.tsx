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
	return (
		<View style={useStyles().container}>
			<Text style={useStyles().title}>{title}</Text>
			{description && <Text style={useStyles().description}>{description}</Text>}
		</View>
	);
}
