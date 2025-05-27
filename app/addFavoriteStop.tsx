/* * */

import AddFavoriteStopScreen from '@/components/screens/AddFavoriteStopScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

/* * */

export default function AddFavoriteStop() {
    //

    //
    // A. Setup variables

    const navigation = useNavigation();

	useEffect(() => {
		navigation.setOptions({
            headerBackTitle: 'Paragem Favorita',
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
