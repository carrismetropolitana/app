/* * */

import { UserPersona } from '@/components/account/persona/UserPersona';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, useColorScheme, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function HomeScreenTopBar() {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const colorScheme = useColorScheme();

	const { t } = useTranslation();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			{colorScheme === 'light'
				? <Image resizeMode="contain" source={{ uri: 'https://carrismetropolitana.pt/assets/header/static/cmet-header-light@3x.png' }} style={styles.logo} />
				: <Image resizeMode="contain" source={{ uri: 'https://carrismetropolitana.pt/assets/header/static/cmet-header-dark@3x.png' }} style={styles.logo} />}
			<TouchableOpacity aria-label={t($ => $.home.HomeScreenTopBar.aria_label)} onPress={() => router.push('/account')}>
				<UserPersona size="md" />
			</TouchableOpacity>
		</View>
	);

	//
}
