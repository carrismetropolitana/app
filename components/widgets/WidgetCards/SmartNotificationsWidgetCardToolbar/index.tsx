import { Text } from '@rn-vui/themed';
import { IconArrowRight, IconBell } from '@tabler/icons-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

interface SmartNotificationsWidgetCardToolbarProps {
	data?: []
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
			<View style={{ alignItems: 'center', flexDirection: 'row', gap: 8, padding: 20 }}>
				<IconBell color="#5F5F5F" size={32} />
				<Text>7:30</Text>
				<IconArrowRight color="#5F5F5F" size={18} />
				<Text>7:30</Text>
			</View>
			<View style={{ alignContent: 'center', flexDirection: 'row' }}>
				{weekDays.map((day) => {
					const isActive = data.includes(day);
					return (
						<View
							key={day}
							style={{
								backgroundColor: '#FAFAFA',
								borderRadius: 4,
								justifyContent: 'center',
								paddingHorizontal: 8,
								width: 29,
							}}
						>
							<Text style={{ color: isActive ? '#5F5F5F' : '#F0F0FA', fontWeight: 'bold' }}>
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
