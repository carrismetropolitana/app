/* * */

import { VehicleDetail } from '@/components/vehicles/detail/VehicleDetail';
import { useLocalSearchParams } from 'expo-router';

/* * */

export default function Page() {
	//

	//
	// A. Render components

	const { vehicle_id } = useLocalSearchParams<{ vehicle_id: string }>();

	return (
		<VehicleDetail id={vehicle_id} />
	);

	//
}
