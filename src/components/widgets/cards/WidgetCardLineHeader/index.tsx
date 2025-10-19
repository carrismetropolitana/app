/* * */

import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesContext } from '@/contexts/Lines.context';
import { type Pattern } from '@carrismetropolitana/api-types/network';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

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

	const [patternData, setPatternData] = useState<Pattern | undefined>(linesContext.data.patterns_cache[patternId]?.[0]);

	//
	// B. Transform data

	useEffect(() => {
		if (patternData?.id === patternId) return;
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
