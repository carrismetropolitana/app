/* * */

import { Text } from '@rneui/themed';

import { styles } from './styles';

/* * */

interface Props {
	longName?: string
	size?: 'lg' | 'md'
}

/* * */

export function StopDisplayName({ longName, size = 'md' }: Props) {
	const longNameStyles = [
		size === 'lg' ? styles.lg : styles.md,
	];

	return longName && (
		<Text style={longNameStyles}>
			{longName}
		</Text>
	);
}
