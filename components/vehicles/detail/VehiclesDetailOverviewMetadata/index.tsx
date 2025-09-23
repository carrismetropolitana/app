/* * */

import { LicensePlate } from '@/components/vehicles/common/LicensePlate';
import { type Vehicle } from '@carrismetropolitana/api-types/vehicles';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface VehiclesDetailOverviewMetadataProps {
	vehicleData?: Vehicle
}

/* * */

export function VehiclesDetailOverviewMetadata({ vehicleData }: VehiclesDetailOverviewMetadataProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	if (!vehicleData) {
		return null;
	}

	return (
		<View style={styles.container}>
			<LicensePlate value={vehicleData.license_plate} />
			<Text style={styles.makeAndModel}> {vehicleData.make} • {vehicleData.model} </Text>
		</View>
	);

	//
}
