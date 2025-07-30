import FavoritesBar from '@/components/common/FavoritesBar';
import { Header } from '@/components/common/layout/Header';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Button } from '@rn-vui/themed';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WidgetCards } from '../widgets/WidgetCards';

export default function HomeScreen() {
	//

	//
	// A. Setup Variables

	const themeContext = useThemeContext();
	const profileContext = useProfileContext();
	const insets = useSafeAreaInsets();
	const [hasFavorites, setHasFavorites] = useState<boolean | undefined>(undefined);
	const backgroundColor = themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background;
	const buttonBackgroundColor = themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.primary : themeContext.theme.darkColors?.primary;
	const titleColor = themeContext.theme.mode === 'light' ? theming.colorSystemText900 : theming.colorSystemText300;
	const { t } = useTranslation('translation', { keyPrefix: 'common' });

	//
	// B. Transform Data

	useEffect(() => {
		if (!profileContext.data.profile?.favorites?.lines || profileContext.data.profile?.favorites?.lines.length === 0) {
			setHasFavorites(false);
		}
		else {
			setHasFavorites(true);
		}
	}, [profileContext.data.profile?.favorites?.lines]);

	//
	// C. Render Components

	return (
		<View style={{ backgroundColor, flex: 1 }}>
			<Header />
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: 124 + insets.bottom,
					paddingTop: hasFavorites ? 0 : insets.top + 80,
				}}
			>
				<FavoritesBar />
				<View style={{ padding: 20, paddingTop: 30 }}>
					<WidgetCards />
					<Button
						onPress={() => router.push('/profile')}
						title={t('personalizeButton')}
						buttonStyle={{
							alignSelf: 'center',
							backgroundColor: buttonBackgroundColor,
							borderRadius: 999,
							flexDirection: 'row',
							marginBottom: 20,
							width: '30%',
						}}
						containerStyle={{
							backgroundColor: backgroundColor,
							paddingTop: 10,
						}}
						titleStyle={{
							color: titleColor,
							fontSize: theming.fontSizeMuted,
							fontWeight: theming.fontWeightSemibold as 'semibold',
						}}
					/>
				</View>
			</ScrollView>
		</View>
	);

	//
}
