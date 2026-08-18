/* * */

import { LicensePlate } from '@/components/vehicles/common/LicensePlate';
import { type HubVehicleMetadata } from '@/types/vehicles.types';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface VehiclesDetailOverviewMetadataProps {
	metadata?: HubVehicleMetadata | null
}

/* * */

export function VehiclesDetailOverviewMetadata({ metadata }: VehiclesDetailOverviewMetadataProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	if (!metadata) {
		return null;
	}

	return (
		<View style={styles.container}>
			<LicensePlate value={metadata.license_plate} />
			<Text style={styles.makeAndModel}> {metadata.make} • {metadata.model} </Text>
		</View>
	);

	//
}
