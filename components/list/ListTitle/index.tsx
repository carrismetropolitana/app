/* * */

import { Text } from 'react-native';

import { useStyles } from './styles';

/* * */

interface ListTitleProps {
	title: string
}

/* * */

export function ListTitle({ title = 'Section Title' }: ListTitleProps) {
	return <Text style={useStyles().title}>{title}</Text>;
}
