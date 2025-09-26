/* * */

import { TextInputField } from '@/components/common/TextInputField';
import { useAccountContext } from '@/contexts/Account.context';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

/* * */

export function AccountEditProfileBirthdate() {
	//

	//
	// A. Setup variables

	const accountContext = useAccountContext();

	const { t } = useTranslation('translation', { keyPrefix: 'account.AccountEditProfileBirthdate' });

	const [birthdate, setBirthdate] = useState<string>(accountContext.data.account?.profile.birthdate || '');

	//
	// B. Handle actions

	useEffect(() => {
		accountContext.actions.update('profile.birthdate', birthdate);
	}, [birthdate]);

	//
	// C. Render components

	return (
		<View>
			<TextInputField
				label={t('fields.birthdate.label')}
				onChange={setBirthdate}
				placeholder={t('fields.birthdate.placeholder')}
				value={birthdate}
				withBorderBottom
				withBorderTop
			/>
		</View>
	);

	//
}
