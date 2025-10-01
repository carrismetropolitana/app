/* * */

import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

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

	const [hoursString, setHoursString] = useState('12');
	const [minutesString, setMinutesString] = useState('00');

	//
	// B. Transform data

	const convertSecondsToString = (seconds: number) => {
		// From 0 to 86400 seconds (24h),
		// create hours and minutes strings
		if (seconds < 0 || seconds > 86400) return;
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const formattedHours = hours.toString().padStart(2, '0');
		const formattedMinutes = minutes.toString().padStart(2, '0');
		return { hours: formattedHours, minutes: formattedMinutes };
	};

	const convertStringToSeconds = (h: string, m: string) => {
		// Transform hours and minutes strings
		// back into total seconds and call onChange callback
		if (h.length === 0 || m.length === 0) return;
		// Parse to integers
		const hoursInt = parseInt(h, 10);
		const minutesInt = parseInt(m, 10);
		// Guard against NaN
		if (isNaN(hoursInt) || isNaN(minutesInt)) return;
		// Calculate total seconds
		return hoursInt * 3600 + minutesInt * 60;
	};

	//
	// C. Handle actions

	useEffect(() => {
		// Update local hours and minutes state
		const result = convertSecondsToString(value);
		// Skip if conversion failed
		if (!result) return;
		// Update state
		setHoursString(result.hours ?? '12');
		setMinutesString(result.minutes ?? '00');
	}, [value]);

	const handleChangeHours = (text: string) => {
		// Remove non-digit characters
		text = text.replace(/\D/g, '');
		// If empty, reset to '00'
		if (text.length === 0) {
			setHoursString('');
			return;
		}
		// keep only the last 2 digits typed
		if (text.length > 2) text = text.slice(-2);
		// Parse to integer and clamp to 0-23
		let num = parseInt(text, 10);
		if (num > 23) num = 23;
		// Pad with leading zero if < 10
		const newValue = num.toString().padStart(2, '0');
		// Update state with formatted value
		setHoursString(newValue);
		// Call onChange with new total seconds
		const totalSeconds = convertStringToSeconds(newValue, minutesString);
		if (totalSeconds !== undefined) onChange(totalSeconds);
	};

	const handleChangeMinutes = (text: string) => {
		// Remove non-digit characters
		text = text.replace(/\D/g, '');
		// If empty, reset to '00'
		if (text.length === 0) {
			setMinutesString('');
			return;
		}
		// keep only the last 2 digits typed
		if (text.length > 2) text = text.slice(-2);
		// Parse to integer and clamp to 0-59
		let num = parseInt(text, 10);
		if (num > 59) num = 59;
		// Pad with leading zero if < 10
		const newValue = num.toString().padStart(2, '0');
		// Update state with formatted value
		setMinutesString(newValue);
		// Call onChange with new total seconds
		const totalSeconds = convertStringToSeconds(hoursString, newValue);
		if (totalSeconds !== undefined) onChange(totalSeconds);
	};

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{title}</Text>
			<View style={styles.wrapper}>
				<TextInput
					keyboardType="number-pad"
					onChange={event => handleChangeHours(event.nativeEvent.text)}
					onFocus={() => setHoursString('')}
					returnKeyType="done"
					style={styles.input}
					value={hoursString}
				/>
				<Text style={styles.divider}>:</Text>
				<TextInput
					keyboardType="number-pad"
					onChange={event => handleChangeMinutes(event.nativeEvent.text)}
					onFocus={() => setMinutesString('')}
					returnKeyType="done"
					style={styles.input}
					value={minutesString}
				/>
			</View>
		</View>
	);

	//
};
