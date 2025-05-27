/* * */

import { VehiclesDetail } from '@/components/vehicles/VehiclesDetail';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { VehiclesContextProvider } from '@/contexts/Vehicles.context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
    //

    //
    // A. Setup variables

    const { vehicle_id } = useLocalSearchParams<{ vehicle_id: string }>();
    const themeContext = useThemeContext();
    const navigation = useNavigation();
    const { t } = useTranslation('translation', { keyPrefix: 'layout' });

    //
    // B. Fetch Data

    useEffect(() => {
        navigation.setOptions({
            headerBackTitle: 'Veículo',
            headerStyle: {
                backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
            },
            headerTitle: '',
        });
    }, [navigation, themeContext.theme.mode]);

    //
    // C. Render components

    return (
        <LinesDetailContextProvider>
            <StopsDetailContextProvider>
                <VehiclesContextProvider>
                    <VehiclesDetail id={vehicle_id} />
                </VehiclesContextProvider>
            </StopsDetailContextProvider>
        </LinesDetailContextProvider>
    );

    //
}
