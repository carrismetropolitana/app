/* * */

import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { Text } from '@rn-vui/themed';
import { useEffect } from 'react';
import { View } from 'react-native';

/* * */

interface Props {
	lineId: string
	stopId: string
}

/* * */

export function SmartNotificationWidgetCardBody({ lineId, stopId }: Props) {
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
			<Text>Line ID: {lineId}</Text>
			<Text>Stop ID: {stopId}</Text>
		</View>
	);

	//
}
