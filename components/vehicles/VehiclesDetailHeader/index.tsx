/* * */

import { Surface } from '@/components/common/layout/Surface';
import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { Text } from '@rn-vui/themed';
import { View } from 'react-native';

import { styles } from './styles';
import { Vehicle } from '@carrismetropolitana/api-types/vehicles';
import { IconBike, IconBikeOff, IconCircleFilled, IconDisabled2, IconDisabledOff, IconUser } from '@tabler/icons-react-native';
import { LicensePlate } from '@/components/common/LicensePlate';
import { theming } from '@/theme/Variables';

/* * */

interface VehiclesDetailHeaderProps {
	data?: Vehicle | null;
}

/* * */
export function VehiclesDetailHeader({ data }: VehiclesDetailHeaderProps) {
	//

	//
	// A. Setup variables
	const linesDetailContext = useLinesDetailContext();

	const lineDetailsHeaderStyles = styles();

	//
	// B. Render components

	if (!linesDetailContext.data.line) {
		return null;
	}

	return (
		<Surface>
			<View style={lineDetailsHeaderStyles.headingSection}>
				<View style={lineDetailsHeaderStyles.headingSectionRow}>

					<View style={lineDetailsHeaderStyles.headingFirstSection}>
						<LineBadge lineData={linesDetailContext.data.line} size="lg" />
						<Text style={lineDetailsHeaderStyles.lineDestination} > {linesDetailContext.data.active_pattern?.headsign} </Text>
						<Text style={lineDetailsHeaderStyles.lineName}>{linesDetailContext.data.line.long_name}</Text>
					</View>
					<View style={lineDetailsHeaderStyles.busInfoSection}>
						<LicensePlate value={data?.license_plate || ''} />
						<Text> {data?.make} {'•'} {data?.model} </Text>
					</View>
					<View style={lineDetailsHeaderStyles.accessibilitySection}>
						{data?.wheelchair_accessible ? <IconDisabled2 size={32} color={linesDetailContext.data.line.color} /> : <IconDisabledOff size={32} color={linesDetailContext.data.line.color} />}
						{data?.bikes_allowed ? <IconBike size={32} color={linesDetailContext.data.line.color} /> : <IconBikeOff size={32} color={linesDetailContext.data.line.color} />}
						{data?.occupancy_status && data?.occupancy_status.toString() === 'FULL' && data?.occupancy_status.toString() === 'NO_DATA_AVAILABLE' &&
							<>
								<IconUser size={32} color={linesDetailContext.data.line.color} />
								<IconCircleFilled size={32} color={theming.colorSystemBorder200} />
								<IconCircleFilled size={32} color={theming.colorSystemBorder200} />
								<IconCircleFilled size={32} color={theming.colorSystemBorder200} />
							</>}
						{data?.occupancy_status && data?.occupancy_status.toString() === 'EMPTY' &&
							<>
								<IconUser size={32} color={linesDetailContext.data.line.color} />
								<IconCircleFilled size={32} color={linesDetailContext.data.line.color} />
								<IconCircleFilled size={32} color={linesDetailContext.data.line.color} />
								<IconCircleFilled size={32} color={linesDetailContext.data.line.color} />
							</>}
						{data?.occupancy_status && data?.occupancy_status.toString() === 'SEATS_AVAILABLE' &&
							<>
								<IconUser size={32} color={linesDetailContext.data.line.color} />
								<IconCircleFilled size={32} color={linesDetailContext.data.line.color} />
								<IconCircleFilled size={32} color={linesDetailContext.data.line.color} />
								<IconCircleFilled size={32} color={theming.colorSystemBorder200} />
							</>}
						{data?.occupancy_status && data?.occupancy_status.toString() === 'STANDING_ONLY' &&
							<>
								<IconUser size={32} color={linesDetailContext.data.line.color} />
								<IconCircleFilled size={32} color={linesDetailContext.data.line.color} />
								<IconCircleFilled size={32} color={theming.colorSystemBorder200} />
								<IconCircleFilled size={32} color={theming.colorSystemBorder200} />
							</>}

					</View>
				</View>
			</View>
		</Surface>
	);

	//
}
