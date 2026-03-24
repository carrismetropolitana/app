/* * */

import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetSmartNotificationConfigDistanceInputProps {
	onChange: (value: number) => void
	value: number
}

/* * */

export function WidgetSmartNotificationConfigDistanceInput({ onChange, value }: WidgetSmartNotificationConfigDistanceInputProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const { t } = useTranslation();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<TextInput
				keyboardType="number-pad"
				onChangeText={text => onChange(Number(text))}
				style={styles.input}
				value={value ? value.toString() : ''}
			/>
			<Text style={styles.text}>{t($ => $.widgets.WidgetSmartNotificationConfigDistanceInput.unit)}</Text>
		</View>
	);

	//
};
