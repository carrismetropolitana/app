/* * */

import { AccountEditProfileBasicInfo } from '@/components/account/edit/AccountEditProfileBasicInfo';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function AccountEditForm() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<AccountEditProfileBasicInfo />
		</View>
	);

	//
}
