/* * */

import { useAccountContext } from '@/contexts/Account.context';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function AccountViewInfo() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();

	const { t } = useTranslation('translation', { keyPrefix: 'account.AccountViewInfo' });

	//
	// B. Handle actions

	const handlePressAccountId = async () => {
		if (!accountContext?.data.account?._id) return;
		await Clipboard.setStringAsync(accountContext?.data.account?._id);
		alert(t('account_id_copied'));
	};

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={handlePressAccountId}>
				<Text style={styles.accountId}>{accountContext?.data.account?._id}</Text>
			</TouchableOpacity>
		</View>
	);

	//
};
