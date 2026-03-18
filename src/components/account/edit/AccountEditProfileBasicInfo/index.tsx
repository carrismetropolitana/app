/* * */

import { TextInputField } from '@/components/common/TextInputField';
import { ListTitle } from '@/components/list/ListTitle';
import { useAccountContext } from '@/contexts/Account.context';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

/* * */

export function AccountEditProfileBasicInfo() {
	//

	//
	// A. Setup variables

	const accountContext = useAccountContext();

	const { t } = useTranslation();

	const [firstName, setFirstName] = useState<string>(accountContext.data.account?.profile.first_name || '');
	const [lastName, setLastName] = useState<string>(accountContext.data.account?.profile.last_name || '');

	//
	// B. Handle actions

	useEffect(() => {
		accountContext.actions.update('profile.first_name', firstName);
	}, [accountContext.actions, firstName]);

	useEffect(() => {
		accountContext.actions.update('profile.last_name', lastName);
	}, [accountContext.actions, lastName]);

	//
	// C. Render components

	return (
		<View>
			<ListTitle title={t($ => $.account.AccountEditProfileBasicInfo.title)} />
			<TextInputField
				label={t($ => $.account.AccountEditProfileBasicInfo.fields.first_name.label)}
				onChange={setFirstName}
				placeholder={t($ => $.account.AccountEditProfileBasicInfo.fields.first_name.placeholder)}
				value={firstName}
				withBorderBottom
				withBorderTop
			/>
			<TextInputField
				label={t($ => $.account.AccountEditProfileBasicInfo.fields.last_name.label)}
				onChange={setLastName}
				placeholder={t($ => $.account.AccountEditProfileBasicInfo.fields.last_name.placeholder)}
				value={lastName}
				withBorderBottom
			/>
		</View>
	);

	//
}
