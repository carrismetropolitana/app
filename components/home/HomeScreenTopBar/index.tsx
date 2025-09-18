/* * */

import { UserPersona } from '@/components/profile/persona/UserPersona';
import { router } from 'expo-router';
import { Image, TouchableOpacity, useColorScheme, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function HomeScreenTopBar() {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const colorScheme = useColorScheme();

	//
	// B. Render components

	return (
		<View style={styles.container}>

			{colorScheme === 'light'
				? <Image resizeMode="contain" source={{ uri: 'https://carrismetropolitana.pt/assets/header/static/cmet-header-light@3x.png' }} style={styles.logo} />
				: <Image resizeMode="contain" source={{ uri: 'https://carrismetropolitana.pt/assets/header/static/cmet-header-dark@3x.png' }} style={styles.logo} />}

			<TouchableOpacity onPress={() => router.push('/profile')}>
				<UserPersona size="md" />
			</TouchableOpacity>

		</View>
	);

	//
}
