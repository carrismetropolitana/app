/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { VehiclesDetailHeader } from '@/components/vehicles/VehiclesDetailHeader';
import { VehiclesDetailPath } from '../VehiclesDetailPath';
import { Text } from '@rn-vui/themed';

/* * */

interface VehiclesDetailProps {
    id: string;
}

/* * */



export function VehiclesDetail({ id }: VehiclesDetailProps) {
    //

    //
    // A. Setup variables

    const themeContext = useThemeContext();
    

    //
    // B. Render component

    return (
        <ScrollView >
            <View style={{ backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background }}>
                <VehiclesDetailHeader />
                <VehiclesDetailPath />
                <Text> {id} </Text>
            </View>
        </ScrollView>

    );

    //
}
