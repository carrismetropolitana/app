/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { useOperationalDayContext } from '@/contexts/OperationalDay.context';
import { ButtonGroup, Text } from '@rneui/themed';
import { IconCalendar } from '@tabler/icons-react-native';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

/* * */

import { styles } from './styles';

/* * */

export function SelectOperationalDay() {
	//

	//
	// A. Setup Variables

	const { t } = useTranslation('translation', { keyPrefix: 'common.SelectOperationalDay' });
	const localeContext = useLocaleContext();
	const operationalDayContext = useOperationalDayContext();

	const [selectedIndex, setSelectedIndex] = useState(0);
	const [date, setDate] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);

	const selectStyles = styles();

	const buttons = [
		{ element: () => <Text style={selectedIndex === 0 ? selectStyles.textSelected : selectStyles.text}>{t('today')}</Text> },
		{ element: () => <Text style={selectedIndex === 1 ? selectStyles.textSelected : selectStyles.text}>{t('tomorrow')}</Text> },
		{ element: () => (
			<>
				<IconCalendar size={20} />
				<Text style={selectedIndex === 2 ? selectStyles.textSelected : selectStyles.text}>
					{formattedDate}
				</Text>
			</>
		),
		},
	];

	const formattedDate = DateTime
		.fromJSDate(date)
		.setLocale(localeContext.locale)
		.toLocaleString(DateTime.DATE_MED);

	//
	// B. Fetch Data

	useEffect(() => {
		if (operationalDayContext.flags.is_today_selected) setSelectedIndex(0);
		else if (operationalDayContext.flags.is_tomorrow_selected) setSelectedIndex(1);
		else setSelectedIndex(2);
	}, [
		operationalDayContext.flags.is_today_selected,
		operationalDayContext.flags.is_tomorrow_selected,
	]);

	//
	// C . Handle Actions

	const handlePress = (i: number) => {
		setSelectedIndex(i);
		if (i === 2) {
			setShowPicker(true);
		}
	};

	const handleConfirm = (picked: Date) => {
		setShowPicker(false);
		setDate(picked);
		setSelectedIndex(2);
	};
	const handleCancel = () => setShowPicker(false);

	//

	return (
		<View style={selectStyles.container}>
			<ButtonGroup
				buttons={buttons}
				containerStyle={selectStyles.operationalDayContainer}
				innerBorderStyle={{ width: 0 }}
				onPress={handlePress}
				selectedButtonStyle={selectStyles.buttonSelected}
				selectedIndex={selectedIndex}
			/>
			<DateTimePickerModal
				date={date}
				isVisible={showPicker}
				locale={localeContext.locale}
				mode="date"
				onCancel={handleCancel}
				onConfirm={handleConfirm}
			/>
		</View>
	);
}
