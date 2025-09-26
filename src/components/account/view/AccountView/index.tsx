/* * */

import { AccountViewInfo } from '@/components/account/view/AccountViewInfo';
import { AccountViewPersona } from '@/components/account/view/AccountViewPersona';
import { AccountViewWidgetsCreate } from '@/components/account/view/AccountViewWidgetsCreate';
import { AccountViewWidgetsList } from '@/components/account/view/AccountViewWidgetsList';
import { Container } from '@/components/layout/Container';
import { useNotificationsContext } from '@/contexts/Notifications.context';
import { useEffect } from 'react';

/* * */

export function AccountView() {
	//

	//
	// A. Setup variables

	const notificationsContext = useNotificationsContext();

	//
	// B. Handle actions

	useEffect(() => {
		notificationsContext.actions.askForPermission();
	}, []);

	//
	// C. Render components

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
