/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

/* * */

import styles from './styles';
/* * */

interface IntervalInputsProps {
	endingHour: Date | undefined
	setEndingHour: (date: Date) => void
	setStartingHour: (date: Date) => void
	startingHour: Date | undefined
}

/* * */

export const AddSmartNotificationsIntervalInputs = ({ endingHour, setEndingHour, setStartingHour, startingHour }: IntervalInputsProps) => {
	//

	//
	// A. Setup Variables
	const localeContext = useLocaleContext();
	const locale = localeContext.locale;
	const { t } = useTranslation('translation', { keyPrefix: 'smartNotifications.IntervalInputs' });
	const intervalInputsStyles = styles();

	//
	// B. Render Components
	return (
		<>
			<View style={intervalInputsStyles.timeSelectors}>
				<Text style={intervalInputsStyles.text}>{t('startingTime')}</Text>
				<RNDateTimePicker
					display="compact"
					locale={locale}
					mode="time"
					style={intervalInputsStyles.input}
					value={startingHour ?? new Date()}
					onChange={(event, date) => {
						if (date) {
							setStartingHour(date);
						}
					}}
				/>
			</View>
			<View style={intervalInputsStyles.timeSelectors}>
				<Text style={intervalInputsStyles.text}>{t('endingTime')}</Text>
				<RNDateTimePicker
					display="compact"
					mode="time"
					style={intervalInputsStyles.input}
					timeZoneName="Europe/Lisbon"
					value={endingHour ?? new Date()}
					onChange={(event, date) => {
						if (date) {
							setEndingHour(date);
						}
					}}
				/>
			</View>
		</>
	);
	//
};
