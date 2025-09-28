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

	const { t } = useTranslation('translation', { keyPrefix: 'account.AccountEditProfileContacts' });

	const [emailAddress, setEmailAddress] = useState<null | string>(accountContext.data.account?.profile.email || null);
	const [phoneNumber, setPhoneNumber] = useState<null | string>(accountContext.data.account?.profile.phone || null);

	//
	// B. Handle actions

	useEffect(() => {
		accountContext.actions.update('profile.email', emailAddress);
	}, [emailAddress]);

	useEffect(() => {
		accountContext.actions.update('profile.phone', phoneNumber);
	}, [phoneNumber]);

	//
	// C. Render components

	return (
		<View>
			<ListTitle title={t('title')} />
			<TextInputField
				label={t('fields.email.label')}
				onChange={setEmailAddress}
				placeholder={t('fields.email.placeholder')}
				value={emailAddress}
				withBorderBottom
				withBorderTop
			/>
			<TextInputField
				label={t('fields.phone.label')}
				onChange={setPhoneNumber}
				placeholder={t('fields.phone.placeholder')}
				value={phoneNumber}
				withBorderBottom
			/>
		</View>
	);

	//
}
