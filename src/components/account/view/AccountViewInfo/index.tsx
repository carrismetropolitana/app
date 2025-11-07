/* * */

import { useAccountContext } from '@/contexts/Account.context';
import * as Clipboard from 'expo-clipboard';
import { useMemo } from 'react';
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
	// B. Transform data

	const accountIdentifier = useMemo(() => {
		return `${accountContext.data.account?._id || 'N/A'} (...${accountContext.data.device_id?.slice(-10) || 'N/A'})`;
	}, [accountContext?.data.account?._id, accountContext.data.device_id]);

	//
	// B. Handle actions

	const handlePressAccountId = async () => {
		if (!accountIdentifier) return;
		await Clipboard.setStringAsync(accountIdentifier);
		alert(t('copied'));
	};

	//
	// C. Render components

	return (
		<View accessible={false} style={styles.container}>
			<TouchableOpacity onPress={handlePressAccountId}>
				<Text style={styles.accountIdentifier}>{accountIdentifier}</Text>
			</TouchableOpacity>
		</View>
	);

	//
};
