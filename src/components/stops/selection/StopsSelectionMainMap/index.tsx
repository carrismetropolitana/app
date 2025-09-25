/* * */

import { MapOverlayStops } from '@/components/map-new/overlays/MapOverlayStops';
import { MapView } from '@/components/map-new/view/MapView';
import { type StopsSelectionProps } from '@/components/stops/selection/StopsSelection';
import { useStopsSelectionContext } from '@/contexts/StopsSelection.context';
import { Stop } from '@carrismetropolitana/api-types/network';
import * as Haptics from 'expo-haptics';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function StopsSelectionMainMap({ onPress }: StopsSelectionProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const stopsSelectionContext = useStopsSelectionContext();

	//
	// B. Handle actions

	const handleSelectStop = (stop: Stop) => {
		if (!onPress) return;
		onPress(stop);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
	};

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<MapView>
				<MapOverlayStops
					onSelectStop={handleSelectStop}
					stopsData={stopsSelectionContext.data.filtered_fc}
				/>
			</MapView>
		</View>
	);
}
