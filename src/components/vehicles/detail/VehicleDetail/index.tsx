/* * */

import { VehicleDetailMap } from '@/components/vehicles/detail/VehicleDetailMap';
import { VehiclesDetailOverview } from '@/components/vehicles/detail/VehiclesDetailOverview';
import { VehicleDetailContextProvider } from '@/contexts/VehicleDetail.context';
import { ScrollView } from 'react-native';

/* * */

interface VehicleDetailProps {
	id: string
}

/* * */

export function VehicleDetail({ id }: VehicleDetailProps) {
	return (
		<VehicleDetailContextProvider vehicleId={id}>
			<ScrollView>
				<VehiclesDetailOverview />
				<VehicleDetailMap />
			</ScrollView>
		</VehicleDetailContextProvider>
	);
}
