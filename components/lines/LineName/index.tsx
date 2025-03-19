/* * */

import type { Line } from '@carrismetropolitana/api-types/network';

import { Text, View } from 'react-native';

import { lineNameStyles } from './styles';

/* * */

interface Props {
	align?: 'center' | 'left' | 'right'
	lineData?: Line
	longName?: string
}
/* * */

export function LineName({ align = 'left', lineData, longName }: Props) {
	//

	//
	// A. Setup variables

	const styles = [
		align === 'center' && lineNameStyles.alignCenter,
		align === 'right' && lineNameStyles.alignRight,
		align === 'left' && lineNameStyles.alignleft,
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
