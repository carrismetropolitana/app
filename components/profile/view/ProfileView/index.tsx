/* * */

import { Container } from '@/components/layout/Container';
import { ProfileViewPersona } from '@/components/profile/view/ProfileViewPersona';
import { ProfileViewWidgetsCreate } from '@/components/profile/view/ProfileViewWidgetsCreate';
import { ProfileViewWidgetsList } from '@/components/profile/view/ProfileViewWidgetsList';

/* * */

export function ProfileView() {
	//

	//
	// A. Setup variables

	// const notificationsContext = useNotifications();

	//
	// B. Handle actions

	// useEffect(() => {
	// 	notificationsContext.actions.askForPermissions();
	// }, []);

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
