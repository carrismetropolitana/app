/* * */

import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetSmartNotificationConfigScheduleInputProps {
	onChange: (value: number) => void
	value: number
}

/* * */

export function WidgetSmartNotificationConfigScheduleInput({ onChange, value }: WidgetSmartNotificationConfigScheduleInputProps) {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetSmartNotificationConfigScheduleInput' });

	//
	// B. Render components

	return (
		<View style={useStyles().container}>
			<TextInput
				keyboardType="number-pad"
				onChangeText={text => onChange(Number(text))}
				style={useStyles().input}
				value={value ? value.toString() : ''}
			/>
			<Text style={useStyles().text}>{t('unit')}</Text>
		</View>
	);

	//
};
