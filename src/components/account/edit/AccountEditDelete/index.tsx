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

	const { t } = useTranslation();

	//
	// B. Handle actions

	const handlePress = () => {
		Alert.alert(
			t($ => $.account.AccountEditDelete.alert.title),
			t($ => $.account.AccountEditDelete.alert.description),
			[
				{
					style: 'cancel',
					text: t($ => $.account.AccountEditDelete.alert.cancel),
				},
				{
					onPress: async () => {
						await accountContext.actions.deleteAccount();
						router.dismissTo('/');
					},
					style: 'destructive',
					text: t($ => $.account.AccountEditDelete.alert.confirm),
				},
			],
		);
	};

	//
	// C. Render components

	return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress}>
				<Text style={styles.button}>{t($ => $.account.AccountEditDelete.label)}</Text>
			</TouchableOpacity>
        </View>
    );

	//
}
