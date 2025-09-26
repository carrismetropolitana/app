/* * */

import { AccountEditProfileActivity } from '@/components/account/edit/AccountEditProfileActivity';
import { AccountEditProfileBasicInfo } from '@/components/account/edit/AccountEditProfileBasicInfo';
import { AccountEditProfileBirthdate } from '@/components/account/edit/AccountEditProfileBirthdate';
import { AccountEditProfileContacts } from '@/components/account/edit/AccountEditProfileContacts';
import { AccountEditProfileNotifications } from '@/components/account/edit/AccountEditProfileNotifications';
import { AccountEditProfileUtilizationType } from '@/components/account/edit/AccountEditProfileUtilizationType';
import { AccountEditProfileWorkSetting } from '@/components/account/edit/AccountEditProfileWorkSetting';
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
			<AccountEditProfileBirthdate />
			<AccountEditProfileContacts />
			<AccountEditProfileActivity />
			<AccountEditProfileUtilizationType />
			<AccountEditProfileWorkSetting />
			<AccountEditProfileNotifications />
		</View>
	);

	//
}
