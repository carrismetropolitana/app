/* * */

import { IconDisplay } from '@/components/common/IconDisplay';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { type Waypoint } from '@carrismetropolitana/api-types/network';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface PathWaypointHeaderProps {
	isFirstStop?: boolean
	isLastStop?: boolean
	isSelected: boolean
	waypointData: Waypoint
}

/* * */

export function PathWaypointHeader({ isFirstStop, isLastStop, isSelected, waypointData }: PathWaypointHeaderProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const stopsContext = useStopsContext();
	const locationsContext = useLocationsContext();

	const { t } = useTranslation('translation', { keyPrefix: 'pathWaypoint' });

	//
	// B. Fetch data

	const stopData = stopsContext.actions.getStopById(waypointData.stop_id);
	const localityData = stopData?.locality_id ? locationsContext.actions.getLocalityById(stopData.locality_id) : undefined;
	const municipalityData = stopData?.municipality_id ? locationsContext.actions.getMunicipalityById(stopData.municipality_id) : undefined;

	//
	// D. Render components

	if (!stopData) {
		return null;
	}

	return (
		<View style={styles.container}>

			<Text style={styles.stopName}>{stopData.long_name}</Text>

			<View style={styles.subHeaderWrapper}>
				<Text style={styles.stopLocation}>{localityData?.display || municipalityData?.name}</Text>
				<Text style={styles.stopId}>#{stopData.id}</Text>
			</View>

			{isSelected && stopData.facilities.length > 0 && (
				<View style={styles.facilitiesWrapper}>
					{stopData.facilities.map(facility => (
						<View key={facility}>
							<IconDisplay category="facilities" name={facility} />
						</View>
					))}
				</View>
			)}

		</View>
	);

	//
}
