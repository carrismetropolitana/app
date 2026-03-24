/* * */

import { UserPersona } from '@/components/account/persona/UserPersona';
import { useAccountContext } from '@/contexts/Account.context';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function AccountViewAnonymous() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();

	const { t } = useTranslation();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<UserPersona size="lg" />
			<Text style={styles.displayName}>Olá 👋</Text>
			<TouchableOpacity onPress={accountContext.actions.createAccount}>
				<Text style={styles.button}>{t($ => $.account.AccountViewAnonymous.create_account)}</Text>
			</TouchableOpacity>
		</View>
	);

	//
};
