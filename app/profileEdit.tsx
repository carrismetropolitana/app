/* * */

import ProfileEditScreen from '@/components/screens/ProfileEditScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

/* * */

export default function ProfileEdit() {
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
		<LinesDetailContextProvider>
			<StopsDetailContextProvider>
				<ProfileEditScreen />
			</StopsDetailContextProvider>
		</LinesDetailContextProvider>
	);

	//
}
