/* * */

import { TextInputField } from '@/components/common/TextInputField';
import { ListTitle } from '@/components/list/ListTitle';
import { useAccountContext } from '@/contexts/Account.context';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

/* * */

export function AccountEditProfileWorkSetting() {
	//

	//
	// A. Setup variables

	const accountContext = useAccountContext();

	const { t } = useTranslation('translation', { keyPrefix: 'account.AccountEditProfileWorkSetting' });

	const [selectedWorkSetting, setSelectedWorkSetting] = useState<string>(accountContext.data.account?.profile.work_setting || '');

	//
	// B. Handle actions

	useEffect(() => {
		accountContext.actions.update('profile.work_setting', selectedWorkSetting);
	}, [selectedWorkSetting]);

	//
	// C. Render components

	return (
		<View>
			<ListTitle title={t('title')} />
		</View>
	);

	//
}
