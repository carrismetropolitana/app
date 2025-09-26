/* * */

import { TextInputField } from '@/components/common/TextInputField';
import { ListTitle } from '@/components/list/ListTitle';
import { useAccountContext } from '@/contexts/Account.context';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

/* * */

export function AccountEditProfileNotifications() {
	//

	//
	// A. Setup variables

	const accountContext = useAccountContext();

	const { t } = useTranslation('translation', { keyPrefix: 'account.AccountEditProfileNotifications' });

	const [enabledNotificationsAgency, setEnabledNotificationsAgency] = useState<boolean>(accountContext.data.account?.notifications.agency || false);
	const [enabledNotificationsNetwork, setEnabledNotificationsNetwork] = useState<boolean>(accountContext.data.account?.notifications.network || false);
	const [enabledNotificationsEvents, setEnabledNotificationsEvents] = useState<boolean>(accountContext.data.account?.notifications.events || false);

	//
	// B. Handle actions

	useEffect(() => {
		accountContext.actions.update('notifications.agency', enabledNotificationsAgency);
	}, [enabledNotificationsAgency]);

	useEffect(() => {
		accountContext.actions.update('notifications.network', enabledNotificationsNetwork);
	}, [enabledNotificationsNetwork]);

	useEffect(() => {
		accountContext.actions.update('notifications.events', enabledNotificationsEvents);
	}, [enabledNotificationsEvents]);

	//
	// C. Render components

	return (
		<View>
			<ListTitle title={t('title')} />
		</View>
	);

	//
}
