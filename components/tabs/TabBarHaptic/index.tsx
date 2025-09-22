/* * */

import { type BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import Haptics from 'expo-haptics';
import { type GestureResponderEvent, Pressable } from 'react-native';

/* * */

export function TabBarHaptic(props: BottomTabBarButtonProps) {
	//

	//
	// A. Handle actions

	const handlePressIn = (event: GestureResponderEvent) => {
		if (!props.onPressIn) return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
		props.onPressIn(event);
	};

	//
	// B. Render components

	return <Pressable {...props} onPressIn={handlePressIn} />;

	//
}
