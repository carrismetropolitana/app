import { WidgetSmartNotificationsSchema } from '@/types/account.types';
import { Text } from '@rn-vui/themed';
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { styles } from './styles';

interface SmartNotificationsWidgetCardToolbarProps {
	data?: []
}

export function SmartNotificationsWidgetCardToolbar({ data = [] }: SmartNotificationsWidgetCardToolbarProps) {
	// A. Setup variables
	const headerStyles = styles();
	const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	return (
		<View style={headerStyles.container}>
			<Text style={headerStyles.headerTitle}>Start Time:  7:30</Text>
			<Text style={headerStyles.headerSubtitle}>End Time:  7:30</Text>
			<View>
				{weekDays.map((day, index) => {
					const isActive = data.includes(day);
					return (
						<Text key={index}>
							{day.charAt(0).toUpperCase() + day.slice(1)}
						</Text>
					);
				})}
			</View>
		</View>
	);
}
