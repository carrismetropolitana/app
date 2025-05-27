/* * */

import { Surface } from '@/components/common/layout/Surface';
import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { Text } from '@rn-vui/themed';
import { View } from 'react-native';

import { styles } from './styles';
import { Vehicle } from '@carrismetropolitana/api-types/vehicles';

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
					</View>
					<Text style={lineDetailsHeaderStyles.lineName}>{linesDetailContext.data.line.long_name}</Text>
				</View>
				<Text> Vehicle ID: {data?.id} </Text>
				<Text> vehicle license plate : {data?.license_plate} </Text>
				<Text> vehicle model : {data?.model} </Text>
				<Text> vehicle make : {data?.make} </Text>
				<Text> line destiny: {linesDetailContext.data.active_pattern?.headsign}</Text>
				<Text> Wheelchair: {data?.wheelchair_accessible ? "Yes" : "No"}</Text>
				<Text> bikeallowed: {data?.bikes_allowed ? "Yes" : "No"}</Text>
				
			</View>
		</Surface>
	);

	//
}
