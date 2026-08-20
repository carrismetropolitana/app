/* * */

import { LineBadge } from '@/components/lines/LineBadge';
import { type HubPattern } from '@tmlmobilidade/go-types-public-info';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface VehiclesDetailOverviewPatternProps {
	patternData?: HubPattern
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
