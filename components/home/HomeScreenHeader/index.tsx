/* eslint-disable @typescript-eslint/no-require-imports */
/* * */

import { ProfileImage } from '@/components/profile/ProfileImage';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Link } from 'expo-router';
import React from 'react';
import { Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* * */

export function HomeScreenHeader() {
	//

	//
	// A. Setup variables

	const insets = useSafeAreaInsets();
	const themeContext = useThemeContext();

	const headerBackground = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;
	const borderColor = themeContext.theme.mode === 'light' ? theming.colorSystemBorder100 : theming.colorSystemBorderDark200;

	//
	// B. Render Components

	return (
		<View
			style={{
				alignItems: 'center',
				backgroundColor: headerBackground,
				borderBottomColor: borderColor,
				borderBottomWidth: 1,
				flexDirection: 'row',
				height: insets.top + 80,
				justifyContent: 'space-between',
				left: 0,
				paddingRight: 20,
				paddingTop: insets.top,
				position: 'absolute',
				right: 0,
				top: 0,
				zIndex: 1000,
			}}
		>

			{themeContext.theme.mode === 'light'
				? <Image source={require('@/assets/images/Logos/CMLogoLightMode.png')} style={{ height: 125, left: 0, resizeMode: 'contain', width: 125 }} />
				: <Image source={require('@/assets/images/Logos/CMLogoDarkMode.png')} style={{ height: 125, left: 0, resizeMode: 'contain', width: 125 }} />}

			<Link accessibilityLabel="Go to profile" accessibilityRole="imagebutton" href="/profile">
				<ProfileImage size="md" />
			</Link>

		</View>
	);

	//
}
