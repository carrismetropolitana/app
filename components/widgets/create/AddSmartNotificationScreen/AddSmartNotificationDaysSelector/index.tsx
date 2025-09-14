/* * */

import { theming } from '@/theme/Variables';
import { ButtonGroup, Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import styles from './styles';

/* * */

interface DaysSelectorProps {
	selectedIndex: number[]
	setSelectedIndex: (index: number[]) => void
}

/* * */

export const AddSmartNotificationDaysSelector = ({ selectedIndex, setSelectedIndex }: DaysSelectorProps) => {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'addsmartnotifications.DaysSelector' });
	const daysSelectortyles = styles();

	const days = [
		{ key: 'monday', label: t('monday') },
		{ key: 'tuesday', label: t('tuesday') },
		{ key: 'wednesday', label: t('wednesday') },
		{ key: 'thursday', label: t('thursday') },
		{ key: 'friday', label: t('friday') },
		{ key: 'saturday', label: t('saturday') },
		{ key: 'sunday', label: t('sunday') },
	];

	//
	// B. Render Components

	return (
		<View style={daysSelectortyles.daysSelectors}>
			<Text style={daysSelectortyles.textLeft}>{t('weekDaysTitle')}</Text>
			<ButtonGroup
				buttonStyle={daysSelectortyles.button}
				containerStyle={daysSelectortyles.buttonContainer}
				onPress={setSelectedIndex}
				selectedButtonStyle={{ backgroundColor: theming.colorPrimaryBlack }}
				selectedIndexes={selectedIndex}
				buttons={days.map((day, idx) => ({
					element: () => (
						<Text
							accessibilityHint={t('dayButtonAccessibilityHint', { day: day.label })}
							accessibilityLabel={t('dayButtonAccessibilityLabel', { day: day.label })}
							accessibilityRole="button"
							style={selectedIndex.includes(idx) ? { color: theming.colorPrimaryWhite } : [{ color: theming.colorPrimaryBlack }]}
						>
							{day.label}
						</Text>
					),
				}))}
				selectMultiple
			/>
		</View>
	);

	//
};
