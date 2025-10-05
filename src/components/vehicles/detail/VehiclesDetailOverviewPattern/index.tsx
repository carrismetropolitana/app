/* * */

import { LineBadge } from '@/components/lines/LineBadge';
import { type Pattern } from '@carrismetropolitana/api-types/network';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface VehiclesDetailOverviewPatternProps {
	patternData?: Pattern
}

/* * */

export function VehiclesDetailOverviewPattern({ patternData }: VehiclesDetailOverviewPatternProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	if (!patternData) {
		return null;
	}

	return (
		<View style={styles.container}>
			<LineBadge lineId={patternData.line_id} size="lg" />
			<Text style={styles.headsign}>{patternData.headsign}</Text>
		</View>
	);

	//
}
