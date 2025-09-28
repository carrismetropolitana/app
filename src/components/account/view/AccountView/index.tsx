/* * */

import { AccountViewInfo } from '@/components/account/view/AccountViewInfo';
import { AccountViewPersona } from '@/components/account/view/AccountViewPersona';
import { AccountViewWidgetsCreate } from '@/components/account/view/AccountViewWidgetsCreate';
import { AccountViewWidgetsList } from '@/components/account/view/AccountViewWidgetsList';
import { Container } from '@/components/layout/Container';
import { useAccountContext } from '@/contexts/Account.context';
import { useNotificationsContext } from '@/contexts/Notifications.context';
import { useEffect } from 'react';

import { AccountViewAnonymous } from '../AccountViewAnonymous';

/* * */

export function AccountView() {
	//

	//
	// A. Setup variables

	const accountContext = useAccountContext();
	const notificationsContext = useNotificationsContext();

	//
	// B. Handle actions

	useEffect(() => {
		notificationsContext.actions.askForPermission();
	}, []);

	//
	// C. Render components

	if (accountContext.flags.anonymous) {
		return (
			<Container>
				<AccountViewAnonymous />
			</Container>
		);
	}

	return (
		<Container>
			<AccountViewPersona />
			<AccountViewWidgetsList />
			<AccountViewWidgetsCreate />
			<AccountViewInfo />
		</Container>
	);

	//
}
