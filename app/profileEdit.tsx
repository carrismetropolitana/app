/* * */

import ProfileEditScreen from '@/components/screens/ProfileEditScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/* * */

export default function ProfileEdit() {
    //

    //
    // A. Setup variables

    const navigation = useNavigation();

    useEffect(() => {
        const isAndroid = Platform.OS === 'android';

        navigation.setOptions({
            presentation: isAndroid ? 'modal' : 'formSheet',
            headerShown: false,
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
                <ProfileEditScreen />
            </StopsDetailContextProvider>
        </LinesDetailContextProvider>
    );

    //
}
