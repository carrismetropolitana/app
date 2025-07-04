/* * */

import zumeDark from '@/assets/header/zume/zume-dark.json';
import zumeLight from '@/assets/header/zume/zume-light.json';
import { ProfileImage } from '@/components/ProfileImage';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import dimAvatarBackground from '@/utils/dimAvatarBackground';
import { Link } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Image, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* * */

export function Header() {
	//

	//
	// A. Setup Variables

	const insets = useSafeAreaInsets();
	const { theme } = useThemeContext();
	const profileContext = useProfileContext();

	const animation = theme.mode === 'light' ? zumeLight : zumeDark;
	const headerBackground = theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;
	const borderColor = theme.mode === 'light' ? theming.colorSystemBorder100 : theming.colorSystemBorderDark200;

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
			{Platform.OS !== 'android' && (
				<LottieView
					source={animation}
					style={{ height: 70, width: 150 }}
					autoPlay
					loop
				/>
			)}

			{Platform.OS === 'android' && (
				// eslint-disable-next-line @typescript-eslint/no-require-imports
				<Image source={require('@/assets/images/logo.png')} style={{ height: 100, left: 20, resizeMode: 'contain', width: 100 }} />
			)}

			<Link href="/profile">
				<ProfileImage backgroundColor={profileContext.data.accent_color ? dimAvatarBackground(profileContext.data.accent_color) : 'rgba(253,183,26,0.4))'} color={profileContext.data.accent_color || ''} size={50} type="url" />
			</Link>
		</View>
	);

	//
}
