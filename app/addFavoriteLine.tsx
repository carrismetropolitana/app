/* * */

import AddFavoriteLineScreen from '@/components/screens/AddFavoriteLineScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/* * */

export default function AddFavoriteLine() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();

		useEffect(() => {
		navigation.setOptions({
			headerTitle: '',
			headerBackTitle: 'Linha Favorita',
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
