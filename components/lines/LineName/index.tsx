/* * */

import type { Line } from '@carrismetropolitana/api-types/network';

import { Text, View } from 'react-native';

import { lineNameStyles } from './styles';

/* * */

interface Props {
	align?: 'center' | 'left' | 'right'
	lineData?: Line
	longName?: string
	size?: 'lg' | 'md'
}
/* * */

export function LineName({ align = 'left', lineData, longName, size = 'md' }: Props) {
	//

	//
	// A. Setup variables

	const styles = [
		align === 'center' && lineNameStyles.alignCenter,
		align === 'right' && lineNameStyles.alignRight,
		align === 'left' && lineNameStyles.alignleft,
		size === 'lg' && lineNameStyles.sizeLg,
		size === 'md' && lineNameStyles.sizeMd,
	];

	//
	// B. Render components

	return (
		<View style={styles}>
			<Text style={lineNameStyles.name}>{lineData?.long_name || longName || '• • •'}</Text>
		</View>
	);

	//
}
