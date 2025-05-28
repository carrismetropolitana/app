/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { VehiclesDetailHeader } from '@/components/vehicles/VehiclesDetailHeader';
import { VehiclesDetailPath } from '../VehiclesDetailPath';
import { useEffect, useState } from 'react';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useVehiclesContext } from '@/contexts/Vehicles.context';
import { Vehicle } from '@carrismetropolitana/api-types/vehicles';

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
    const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);

    useEffect(() => {
        if (!id || vehiclesContext.flags.is_loading) return;
        const fetchVehicle = async () => {
            const data = await vehiclesContext.actions.getVehicleById(id);
            if (data) setVehicleData(data);
        };
        fetchVehicle();
    }, [id, vehiclesContext.data.vehicles, vehiclesContext.flags.is_loading]);

    useEffect(() => {
        if (!vehicleData) return;

        if (vehicleData.line_id && vehicleData.line_id !== lineDetailContext.data.lineId) {
            lineDetailContext.actions.setLineId(vehicleData.line_id);
            setLineID(vehicleData.line_id);
        }

        if (vehicleData.pattern_id && vehicleData.pattern_id !== lineDetailContext.data.active_pattern?.id) {
            lineDetailContext.actions.setActivePattern(vehicleData.pattern_id);
        }

    }, [vehicleData, lineDetailContext.actions, lineDetailContext.data.lineId, lineDetailContext.data.active_pattern?.id]);

    useEffect(() => {
        if (!vehicleData || !vehicleData.stop_id || !lineDetailContext.data.active_pattern || vehicleData.pattern_id !== lineDetailContext.data.active_pattern.id) {
            return;
        }
        const currentPatternPath = lineDetailContext.data.active_pattern.path;
        const vehicleCurrentWaypoint = currentPatternPath.find(waypoint => waypoint.stop_id === vehicleData.stop_id);
        if (vehicleCurrentWaypoint) {
            if (lineDetailContext.data.active_waypoint?.stop_id !== vehicleCurrentWaypoint.stop_id ||
                lineDetailContext.data.active_waypoint?.stop_sequence !== vehicleCurrentWaypoint.stop_sequence) {
                lineDetailContext.actions.setActiveWaypoint(vehicleCurrentWaypoint.stop_id, vehicleCurrentWaypoint.stop_sequence);
            }
        }
    }, [vehicleData, lineDetailContext.data.active_pattern, lineDetailContext.data.active_waypoint, lineDetailContext.actions]);

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
