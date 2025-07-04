/* * */

import type { Stop } from '@carrismetropolitana/api-types/network';

import { Skeleton, Text } from '@rn-vui/base';
import { View } from 'react-native';

import { StopDisplayLocation } from '../StopDisplayLocation';
import { StopDisplayName } from '../StopDisplayName';
import { styles } from './styles';

/* * */

interface Props {
	size?: 'lg' | 'md'
	skeletonWidth?: number
	stopData?: Stop
}

/* * */

export function StopDisplay({ size = 'md', skeletonWidth = 200, stopData }: Props) {
	//

	//
	// A. Setup variables

	const stopDisplayStyle = styles();

	//
	// B. Render components

	return stopData
		? (
			<View style={[stopDisplayStyle.container, size === 'lg' ? stopDisplayStyle.lg : stopDisplayStyle.md]}>
				<StopDisplayName longName={stopData.long_name} />
				<StopDisplayLocation localityId={stopData.locality_id} municipalityId={stopData.municipality_id} />
			</View>
		)
		: (
			<View style={{ flex: 1 }}>
				<Skeleton height={24} width={skeletonWidth} />
				<Text>...</Text>
			</View>
		);

	//
}
