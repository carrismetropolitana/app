import { Text } from '@rn-vui/themed';
import { IconBell } from '@tabler/icons-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { styles } from './styles';

interface SmartNotificationsWidgetCardHeaderProps {
	municipality: string
	startHour?: string
	title: string
}

export function SmartNotificationsWidgetCardHeader({ municipality, startHour, title }: SmartNotificationsWidgetCardHeaderProps) {
	// A. Setup variables
	const headerStyles = styles();

	// Pulse animation
	const pulseAnim = useRef(new Animated.Value(1)).current;
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

	return (
		<View style={[headerStyles.container, { flexDirection: 'row', justifyContent: 'space-between' }]}>
			<View>
				<Text style={headerStyles.headerTitle}>{title}</Text>
				<Text style={headerStyles.headerSubtitle}>{municipality}</Text>
			</View>
			<View style={{ flexDirection: 'row' }}>
				{startHour && <Text style={{ marginRight: 35 }}>{startHour}</Text>}
				<View style={{ alignItems: 'center' }}>
					<Animated.View
						style={[stylesPulse.gradientCircle, { backgroundColor: '#daf0ef', position: 'absolute', transform: [{ scale: pulseAnim }], zIndex: 0 }]}
					/>
					<View style={[stylesPulse.innerCircle, { alignSelf: 'center', position: 'absolute', zIndex: 1 }]}>
						<IconBell color="#fff" size={32} />
						<View style={stylesPulse.notificationDot} />
					</View>
				</View>
			</View>
		</View>
	);
}

const stylesPulse = StyleSheet.create({
	gradientCircle: {
		alignItems: 'center',
		borderRadius: 32,
		height: 45,
		justifyContent: 'center',
		width: 45,
	},
	innerCircle: {
		alignItems: 'center',
		backgroundColor: '#0C807E',
		borderRadius: 22,
		height: 40,
		justifyContent: 'center',
		width: 40,
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
