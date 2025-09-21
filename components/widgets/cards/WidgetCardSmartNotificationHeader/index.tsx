/* * */

import { Dates } from '@/core-replica';
import { WidgetSmartNotification } from '@/schemas/widgets';
import { IconBellRinging } from '@tabler/icons-react-native';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetCardSmartNotificationHeaderProps {
	label?: null | string
	selectedStartTime: number
	selectedWeekdays: WidgetSmartNotification['properties']['weekdays'][number][]
}

/* * */

export function WidgetCardSmartNotificationHeader({ label, selectedStartTime, selectedWeekdays }: WidgetCardSmartNotificationHeaderProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const [nowAsSeconds, setNowAsSeconds] = useState<number>(0);

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetCardSmartNotificationHeader' });

	//
	// B. Transform data

	useEffect(() => {
		const interval = setInterval(() => {
			const currentHour = Dates
				.now('Europe/Lisbon')
				.toFormat('H');
			const currentMinute = Dates
				.now('Europe/Lisbon')
				.toFormat('m');
			const currentSecond = Dates
				.now('Europe/Lisbon')
				.toFormat('s');
			setNowAsSeconds(Number(currentHour) * 3600 + Number(currentMinute) * 60 + Number(currentSecond));
		}, 120_000);
		return () => clearInterval(interval);
	}, []);

	const nextWeekdayDisplay = useMemo(() => {
		// If no days are selected
		if (selectedWeekdays.length === 0) return;
		// Get the current date
		const todayAsWeekdayIndex = Dates
			.now('Europe/Lisbon')
			.toFormat('c');
		// Weekdays order to compare with
		const weekdaysOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
		// Map the selected weekdays to their respective indexes
		const selectedWeekdaysIndexes = selectedWeekdays
			.map(day => weekdaysOrder.indexOf(day))
			.sort((a, b) => a - b);
		// Get the current time to check if today is a valid option
		if (nowAsSeconds < selectedStartTime) selectedWeekdaysIndexes.push(Number(todayAsWeekdayIndex) % 7);
		// Find the next selected weekday index
		const nextSelectedWeekdayIndex = selectedWeekdaysIndexes.find(index => index >= (Number(todayAsWeekdayIndex) % 7));
		// Get the name of the next selected weekday
		if (nextSelectedWeekdayIndex !== undefined) return weekdaysOrder[nextSelectedWeekdayIndex];
	}, [selectedWeekdays]);

	const startTimeDisplay = useMemo(() => {
		// Convert seconds (0-86400) to HH:M
		const hours = Math.floor(selectedStartTime / 3600);
		const minutes = Math.floor((selectedStartTime % 3600) / 60);
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
	}, [selectedStartTime]);

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<IconBellRinging color="#0C807E" size={30} />
			<View style={styles.column}>
				{label && <Text style={styles.label}>{label}</Text>}
				<Text style={styles.title}>{t('title', { start_time: startTimeDisplay, weekday: nextWeekdayDisplay })}</Text>
			</View>
		</View>
	);

	//
}
