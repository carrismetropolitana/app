/* * */

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
			</ScrollView>
		</VehicleDetailContextProvider>
	);
}
