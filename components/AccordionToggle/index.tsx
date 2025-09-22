/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { IconBell, IconCaretLeft } from '@tabler/icons-react-native';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Easing, View } from 'react-native';

import { styles } from './styles';

/* * */

interface AccordionToggleProps {
	expanded: boolean
	isNotification?: boolean
	size?: number
}

/* * */

export const AccordionToggle = ({ expanded, isNotification, size = 24 }: AccordionToggleProps) => {
	//

	//
	// A. Setup variables

	const themeContext = useThemeContext();
	const localeContext = useLocaleContext();
	const pulseAnim = useRef(new Animated.Value(1)).current;
	const rotateAnim = useRef(new Animated.Value(0)).current;
	const accordionToggleStyles = styles();
	const chevronColor = themeContext.theme.mode === 'light' ? theming.colorSystemText400 : theming.colorSystemText300;
	const { t } = useTranslation('translation', { keyPrefix: 'accordionToggle' });

	//
	// B. Fetch Data

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnim, {
					duration: 800,
					toValue: 1.05,
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

	useEffect(() => {
		Animated.timing(rotateAnim, {
			duration: 200,
			easing: Easing.ease,
			toValue: expanded ? 1 : 0,
			useNativeDriver: true,
		}).start();
	}, [expanded, rotateAnim]);

	const rotate = rotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '90deg'],
	});

	//
	// C. Render Components

	return (
		<>
			{isNotification && (
				<Animated.View style={[accordionToggleStyles.gradientCircle, { backgroundColor: '#daf0ef', position: 'absolute', transform: [{ scale: pulseAnim }], zIndex: 0 }]}>
					<View accessibilityHint={t('accordionToggle.accessibilityHint')} accessibilityLabel={t('accordionToggle.accessibilityLabel')} accessibilityLanguage={localeContext.data.locale} accessibilityRole="button" style={[accordionToggleStyles.gradientCircle, { backgroundColor: 'transparent', position: 'absolute', zIndex: 1 }]}>
						<Animated.View style={[accordionToggleStyles.innerCircle, { alignSelf: 'center', position: 'absolute', transform: [{ rotate }], zIndex: 2 }]}>
							<IconBell color="#fff" size={32} />
							<View style={accordionToggleStyles.notificationDot} />
						</Animated.View>
					</View>
				</Animated.View>
			)}
			{!isNotification && (
				<Animated.View accessibilityHint={t('accordionToggle.accessibilityHint')} accessibilityLabel={t('accordionToggle.accessibilityLabel')} accessibilityLanguage={localeContext.data.locale} accessibilityRole="button" style={[{ transform: [{ rotate: rotate }] }]}>
					<IconCaretLeft color={chevronColor} fill={chevronColor} size={size} />
				</Animated.View>
			)}
		</>
	);

	//
};
