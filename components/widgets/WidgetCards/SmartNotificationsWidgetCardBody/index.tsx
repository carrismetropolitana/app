/* * */

import { LineDisplay } from '@/components/lines/LineDisplay';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { Text } from '@rn-vui/themed';
import { useEffect } from 'react';
import { View } from 'react-native';

/* * */

interface Props {
	lineId: string
}

/* * */

export function SmartNotificationWidgetCardBody({ lineId }: Props) {
	//

	//
	// A. Setup Variables
	const lineDetailContext = useLinesDetailContext();
	const lineData = lineDetailContext.data.line;

	//
	// B. Fetch Data

	useEffect(() => {
		if (!lineId) return;
		lineDetailContext.actions.setLineId(lineId);
	}, [lineDetailContext.data.line, lineId]);

	// B. Render Components

	if (!lineId) {
		return (
			<View>
				<Text>There has been an error. Try again later.</Text>
			</View>
		);
	}
	return (
		<View style={{ marginBottom: 10, padding: 10 }}>
			<LineDisplay lineData={lineData} size="lg" />
		</View>
	);

	//
}
