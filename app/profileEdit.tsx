/* * */

import ProfileEditScreen from '@/components/screens/ProfileEditScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

/* * */

export default function ProfileEdit() {
    //

    //
    // A. Setup variables

    const navigation = useNavigation();

    useEffect(() => {

        navigation.setOptions({
            headerTitle: '',
            headerBackTitle: 'Editar Perfil',
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
