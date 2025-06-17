import { Text } from '@rn-vui/themed';
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
			<Text style={headerStyles.headerTitle}>Start Time:  7:30</Text>
			<Text style={headerStyles.headerSubtitle}>End Time:  7:30</Text>
			<View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
				{weekDays.map((day) => {
					const isActive = data.includes(day);
					return (
						<View
							key={day}
							style={{
								backgroundColor: isActive ? '#FDB71A' : '#E0E0E0',
								borderRadius: 8,
								marginRight: 4,
								paddingHorizontal: 8,
								paddingVertical: 4,
							}}
						>
							<Text style={{ color: isActive ? '#222' : '#888', fontWeight: 'bold' }}>
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
