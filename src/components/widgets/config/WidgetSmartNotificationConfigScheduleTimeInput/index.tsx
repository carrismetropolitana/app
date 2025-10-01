/* * */

import { useMemo, useState } from 'react';
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

	const [hours, setHours] = useState('12');
	const [minutes, setMinutes] = useState('00');

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

	const handleChangeMinutes = (text: string) => {
		// Only keep digits
		text = text.replace(/\D/g, '');
		if (text.length === 0) {
			setMinutes('00');
			return;
		}
		// Take at most 2 digits (minutes are 0–59)
		if (text.length > 2) {
			text = text.slice(-2); // keep last 2 digits typed
		}
		let num = parseInt(text, 10);
		// Clamp to 0–59
		if (num > 59) {
			num = 59;
		}
		// Pad with leading zero if < 10
		const newMinutes = num.toString().padStart(2, '0');
		setMinutes(newMinutes);
	};

	// const handleChange = (event) => {
	// From a Date object, get the hours
	// and minutes and convert to seconds
	// const hours = date?.getHours() ?? 12;
	// const minutes = date?.getMinutes() ?? 0;
	// const totalSeconds = hours * 3600 + minutes * 60;
	// onChange(totalSeconds);
	// };

	//
	// D. Render components

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{title}</Text>
			<View style={styles.wrapper}>
				<TextInput
					keyboardType="number-pad"
					onChange={event => setHours(event.nativeEvent.text)}
					returnKeyType="done"
					style={styles.input}
					value={hours}
				/>
				<Text style={styles.divider}>:</Text>
				<TextInput
					keyboardType="number-pad"
					onChange={event => handleChangeMinutes(event.nativeEvent.text)}
					returnKeyType="done"
					style={styles.input}
					value={minutes}
				/>
			</View>
		</View>
	);

	//
};
