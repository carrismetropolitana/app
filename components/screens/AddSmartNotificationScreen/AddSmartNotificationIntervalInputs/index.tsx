/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, View } from 'react-native';

/* * */

import { useState } from 'react';

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
	const [showStartingPicker, setShowStartingPicker] = useState(false);
	const [showEndingPicker, setShowEndingPicker] = useState(false);

	return (
		<>
			<View style={intervalInputsStyles.timeSelectors}>
				<Text style={intervalInputsStyles.text}>{t('startingTime')}</Text>
				{Platform.OS === 'android' ? (
					<>
						<Pressable onPress={() => setShowStartingPicker(true)} style={intervalInputsStyles.input}>
							<Text>
								{startingHour ? startingHour.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : ''}
							</Text>
						</Pressable>
						{showStartingPicker && (
							<RNDateTimePicker
								display="default"
								mode="time"
								value={startingHour ?? new Date()}
								onChange={(event, date) => {
									setShowStartingPicker(false);
									if (date) setStartingHour(date);
								}}
							/>
						)}
					</>
				) : (
					<RNDateTimePicker
						display="compact"
						locale={locale}
						mode="time"
						style={intervalInputsStyles.input}
						value={startingHour ?? new Date()}
						onChange={(event, date) => {
							if (date) setStartingHour(date);
						}}
					/>
				)}
			</View>
			<View style={intervalInputsStyles.timeSelectors}>
				<Text style={intervalInputsStyles.text}>{t('endingTime')}</Text>
				{Platform.OS === 'android' ? (
					<>
						<Pressable onPress={() => setShowEndingPicker(true)} style={intervalInputsStyles.input}>
							<Text>
								{endingHour ? endingHour.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : ''}
							</Text>
						</Pressable>
						{showEndingPicker && (
							<RNDateTimePicker
								display="default"
								mode="time"
								value={endingHour ?? new Date()}
								onChange={(event, date) => {
									setShowEndingPicker(false);
									if (date) setEndingHour(date);
								}}
							/>
						)}
					</>
				) : (
					<RNDateTimePicker
						display="compact"
						mode="time"
						style={intervalInputsStyles.input}
						value={endingHour ?? new Date()}
						onChange={(event, date) => {
							if (date) setEndingHour(date);
						}}
					/>
				)}
			</View>
		</>
	);
	//
};
