/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function AccountEditDelete() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();

	const { t } = useTranslation('translation', { keyPrefix: 'account.AccountEditDelete' });

	//
	// B. Render components

	const handlePress = () => {
		Alert.alert(
			t('alert.title'),
			t('alert.description'),
			[
				{
					style: 'cancel',
					text: t('alert.cancel'),
				},
				{
					onPress: async () => {
						await accountContext.actions.deleteAccount();
						router.replace('/');
					},
					style: 'destructive',
					text: t('alert.confirm'),
				},
			],
		);
	};

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={handlePress}>
				<Text style={styles.button}>{t('label')}</Text>
			</TouchableOpacity>
		</View>
	);

	//
}
