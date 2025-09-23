/* * */

import { useSystemVariables } from '@/theme/global';
import { VehicleOccupancyStatus } from '@carrismetropolitana/api-types/vehicles';
import { IconUserQuestion, IconUsers } from '@tabler/icons-react-native';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface OccupancyIndicatorProps {
	status?: VehicleOccupancyStatus
}

/* * */

export function OccupancyIndicator({ status }: OccupancyIndicatorProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	//
	// B. Render components

	if (status === VehicleOccupancyStatus.seats_available) {
		return (
			<View style={styles.container}>
				<IconUsers color={systemVariables.status.ok} size={36} />
				<View style={[styles.indicator, styles.enabled]} />
				<View style={[styles.indicator, styles.disabled]} />
				<View style={[styles.indicator, styles.disabled]} />
			</View>
		);
	}

	if (status === VehicleOccupancyStatus.standing_only) {
		return (
			<View style={styles.container}>
				<IconUsers color={systemVariables.status.ok} size={36} />
				<View style={[styles.indicator, styles.enabled]} />
				<View style={[styles.indicator, styles.enabled]} />
				<View style={[styles.indicator, styles.disabled]} />
			</View>
		);
	}

	if (status === VehicleOccupancyStatus.full) {
		return (
			<View style={styles.container}>
				<IconUsers color={systemVariables.status.warning} size={36} />
				<View style={[styles.indicator, styles.full]} />
				<View style={[styles.indicator, styles.full]} />
				<View style={[styles.indicator, styles.full]} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<IconUserQuestion color={systemVariables.text[400]} size={36} />
			<View style={[styles.indicator, styles.disabled]} />
			<View style={[styles.indicator, styles.disabled]} />
			<View style={[styles.indicator, styles.disabled]} />
		</View>
	);

	//
}
