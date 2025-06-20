/* * */

import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { AccountWidget } from '@/types/account.types';
import { ListItem } from '@rn-vui/themed';
import { IconBell } from '@tabler/icons-react-native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { SmartNotificationWidgetCardBody } from '../SmartNotificationsWidgetCardBody';
import { SmartNotificationsWidgetCardHeader } from '../SmartNotificationsWidgetCardHeader';
import { SmartNotificationsWidgetCardToolbar } from '../SmartNotificationsWidgetCardToolbar';
import { styles } from './styles';

/* * */

interface SmartNotificationWidgetCardProps {
	data?: AccountWidget
	expanded?: boolean
	onToggle?: () => void
}

/* * */

export function SmartNotificationWidgetCard({ data, expanded = true, onToggle = () => console.log('Bcastelo') }: SmartNotificationWidgetCardProps) {
	//

	//
	// A. Setup variables

	const cardStyles = styles();
	const pulseAnim = useRef(new Animated.Value(1)).current;

	const stylesPulse = StyleSheet.create({
		gradientCircle: {
			alignItems: 'center',
			borderRadius: 32,
			height: 40,
			justifyContent: 'center',
			top: -2,
			width: 40,
		},
		innerCircle: {
			alignItems: 'center',
			backgroundColor: '#0C807E',
			borderRadius: 999,
			height: 35,
			justifyContent: 'center',
			width: 35,
		},
		notificationDot: {
			backgroundColor: '#FFFFFF',
			borderColor: '#fff',
			borderRadius: 5,
			borderWidth: 2,
			height: 10,
			position: 'absolute',
			right: 6,
			top: 6,
			width: 10,
		},
	});

	//
	// B. Transform Data

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnim, {
					duration: 800,
					toValue: 1.15,
					useNativeDriver: true,
				}),
				Animated.timing(pulseAnim, {
					duration: 800,
					toValue: 1,
					useNativeDriver: true,
				}),
			]),
		).start();
	}, [pulseAnim]);

	//
	// D. Render Components

	return (
		<ListItem.Accordion
			containerStyle={!expanded ? cardStyles.cardClosed : cardStyles.cardOpen}
			isExpanded={expanded}
			onPress={onToggle}
			content={(
				<SmartNotificationsWidgetCardHeader municipality="test" startHour="08:00" title="test 2" />
			)}
			icon={(
				<View style={{ alignItems: 'center', marginTop: -20 }}>
					<Animated.View
						style={[stylesPulse.gradientCircle, { backgroundColor: '#daf0ef', position: 'absolute', transform: [{ scale: pulseAnim }], zIndex: 0 }]}
					/>
					<View style={[stylesPulse.innerCircle, { alignSelf: 'center', position: 'absolute', zIndex: 1 }]}>
						<IconBell color="#fff" size={32} />
						<View style={stylesPulse.notificationDot} />
					</View>
				</View>
			)}
		>
			<View style={cardStyles.cardBody}>
				<SmartNotificationsWidgetCardToolbar />
				<LinesDetailContextProvider>
					<SmartNotificationWidgetCardBody lineId="1001" />
				</LinesDetailContextProvider>
			</View>
		</ListItem.Accordion>
	);

	//
}
