/* * */

import { LinesDetailPathMap } from '@/components/lines/LinesDetailPathMap';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { Text } from '@rneui/themed';
import { useEffect } from 'react';
import { View } from 'react-native';

/* * */

interface Props {
	lineId: string
}

/* * */

export function LineWidgetCardBody({ lineId }: Props) {
	//

	//
	// A. Setup Variables
	const lineDetailContext = useLinesDetailContext();
	//
	// B. Fetch Data

	useEffect(() => {
		if (!lineId) return;
		lineDetailContext.actions.setLineId(lineId);
	}, [lineId]);

	// B. Render Components

	if (!lineId) {
		return (
			<View>
				<Text>There has been an error. Try again later.</Text>
			</View>
		);
	}
	return (
		<View>
			{lineId && (
				<LinesDetailPathMap key={lineId} hasToolbar={false} />
			)}
		</View>
	);

	//
}
