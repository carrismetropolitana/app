/* * */

import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesContext } from '@/contexts/Lines.context';
import { Dates } from '@/core-replica';
import { Pattern } from '@carrismetropolitana/api-types/network';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native';

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
		const today = Dates.now('Europe/Lisbon').operational_date;
		linesContext.actions.getValidPatternVersionForOperationalDate(patternId, today).then((data) => {
			if (!data) return setPatternData(undefined);
			setPatternData(data);
		});
	}, [patternId, patternData]);

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<LineBadge
				color={patternData?.color}
				shortName={patternData?.short_name}
				size="md"
				textColor={patternData?.text_color}
			/>
			<Text style={styles.title}>
				{patternData?.headsign}
			</Text>
		</View>
	);

	//
}
