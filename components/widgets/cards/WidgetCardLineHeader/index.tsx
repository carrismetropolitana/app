/* * */

import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesContext } from '@/contexts/Lines.context';
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

	const [patternData, setPatternData] = useState<null | Pattern>(null);

	//
	// B. Transform data

	useEffect(() => {
		(async () => {
			const data = await linesContext.actions.getPatternDataById(patternId);
			if (!data?.length) return setPatternData(null);
			setPatternData(data[0]);
		})();
	}, [patternId]);

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
