/* * */

import AddFavoriteStopScreen from '@/components/screens/AddFavoriteStopScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

/* * */

export default function AddFavoriteStop() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const themeContext = useThemeContext();

	useEffect(() => {
		navigation.setOptions({
			headerBackTitle: 'Paragem Favorita',
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
				<AddFavoriteStopScreen />
			</StopsDetailContextProvider>
		</LinesDetailContextProvider>
	);

	//
}
