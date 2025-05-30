/* * */

import AddFavoriteLineScreen from '@/components/screens/AddFavoriteLineScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/* * */

export default function AddFavoriteLine() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	  const themeContext = useThemeContext();

		useEffect(() => {
		navigation.setOptions({
			headerTitle: '',
			headerBackTitle: 'Linha Favorita',
			 headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
		});
	}, [navigation]);

	//
	// B. Render components

	return (
		<LinesDetailContextProvider>
			<StopsDetailContextProvider>
				<AddFavoriteLineScreen />
			</StopsDetailContextProvider>
		</LinesDetailContextProvider>
	);

	//
}
