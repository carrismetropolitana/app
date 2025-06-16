import { Text } from '@rn-vui/themed';
import { IconBell } from '@tabler/icons-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { styles } from './styles';

interface SmartNotificationsWidgetCardHeaderProps {
	municipality: string
	title: string
}

export function SmartNotificationsWidgetCardHeader({ municipality, title }: SmartNotificationsWidgetCardHeaderProps) {
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
		<View style={headerStyles.container}>
			<Text style={headerStyles.headerTitle}>{title}</Text>
			<Text style={headerStyles.headerSubtitle}>{municipality}</Text>
			<Text>07:30</Text>
			<View style={{ alignItems: 'center', height: 64, justifyContent: 'center', marginTop: 16, width: 64 }}>
				<Animated.View
					style={[stylesPulse.gradientCircle, { backgroundColor: '#daf0ef', position: 'absolute', transform: [{ scale: pulseAnim }], zIndex: 0 },
					]}
				/>
				<View style={[stylesPulse.innerCircle, { alignSelf: 'center', position: 'absolute', zIndex: 1 }]}>
					<IconBell color="#fff" size={32} />
					<View style={stylesPulse.notificationDot} />
				</View>
			</View>
		</View>
	);
}

const stylesPulse = StyleSheet.create({
	gradientCircle: {
		alignItems: 'center',
		borderRadius: 32,
		height: 50,
		justifyContent: 'center',
		width: 50,
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
