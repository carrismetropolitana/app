/* * */

import { useLocationsContext } from '@/contexts/Locations.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { formatStopLocation } from '@/utils/formatStopLocation';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetCardSmartNotificationHeaderProps {
	label?: null | string
	stopId: string
}

/* * */

export function WidgetCardSmartNotificationHeader({ label, stopId }: WidgetCardSmartNotificationHeaderProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const stopsContext = useStopsContext();
	const locationsContext = useLocationsContext();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetCardSmartNotificationHeader' });

	//
	// B. Transform data

	const stopData = useMemo(() => {
		return stopsContext.actions.getStopById(stopId);
	}, [stopId]);

	const stopName = useMemo(() => {
		return stopData?.long_name ?? t('no_name');
	}, [stopData]);

	const locationName = useMemo(() => {
		// Skip if no stop data is available
		if (!stopData?.municipality_id) return;
		// Find municipality and locality
		const foundMunicipality = locationsContext.actions.getMunicipalityById(stopData.municipality_id);
		const foundLocality = locationsContext.actions.getLocalityById(stopData.locality_id);
		// Format the location name
		const formattedLocation = formatStopLocation(foundLocality?.name, foundMunicipality?.name);
		// Return formatted location or fallback
		return formattedLocation;
	}, [stopData]);

	//
	// C. Render components

	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}
			<Text style={styles.stopName}>{stopName}</Text>
			{locationName && <Text style={styles.locationName}>{locationName}</Text>}
		</View>
	);

	//
}
