/* * */

import AddFavoriteStopScreen from '@/components/screens/AddFavoriteStopScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/* * */

export default function AddFavoriteStop() {
    //

    //
    // A. Setup variables

    const navigation = useNavigation();

    useEffect(() => {
        const isAndroid = Platform.OS === 'android';

        navigation.setOptions({
            presentation: isAndroid ? 'modal' : 'formSheet',
            headerTitle: isAndroid ? 'Editar Perfil' : '',
            headerShown: isAndroid ? true : false,
            headerGrabber: true,
            ...(isAndroid
                ? {}
                : {
                    sheetAllowedDetents: ['fitToContents', 'large'],
                    sheetExpandsWhenScrolledToEdge: true,
                    sheetInitialDetentIndex: 0,
                }),
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
