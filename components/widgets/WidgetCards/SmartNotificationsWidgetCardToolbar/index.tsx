import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Text, useTheme } from '@rn-vui/themed';
import { IconArrowRight, IconBell } from '@tabler/icons-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

interface SmartNotificationsWidgetCardToolbarProps {
	data?: string[]
}

export function SmartNotificationsWidgetCardToolbar({ data = [] }: SmartNotificationsWidgetCardToolbarProps) {
	//

	//
	// A. Setup variables
	const headerStyles = styles();
	const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
	const { t } = useTranslation('translation', { keyPrefix: 'smartNotifications.Toolbar' });

	//
	// B. Render Components
	return (
		<View style={headerStyles.container}>
			<View style={{ alignItems: 'center', backgroundColor: '#FAFAFA', borderRadius: 4, flexDirection: 'row', gap: 8, height: 50, padding: 10 }}>
				<IconBell color="#5F5F5F" size={24} />
				<Text style={headerStyles.text}>7:30</Text>
				<IconArrowRight color="#5F5F5F" size={22} />
				<Text style={headerStyles.text}>8:30</Text>
			</View>
			<View style={{ alignItems: 'center', backgroundColor: '#FAFAFA', borderRadius: 4, flexDirection: 'row', gap: 8, height: 50, padding: 10 }}>
				{weekDays.map((day) => {
					const isActive = data.includes(day);
					return (
						<View
							key={day}
							style={{
								justifyContent: 'center',
							}}
						>
							<Text style={isActive ? headerStyles.text : headerStyles.textUnselected}>
								{t(`${day}`)}
							</Text>
						</View>
					);
				})}
			</View>
		</View>
	);
	//
}
