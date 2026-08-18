/* * */

import { OccupancyIndicator } from '@/components/vehicles/common/OccupancyIndicator';
import { WheelchairIndicator } from '@/components/vehicles/common/WheelchairIndicator';
import { VehiclesDetailOverviewMetadata } from '@/components/vehicles/detail/VehiclesDetailOverviewMetadata';
import { VehiclesDetailOverviewPattern } from '@/components/vehicles/detail/VehiclesDetailOverviewPattern';
import { useVehicleDetailContext } from '@/contexts/VehicleDetail.context';
import { ActivityIndicator, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function VehiclesDetailOverview() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const vehicleDetailContext = useVehicleDetailContext();

	//
	// B. Render components

	if (vehicleDetailContext.flags.loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<VehiclesDetailOverviewPattern patternData={vehicleDetailContext.data.pattern} />
			<VehiclesDetailOverviewMetadata metadata={vehicleDetailContext.data.metadata} />
			<View style={styles.row}>
				<WheelchairIndicator enabled={vehicleDetailContext.data.metadata?.wheelchair} />
				<OccupancyIndicator />
			</View>
		</View>
	);

	//
}
