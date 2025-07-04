/* * */

import ProfileScreen from '@/components/screens/ProfileScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import ProfileContextProvider from '@/contexts/Profile.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

/* * */

export default function Profile() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const themeContext = useThemeContext();

	useEffect(() => {
		navigation.setOptions({
			headerBackTitle: 'Editar Perfil',
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
			headerTitle: '',
		});
	}, [navigation]);

	//
	// B. Render components

	return (
		<ProfileContextProvider>
			<LinesDetailContextProvider>
				<StopsDetailContextProvider>
					<ProfileScreen />
				</StopsDetailContextProvider>
			</LinesDetailContextProvider>
		</ProfileContextProvider>
	);

	//
}
