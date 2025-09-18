/* * */

import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function HomeScreenCustomizeButton() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const { t } = useTranslation('translation', { keyPrefix: 'home.HomeScreenCustomizeButton' });

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => router.push('/profile')}>
				<Text style={styles.button}>{t('label')}</Text>
			</TouchableOpacity>
		</View>
	);

	//
}
