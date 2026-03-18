/* * */

import { TextInputField } from '@/components/common/TextInputField';
import { ListTitle } from '@/components/list/ListTitle';
import { useAccountContext } from '@/contexts/Account.context';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

/* * */

export function AccountEditProfileContacts() {
	//

	//
	// A. Setup variables

	const accountContext = useAccountContext();

	const { t } = useTranslation();

	const [emailAddress, setEmailAddress] = useState<null | string>(accountContext.data.account?.profile.email || null);
	const [phoneNumber, setPhoneNumber] = useState<null | string>(accountContext.data.account?.profile.phone || null);

	//
	// B. Handle actions

	useEffect(() => {
		accountContext.actions.update('profile.email', emailAddress);
	}, [accountContext.actions, emailAddress]);

	useEffect(() => {
		accountContext.actions.update('profile.phone', phoneNumber);
	}, [accountContext.actions, phoneNumber]);

	//
	// C. Render components

	return (
		<View>
			<ListTitle title={t($ => $.account.AccountEditProfileContacts.title)} />
			<TextInputField
				label={t($ => $.account.AccountEditProfileContacts.fields.email.label)}
				onChange={setEmailAddress}
				placeholder={t($ => $.account.AccountEditProfileContacts.fields.email.placeholder)}
				value={emailAddress}
				withBorderBottom
				withBorderTop
			/>
			<TextInputField
				label={t($ => $.account.AccountEditProfileContacts.fields.phone.label)}
				onChange={setPhoneNumber}
				placeholder={t($ => $.account.AccountEditProfileContacts.fields.phone.placeholder)}
				value={phoneNumber}
				withBorderBottom
			/>
		</View>
	);

	//
}
