/* * */

import { LineDetailPath } from '@/components/lines/detail/LineDetailPath';
import { VehicleDetailMap } from '@/components/vehicles/detail/VehicleDetailMap';
import { VehiclesDetailOverview } from '@/components/vehicles/detail/VehiclesDetailOverview';
import { LineDetailContextProvider } from '@/contexts/LineDetail.context';
import { useVehicleDetailContext, VehicleDetailContextProvider } from '@/contexts/VehicleDetail.context';
import { ScrollView } from 'react-native';

/* * */

interface VehicleDetailProps {
	id: string
}

/* * */

function VehicleDetailPath() {
	const vehicleDetailContext = useVehicleDetailContext();
	const patternData = vehicleDetailContext.data.pattern;
	const tripId = vehicleDetailContext.data.vehicle?.trip_id;

	if (!patternData?._id || !patternData.line_id) {
		return null;
	}

	return (
		<LineDetailContextProvider
			key={`${patternData._id}-${tripId}`}
			initialPatternId={patternData._id}
			initialTripIds={tripId ? [tripId] : undefined}
			lineId={patternData.line_id}
		>
			<LineDetailPath />
		</LineDetailContextProvider>
	);
}

/* * */

export function VehicleDetail({ id }: VehicleDetailProps) {
	return (
		<VehicleDetailContextProvider vehicleId={id}>
			<ScrollView>
				<VehiclesDetailOverview />
				<VehicleDetailMap />
				<VehicleDetailPath />
			</ScrollView>
		</VehicleDetailContextProvider>
	);
}
