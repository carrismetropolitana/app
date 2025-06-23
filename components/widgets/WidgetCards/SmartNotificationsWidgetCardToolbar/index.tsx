import type { AccountWidget } from '@/types/account.types';

import { Text } from '@rn-vui/themed';
import { IconArrowRight, IconBell } from '@tabler/icons-react-native';
import { DateTime } from 'luxon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

interface SmartNotificationsWidgetCardToolbarProps {
	data: AccountWidget
}

export function SmartNotificationsWidgetCardToolbar({ data }: SmartNotificationsWidgetCardToolbarProps) {
	//

	//
	// A. Setup variables
	const headerStyles = styles();

	const { t } = useTranslation('translation', { keyPrefix: 'smartNotifications.Toolbar' });

	const weekDays: ('friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday')[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	const smartNotificationsData = data?.data.type === 'smart_notifications' ? data.data : undefined;
	const smartNotificationStartHour = DateTime.fromSeconds(smartNotificationsData?.start_time || 0).toFormat('HH:mm');
	const smartNotificationEndHour = DateTime.fromSeconds(smartNotificationsData?.end_time || 0).toFormat('HH:mm');

	//
	// B. Render Components
	return (
		<View style={headerStyles.container}>
			<View style={{ alignItems: 'center', backgroundColor: '#FAFAFA', borderRadius: 4, flexDirection: 'row', gap: 8, height: 50, padding: 10 }}>
				<IconBell color="#5F5F5F" size={24} />
				<Text style={headerStyles.text}>{smartNotificationStartHour}</Text>
				<IconArrowRight color="#5F5F5F" size={22} />
				<Text style={headerStyles.text}>{smartNotificationEndHour}</Text>
			</View>
			<View style={{ alignItems: 'center', backgroundColor: '#FAFAFA', borderRadius: 4, flexDirection: 'row', gap: 8, height: 50, padding: 10 }}>
				{weekDays.map((day) => {
					const isActive = smartNotificationsData?.week_days?.includes(day);
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
