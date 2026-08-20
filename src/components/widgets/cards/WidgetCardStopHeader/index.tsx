/* * */

import { useStopsContext } from '@/contexts/Stops.context';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetCardStopHeaderProps {
	label?: null | string
	stopId: string
}

/* * */

export function WidgetCardStopHeader({ label, stopId }: WidgetCardStopHeaderProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const stopsContext = useStopsContext();

	const { t } = useTranslation();

	//
	// B. Transform data

	const stopData = useMemo(() => {
		return stopsContext.actions.getStopById(stopId);
	}, [stopId, stopsContext.actions]);

	const locationName = useMemo(() => {
		// Skip if no stop data is available
		if (!stopData?._id) return;
		// Return formatted location or fallback
		return stopsContext.actions.getStopLocationById(stopData._id.toString());
	}, [stopData?._id, stopsContext.actions]);

	//
	// C. Render components

	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}
			<Text accessibilityLabel={stopData?.tts_name ?? t($ => $.widgets.WidgetCardStopHeader.no_name)} style={styles.stopName}>{stopData?.name ?? t($ => $.widgets.WidgetCardStopHeader.no_name)}</Text>
			{locationName && <Text style={styles.locationName}>{locationName}</Text>}
		</View>
	);

	//
}
