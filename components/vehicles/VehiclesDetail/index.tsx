/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { VehiclesDetailHeader } from '@/components/vehicles/VehiclesDetailHeader';
import { VehiclesDetailPath } from '../VehiclesDetailPath';
import { Text } from '@rn-vui/themed';
import { useEffect, useState } from 'react';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useVehiclesContext } from '@/contexts/Vehicles.context';
import { Vehicle } from '@carrismetropolitana/api-types/vehicles';
import { Line } from '@carrismetropolitana/api-types/network';

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
    const vehiclesContext = useVehiclesContext();
    const lineDetailContext = useLinesDetailContext();

    const [lineId, setLineID] = useState<string | null>(null);
    const [lineData, setLineData] = useState<Line | null>(null);
    const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);

    useEffect(() => {
        if (!id || vehiclesContext.flags.is_loading) return;
        const fetchVehicle = async () => {
            const data = await vehiclesContext.actions.getVehicleById(id);
            if (data) setVehicleData(data);
            console.log("this is a vehicle ===> ", data);
        };
        fetchVehicle();
    }, [id, vehiclesContext.data.vehicles]);

    useEffect(() => {
        if (!vehicleData) return;
        setLineID(vehicleData?.line_id || null);
        if (vehicleData?.line_id) {
            lineDetailContext.actions.setLineId(vehicleData.line_id);
            setLineID(vehicleData.line_id);
        } else {
            console.warn("Vehicle does not have a line_id");
        }
    }, [vehicleData]);

    useEffect(() => {
        if (!lineId) return;
        const lineData = lineDetailContext.data.line;
        setLineData(lineData ?? null);
    }, [lineDetailContext.data.lineId, lineDetailContext.data.line]);


    //
    // B. Render component

    return (
        <ScrollView >
            <View style={{ backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background }}>
                <VehiclesDetailHeader data={vehicleData}/>
                <VehiclesDetailPath />
            </View>
        </ScrollView>

    );

    //
}
