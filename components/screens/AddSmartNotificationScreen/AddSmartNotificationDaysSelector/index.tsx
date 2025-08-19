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
	// A. Setup Variables

	const { t } = useTranslation('translation', { keyPrefix: 'addsmartnotifications.DaysSelector' });
	const daysSelectortyles = styles();

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
				selectedTextStyle={{ color: theming.colorPrimaryWhite }}
				buttons={[
					t('monday'),
					t('tuesday'),
					t('wednesday'),
					t('thursday'),
					t('friday'),
					t('saturday'),
					t('sunday'),
				]}
				selectMultiple
			/>
		</View>
	);

	//
};
