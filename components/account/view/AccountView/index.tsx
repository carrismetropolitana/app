/* * */

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

	// async function sendPushNotification(expoPushToken: string) {
	// 	const message = {
	// 		body: 'And here is the body!',
	// 		data: { someData: 'goes here' },
	// 		sound: 'default',
	// 		title: 'Original Title',
	// 		to: expoPushToken,
	// 	};

	// 	await fetch('https://exp.host/--/api/v2/push/send', {
	// 		body: JSON.stringify(message),
	// 		headers: {
	// 			'Accept': 'application/json',
	// 			'Accept-encoding': 'gzip, deflate',
	// 			'Content-Type': 'application/json',
	// 		},
	// 		method: 'POST',
	// 	});
	// }

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
		</Container>
	);

	//
}
