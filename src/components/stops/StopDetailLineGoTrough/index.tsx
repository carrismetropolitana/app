/* * */

import LineByPatternID from '@/components/common/LineByPatternID';
import { useStopDetailContext } from '@/contexts/StopDetail.context';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { styles } from './styles';

/* * */

export default function StopDetailLineGoTrough() {
	//

	//
	// A. Setup variables
	const { t } = useTranslation('translation', { keyPrefix: 'stops.StopDetails' });
	const stopDetailLineGoTroughStyles = styles();
	const stopDetailContext = useStopDetailContext();

	if (!stopDetailContext.data.stop) {
		return null;
	}

	const patternIds = stopDetailContext.data.stop.pattern_ids || [];
	const groupedByLineId: Record<string, string[]> = {};

	patternIds.forEach((patternId) => {
		const lineId = patternId.split('_')[0];
		if (!groupedByLineId[lineId]) groupedByLineId[lineId] = [];
		groupedByLineId[lineId].push(patternId);
	});

	//
	// B. Render components
	return (
		<View style={stopDetailLineGoTroughStyles.sectionWrapper}>
			<Text style={stopDetailLineGoTroughStyles.sectionHeading}>{t('second_heading')}</Text>
			{Object.entries(groupedByLineId).map(([lineId, patternIds]) => (
				<View key={lineId} style={{ marginBottom: 16 }}>
					{patternIds.map(patternId => (
						<View key={patternId} style={{ flex: 1, width: '100%' }}>
							<Link href={`/lines/${lineId}`} style={{ flex: 1, width: '100%' }}>
								<LineByPatternID patternId={patternId} />
							</Link>
						</View>
					))}
				</View>
			))}
		</View>
	);

	//
}
