/* * */

import { Container } from '@/components/layout/Container';
import { ProfileViewPersona } from '@/components/profile/view/ProfileViewPersona';
import { ProfileViewWidgets } from '@/components/profile/view/ProfileViewWidgets';
import { ProfileViewWidgetsCreate } from '@/components/profile/view/ProfileViewWidgetsCreate';
import { useNotifications } from '@/contexts/Notifications.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { NestableScrollContainer } from 'react-native-draggable-flatlist';

/* * */

export function ProfileView() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const themeContext = useThemeContext();
	const notificationsContext = useNotifications();

	//
	// B. Transform data

	useEffect(() => {
		navigation.setOptions({
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
		});
	}, [navigation, themeContext.theme.mode]);

	useEffect(() => {
		notificationsContext.actions.askForPermissions();
	}, []);

	//
	// C. Render components

	return (
		<Container>
			<NestableScrollContainer>
				<ProfileViewPersona />
				<ProfileViewWidgets />
				<ProfileViewWidgetsCreate />
			</NestableScrollContainer>
		</Container>
	);

	//
}
