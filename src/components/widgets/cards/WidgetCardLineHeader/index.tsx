/* * */

import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesContext } from '@/contexts/Lines.context';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { useStyles } from './styles';
import { HubPattern } from '@tmlmobilidade/go-types-public-info';

/* * */

interface WidgetCardLineHeaderProps {
	patternId: string
}

/* * */

export function WidgetCardLineHeader({ patternId }: WidgetCardLineHeaderProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const linesContext = useLinesContext();

	const [patternData, setPatternData] = useState<HubPattern | undefined >(linesContext.data.patterns_cache[patternId]?.[0]);

	//
	// B. Transform data

	useEffect(() => {
		if (patternData?._id === patternId) return;
		linesContext.actions.getValidPatternVersionForOperationalDate(patternId).then((data) => {
			if (!data) return setPatternData(undefined);
			setPatternData(data);
		});
	}, [patternId, patternData]);

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<LineBadge
				lineId={patternData?.line_id}
				size="md"
			/>
			<Text style={styles.title}>
				{patternData?.headsign}
			</Text>
		</View>
	);

	//
}
