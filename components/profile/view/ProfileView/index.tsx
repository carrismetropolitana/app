/* * */

import { Container } from '@/components/layout/Container';
import { ProfileViewPersona } from '@/components/profile/view/ProfileViewPersona';
import { ProfileViewWidgetsCreate } from '@/components/profile/view/ProfileViewWidgetsCreate';
import { ProfileViewWidgetsList } from '@/components/profile/view/ProfileViewWidgetsList';
import { useNotificationsContext } from '@/contexts/Notifications.context';
import { useEffect } from 'react';

/* * */

export function ProfileView() {
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
			<ProfileViewPersona />
			<ProfileViewWidgetsList />
			<ProfileViewWidgetsCreate />
		</Container>
	);

	//
}
