/* * */

import { useStopsContext } from '@/contexts/Stops.context';
import { Text } from '@rn-vui/themed';
import { useMemo } from 'react';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WaypointHeaderProps {
	stopId: string
}

/* * */

export function WaypointHeader({ stopId }: WaypointHeaderProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const stopsContext = useStopsContext();

	//
	// B. Transform data

	const stopName = useMemo(() => {
		const stopData = stopsContext.actions.getStopById(stopId);
		return stopData ? stopData.long_name : '-';
	}, [stopsContext.data.stops, stopId]);

	const stopLocation = useMemo(() => {
		return stopsContext.actions.getStopLocationById(stopId);
	}, [stopsContext.data.stops, stopId]);

	//
	// C. Render components

	return (
		<View style={styles.container}>

			<Text style={styles.stopName}>{stopName}</Text>

			<Text style={styles.subHeader}>
				{stopLocation}
				<Text style={styles.divider}> • </Text>
				#{stopId}
			</Text>

		</View>
	);

	//
}
