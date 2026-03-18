/* * */

import { useStopsContext } from '@/contexts/Stops.context';
import { WidgetSmartNotification } from '@/schemas/widgets';
import { type Line, type Waypoint } from '@carrismetropolitana/api-types/network';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetSmartNotificationConfigWarningProps {
	selectedDistance: number
	selectedEndTime: number
	selectedLine?: Line
	selectedStartTime: number
	selectedWaypoint?: Waypoint
	selectedWeekdays: WidgetSmartNotification['properties']['weekdays'][number][]
}

/* * */

export function WidgetSmartNotificationConfigWarning({ selectedDistance, selectedEndTime, selectedLine, selectedStartTime, selectedWaypoint, selectedWeekdays }: WidgetSmartNotificationConfigWarningProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const stopsContext = useStopsContext();

	const { t } = useTranslation();

	//
	// B. Transform data

	const weekdaysDisplay = useMemo(() => {
		// If no days are selected
		if (selectedWeekdays.length === 0) {
			return null;
		}
		// If all days are selected
		if (selectedWeekdays.length === 7) {
			return t($ => $.widgets.WidgetSmartNotificationConfigWarning.weekdays.every_day);
		}
		// If only weekdays are selected
		if (selectedWeekdays.length === 5 && !selectedWeekdays.includes('saturday') && !selectedWeekdays.includes('sunday')) {
			return t($ => $.widgets.WidgetSmartNotificationConfigWarning.weekdays.business_days);
		}
		// If only weekend days are selected
		if (selectedWeekdays.length === 2 && selectedWeekdays.includes('saturday') && selectedWeekdays.includes('sunday')) {
			return t($ => $.widgets.WidgetSmartNotificationConfigWarning.weekdays.weekends);
		}
		// Otherwise, list the selected days
		return selectedWeekdays
			.sort((a, b) => {
				const order = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
				return order.indexOf(a) - order.indexOf(b);
			})
			.map(day => t($ => $.widgets.WidgetSmartNotificationConfigWarning.weekdays[day])).join(', ');
	}, [selectedWeekdays, t]);

	const stopNameDisplay = useMemo(() => {
		if (!selectedWaypoint) return null;
		const foundStop = stopsContext.actions.getStopById(selectedWaypoint.stop_id);
		if (!foundStop) return null;
		return foundStop.long_name;
	}, [selectedWaypoint, stopsContext.actions]);

	const startTimeDisplay = useMemo(() => {
		// Convert seconds (0-86400) to HH:M
		const hours = Math.floor(selectedStartTime / 3600);
		const minutes = Math.floor((selectedStartTime % 3600) / 60);
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
	}, [selectedStartTime]);

	const endTimeDisplay = useMemo(() => {
		// Convert seconds (0-86400) to HH:MM
		const hours = Math.floor(selectedEndTime / 3600);
		const minutes = Math.floor((selectedEndTime % 3600) / 60);
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
	}, [selectedEndTime]);

	//
	// C. Render components

	if (!selectedLine || !selectedWaypoint || !selectedDistance || selectedDistance < 500 || selectedWeekdays.length === 0) {
		return null;
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				{t($ => $.widgets.WidgetSmartNotificationConfigWarning.title)}
			</Text>
			<Text style={styles.summary}>
				{t($ => $.widgets.WidgetSmartNotificationConfigWarning.summary, {
					distance: selectedDistance,
					end_time: endTimeDisplay,
					line_short_name: selectedLine.short_name,
					start_time: startTimeDisplay,
					stop_name: stopNameDisplay,
					weekdays: weekdaysDisplay,
				})}
			</Text>
			<Text style={styles.disclaimer}>
				{t($ => $.widgets.WidgetSmartNotificationConfigWarning.disclaimer)}
			</Text>
		</View>
	);

	//
};
