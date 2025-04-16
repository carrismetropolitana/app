/* * */

import { Option, SegmentedControl } from '@/components/common/SegmentedControl';
import { useOperationalDayContext } from '@/contexts/OperationalDay.context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IconCalendarEvent } from '@tabler/icons-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { selectOperationDayStyles } from './styles';

/* * */

export function SelectOperationalDay() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'common.SelectOperationalDay' });

	const operationalDayContext = useOperationalDayContext();

	const [selectedValue, setSelectedValue] = useState('today');
	const [date, setDate] = useState(new Date());
	const options: Option[] = [
		{
			label: t('today'),
			value: 'today',
		},
		{
			label: t('tomorrow'),
			value: 'tomorrow',
		},
		// {
		// 	centerSection: (
		// 		<DateTimePicker
		// 			display="default"
		// 			mode="date"
		// 			value={date}
		// 			onChange={(_, selectedDate) => {
		// 				if (selectedDate) setDate(selectedDate);
		// 			}}
		// 		/>
		// 	),
		// 	label: '',
		// 	value: 'custom',
		// },
	];

	//
	// B. Transform data

	useEffect(() => {
		if (operationalDayContext.flags.is_today_selected) {
			setSelectedValue('today');
		}
		else if (operationalDayContext.flags.is_tomorrow_selected) {
			setSelectedValue('tomorrow');
		}
		else if (!operationalDayContext.flags.is_today_selected && !operationalDayContext.flags.is_tomorrow_selected) {
			setSelectedValue('custom_date');
		}
	}, [operationalDayContext.flags.is_today_selected, operationalDayContext.flags.is_tomorrow_selected]);

	//
	// C. Handle actions

	const handleSegmentedControlChange = (event: { nativeEvent: { selectedSegmentValue: string } }) => {
		const value = event.nativeEvent.selectedSegmentValue;

		setSelectedValue(value);
		if (value === 'today') {
			console.log('Today selected');
		}
		else if (value === 'tomorrow') {
			console.log('Tomorrow selected');
		}
	};

	//
	// D. Render components

	return (
		<View style={selectOperationDayStyles.container}>
			<SegmentedControl
				onChange={handleSegmentedControlChange}
				options={options}
				selectedValue={selectedValue}
			/>
		</View>
	);

	//
}
