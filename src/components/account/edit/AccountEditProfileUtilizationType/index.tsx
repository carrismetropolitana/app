/* * */

import { ListTitle } from '@/components/list/ListTitle';
import { useAccountContext } from '@/contexts/Account.context';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

/* * */

export function AccountEditProfileUtilizationType() {
	//

	//
	// A. Setup variables

	const accountContext = useAccountContext();

	const { t } = useTranslation();

	const [selectedUtilizationType, setSelectedUtilizationType] = useState<null | string>(accountContext.data.account?.profile.utilization_type || null);

	//
	// B. Handle actions

	useEffect(() => {
		accountContext.actions.update('profile.utilization_type', selectedUtilizationType);
	}, [selectedUtilizationType]);

	//
	// C. Render components

	return (
		<View>
			<ListTitle title={t($ => $.account.AccountEditProfileUtilizationType.title)} />
		</View>
	);

	//
}
