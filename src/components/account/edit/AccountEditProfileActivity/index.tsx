/* * */

import { ListTitle } from '@/components/list/ListTitle';
import { useAccountContext } from '@/contexts/Account.context';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

/* * */

export function AccountEditProfileActivity() {
	//

	//
	// A. Setup variables

	const accountContext = useAccountContext();

	const { t } = useTranslation();

	const [selectedActivity, setSelectedActivity] = useState<null | string>(accountContext.data.account?.profile.activity ?? null);

	//
	// B. Handle actions

	useEffect(() => {
		accountContext.actions.update('profile.activity', selectedActivity);
	}, [accountContext.actions, selectedActivity]);

	//
	// C. Render components

	return (
		<View>
			<ListTitle title={t($ => $.account.AccountEditProfileActivity.title)} />
		</View>
	);

	//
}
