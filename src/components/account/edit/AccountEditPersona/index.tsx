/* * */

import { AccountEditPersonaAccent } from '@/components/account/edit/AccountEditPersonaAccent';
import { UserPersona } from '@/components/account/persona/UserPersona';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function AccountEditPersona() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<UserPersona size="lg" withEditButtons />
			<AccountEditPersonaAccent />
		</View>
	);

	//
}
