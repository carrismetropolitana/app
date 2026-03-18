/* eslint-disable @typescript-eslint/no-require-imports */

/* * */

import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, useColorScheme } from 'react-native';

import { useStyles } from './styles';

/* * */

export function HomeScreenCustomizeHero() {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const colorScheme = useColorScheme();

	const { t } = useTranslation();

	//
	// B. Render components

	return (
		<TouchableOpacity
			accessibilityHint={t($ => $.home.HomeScreenCustomizeHero.accessibility_hint)}
			onPress={() => router.push('/account')}
			style={styles.container}
		>
			{colorScheme === 'light'
				? <Image resizeMode="contain" source={require('#/home/customize-hero-light.png')} style={styles.image} width={1000} />
				: <Image resizeMode="contain" source={require('#/home/customize-hero-dark.png')} style={styles.image} width={1000} />}
			<Text style={styles.title}>{t($ => $.home.HomeScreenCustomizeHero.title)}</Text>
			<Text style={styles.description}>{t($ => $.home.HomeScreenCustomizeHero.description)}</Text>
		</TouchableOpacity>
	);

	//
}
