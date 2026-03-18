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

	const { t } = useTranslation();

	const [enabledNotificationsAgency, setEnabledNotificationsAgency] = useState<boolean>(accountContext.data.account?.notifications.agency || false);
	const [enabledNotificationsNetwork, setEnabledNotificationsNetwork] = useState<boolean>(accountContext.data.account?.notifications.network || false);
	const [enabledNotificationsEvents, setEnabledNotificationsEvents] = useState<boolean>(accountContext.data.account?.notifications.events || false);

	//
	// B. Handle actions

	useEffect(() => {
		accountContext.actions.update('notifications.agency', enabledNotificationsAgency);
	}, [accountContext.actions, enabledNotificationsAgency]);

	useEffect(() => {
		accountContext.actions.update('notifications.network', enabledNotificationsNetwork);
	}, [accountContext.actions, enabledNotificationsNetwork]);

	useEffect(() => {
		accountContext.actions.update('notifications.events', enabledNotificationsEvents);
	}, [accountContext.actions, enabledNotificationsEvents]);

	//
	// C. Render components

	return (
		<View>
			<ListTitle title={t($ => $.account.AccountEditProfileNotifications.title)} />
		</View>
	);

	//
}
