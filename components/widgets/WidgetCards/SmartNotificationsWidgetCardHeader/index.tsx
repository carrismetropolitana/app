import { Text } from '@rn-vui/themed';
import React from 'react';
import { View } from 'react-native';

import { styles } from './styles';

interface SmartNotificationsWidgetCardHeaderProps {
	municipality: string
	startHour?: string
	title: string
}

export function SmartNotificationsWidgetCardHeader({ municipality, startHour, title }: SmartNotificationsWidgetCardHeaderProps) {
	//

	//
	// A. Setup variables

	const headerStyles = styles();

	//
	// B. Render Components

	return (
		<View style={[headerStyles.container, { flexDirection: 'row', justifyContent: 'space-between' }]}>
			<View style={{ width: '70%' }}>
				<Text style={headerStyles.headerTitle}>{title}</Text>
				<Text style={headerStyles.headerSubtitle}>{municipality}</Text>
			</View>
			<View style={headerStyles.headerStarthourContainer}>
				{startHour && <Text style={headerStyles.headerStarthour}>{startHour}</Text>}
			</View>
		</View>
	);

	//
}
