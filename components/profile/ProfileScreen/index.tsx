/* * */

import { CreateWidgetList } from '@/components/profile/CreateWidgetList';
import { UserOverview } from '@/components/profile/UserOverview';
import { WidgetsList } from '@/components/profile/WidgetsList';
import { useNotifications } from '@/contexts/Notifications.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { NestableScrollContainer } from 'react-native-draggable-flatlist';

/* * */

export function ProfileScreen() {
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
		<SafeAreaView>
			<NestableScrollContainer>
				<UserOverview />
				<WidgetsList />
				<CreateWidgetList />
			</NestableScrollContainer>
		</SafeAreaView>
	);

	//
}
