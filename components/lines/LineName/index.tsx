/* * */

import type { Line } from '@carrismetropolitana/api-types/network';

import { Text } from '@rn-vui/themed';
import { View } from 'react-native';

import { lineNameStyles } from './styles';

/* * */

interface Props {
	align?: 'center' | 'left' | 'right'
	lineData?: Line
	longName?: string
	municipality?: string[]
}
/* * */

export function LineName({ align = 'left', lineData, longName, municipality }: Props) {
	//

	//
	// A. Setup variables

	const styles = [
		municipality && lineNameStyles.container,
		align === 'center' && lineNameStyles.alignCenter,
		align === 'right' && lineNameStyles.alignRight,
		align === 'left' && lineNameStyles.alignleft,
	];

	//
	// B. Render components

	return (
		<View style={[styles]}>
			<Text style={lineNameStyles.name}>{lineData?.long_name || longName || '• • •'}</Text>
			{municipality && <Text>LdfdfdLdfdfdLdfdfdLdfdfdLdfdfdLdfdfdLdfdfdLdfdfdfddfjsdhfjsL</Text>}
		</View>
	);

	//
}
