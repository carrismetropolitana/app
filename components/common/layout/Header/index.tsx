/* * */

import zumeDark from '@/assets/header/zume/zume-dark.json';
import zumeLight from '@/assets/header/zume/zume-light.json';
import { ProfileImage } from '@/components/ProfileImage';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Link } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* * */

export function Header() {
	//

	//
	// A. Setup Variables

	const insets = useSafeAreaInsets();
	const { theme } = useThemeContext();

	const animation = theme.mode === 'light' ? zumeLight : zumeDark;
	const headerBackground = theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;

	//
	// B. Render Components

	return (
		<View
			style={{
				alignItems: 'center',
				backgroundColor: headerBackground,
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
			<LottieView
				source={animation}
				style={{ height: 70, width: 150 }}
				autoPlay
				loop
			/>
			<Link href="/profile">
				<ProfileImage size={50} type="url" />
			</Link>
		</View>
	);

	//
}
