/* * */

import type { Stop } from '@carrismetropolitana/api-types/network';

import { Skeleton, Text } from '@rneui/base';
import { View } from 'react-native';

import { StopDisplayLocation } from '../StopDisplayLocation';
import { StopDisplayName } from '../StopDisplayName';
import styles from './styles.module.css';

/* * */

interface Props {
	size?: 'lg' | 'md'
	skeletonWidth?: number
	stopData?: Stop
}

/* * */

export function StopDisplay({ size = 'md', skeletonWidth = 200, stopData }: Props) {
	return stopData
		? (
			// className={``}
			<View style={[styles.container, styles[size]]}>
				<StopDisplayName longName={stopData.long_name} />
				<StopDisplayLocation localityId={stopData.locality_id} municipalityId={stopData.municipality_id} />
			</View>
		)
		: (
			// className={styles.container}>
			<View style={{ flex: 1 }}>
				<Skeleton height={24} width={skeletonWidth} />
				<Text>...</Text>
			</View>
		);
}
