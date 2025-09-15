/* * */

import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface ListTitleProps {
	subtitle?: string
	title: string
}

/* * */

export function ListTitle({ subtitle, title = 'Section Title' }: ListTitleProps) {
	return (
		<View style={useStyles().container}>
			<Text style={useStyles().title}>{title}</Text>
			{subtitle && <Text style={useStyles().subtitle}>{subtitle}</Text>}
		</View>
	);
}
