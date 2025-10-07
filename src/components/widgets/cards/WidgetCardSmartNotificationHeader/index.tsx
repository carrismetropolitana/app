/* * */

import { WidgetSmartNotification } from '@/schemas/widgets';
import { IconBellRinging } from '@tabler/icons-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetCardSmartNotificationHeaderProps {
	label?: null | string
	selectedEndTime: number
	selectedStartTime: number
	selectedWeekdays: WidgetSmartNotification['properties']['weekdays'][number][]
}

/* * */

export function WidgetCardSmartNotificationHeader({ label, selectedEndTime, selectedStartTime, selectedWeekdays }: WidgetCardSmartNotificationHeaderProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetCardSmartNotificationHeader' });

	//
	// B. Transform data

	const startTimeDisplay = useMemo(() => {
		// Convert seconds (0-86399) to HH:MM format
		if (!selectedStartTime && selectedStartTime !== 0) return;
		const hours = Math.floor(selectedStartTime / 3600);
		const minutes = Math.floor((selectedStartTime % 3600) / 60);
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
	}, [selectedStartTime]);

	const endTimeDisplay = useMemo(() => {
		// Convert seconds (0-86399) to HH:MM format
		if (!selectedEndTime && selectedEndTime !== 0) return;
		const hours = Math.floor(selectedEndTime / 3600);
		const minutes = Math.floor((selectedEndTime % 3600) / 60);
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
	}, [selectedEndTime]);

	const weekdaysDisplay = useMemo(() => {
		// If no days are selected
		if (selectedWeekdays.length === 0) return;
		// Weekdays order to compare with
		const weekdaysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
		// Map the selected weekdays to their respective indexes
		const selectedWeekdaysIndexes = selectedWeekdays
			.map(day => weekdaysOrder.indexOf(day))
			.sort((a, b) => a - b);
		// Check if all days are selected
		if (selectedWeekdaysIndexes.length === 7) return t('weekdays.everyday');
		// Check if only weekends are selected
		if (selectedWeekdaysIndexes.length === 2 && selectedWeekdaysIndexes.includes(5) && selectedWeekdaysIndexes.includes(6)) return t('weekdays.weekend');
		// Check if only weekdays are selected
		if (selectedWeekdaysIndexes.length === 5 && !selectedWeekdaysIndexes.includes(5) && !selectedWeekdaysIndexes.includes(6)) return t('weekdays.business_day');
		// Use the abbreviated format if 3 or more days are selected
		if (selectedWeekdaysIndexes.length > 3) return selectedWeekdaysIndexes.map(index => t(`weekdays_short.${weekdaysOrder[index]}`)).join(', ');
		// Use the full name format if less than 3 days are selected
		return selectedWeekdaysIndexes.map(index => t(`weekdays.${weekdaysOrder[index]}`)).join(', ');
	}, [selectedWeekdays]);

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<IconBellRinging color="#0C807E" size={30} />
			<View style={styles.column}>
				{label && <Text style={styles.label}>{label}</Text>}
				<Text style={styles.text}>{t('title', { end_time: endTimeDisplay, start_time: startTimeDisplay, weekdays: weekdaysDisplay })}</Text>
				{/* <Text style={styles.text}>Every {weekdaysDisplay} from {startTimeDisplay} to {endTimeDisplay}</Text> */}
				{/* <View style={styles.row}>
					<IconBoltFilled color={systemVariables.text[200]} size={16} />
					{weekdaysDisplay && <Text style={styles.text}>{weekdaysDisplay}</Text>}
				</View>
				<View style={styles.row}>
					<IconClock color={systemVariables.text[200]} size={16} />
					{startTimeDisplay && <Text style={styles.text}>{startTimeDisplay}</Text>}
					<IconArrowRight color={systemVariables.text[200]} size={16} />
					{endTimeDisplay && <Text style={styles.text}>{endTimeDisplay}</Text>}
				</View> */}
			</View>
		</View>
	);

	//
}
