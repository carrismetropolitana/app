/* * */

import { ButtonGroup, Text } from '@rn-vui/themed';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

/* * */

import { useTranslation } from 'react-i18next';

import { styles } from './styles';

/* * */

interface Props {
	selectedSelector?: string
}

/* * */
export function SelectNotificationControl({ selectedSelector }: Props) {
	//

	//
	// A. Setup Variables

	const { t } = useTranslation('translation', { keyPrefix: 'common.SelectNotificationControl' });

	const [selectedIndex, setSelectedIndex] = useState(0);
	const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);
	const selectStyles = styles();

	const buttons = [
		{ element: () => <Text style={selectedIndex === 0 ? selectStyles.textSelected : selectStyles.text}>{t('meters')}</Text> },
		{ element: () => <Text style={selectedIndex === 1 ? selectStyles.textSelected : selectStyles.text}>{t('hours')}</Text> },
	];

	//
	// B. Fetch Data

	useEffect(() => {
		if (selectedIndex === 0) {
			setSelectedValue('meters');
			selectedSelector = 'meters';
		}
		else if (selectedIndex === 1) {
			setSelectedValue('hours');
			selectedSelector = 'hours';
		}
	}, [selectedIndex]);

	//
	// C . Handle Actions
	const handlePress = (i: number) => {
		setSelectedIndex(i);
	};

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
		</View>
	);
}
