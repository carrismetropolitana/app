/* * */

import { IconDisplay } from '@/components/common/IconDisplay';
import { useStopsContext } from '@/contexts/Stops.context';
import { useMemo } from 'react';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WaypointFacilitiesProps {
	stopId: string
}

/* * */

export function WaypointFacilities({ stopId }: WaypointFacilitiesProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const stopsContext = useStopsContext();

	//
	// B. Transform data

	const facilitiesData = useMemo(() => {
		return stopsContext.actions.getStopById(stopId)?.facilities ?? [];
	}, [stopsContext.actions, stopId]);

	//
	// C. Render components

	return (
		<View style={styles.container}>
			{facilitiesData.map(facility => (
				<IconDisplay
					key={facility}
					category="facilities"
					name={facility}
				/>
			))}
		</View>
	);

	//
}
