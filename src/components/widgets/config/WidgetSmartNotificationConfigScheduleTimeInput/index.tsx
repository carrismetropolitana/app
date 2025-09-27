/* * */

import RNDateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetSmartNotificationConfigScheduleTimeInputProps {
	onChange: (value: number) => void
	title: string
	value: number
}

/* * */

export function WidgetSmartNotificationConfigScheduleTimeInput({ onChange, title, value }: WidgetSmartNotificationConfigScheduleTimeInputProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Transform data

	const parsedDateValue = useMemo(() => {
		// From 0 to 86400 seconds (24h), create a new Date object
		if (value < 0 || value > 86400) return new Date('2025-01-01T12:00:00');
		const hours = Math.floor(value / 3600);
		const minutes = Math.floor((value % 3600) / 60);
		return new Date(`2025-01-01T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
	}, [value]);

	//
	// C. Handle actions

	const handleChange = (event: DateTimePickerEvent, date: Date | undefined) => {
		// From a Date object, get the hours
		// and minutes and convert to seconds
		const hours = date?.getHours() ?? 12;
		const minutes = date?.getMinutes() ?? 0;
		const totalSeconds = hours * 3600 + minutes * 60;
		onChange(totalSeconds);
	};

	//
	// D. Render components

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{title}</Text>
			<RNDateTimePicker
				accessibilityLabel={title}
				locale="pt-PT"
				minuteInterval={5}
				mode="time"
				onChange={handleChange}
				value={parsedDateValue}
			/>
		</View>
	);

	//
};
