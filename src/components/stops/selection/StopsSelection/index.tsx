/* * */

import { type MapOverlayStopsGeoJsonProperties } from '@/components/map-new/overlays/MapOverlayStops';
import { StopsSelectionMain } from '@/components/stops/selection/StopsSelectionMain';
import { StopsSelectionContextProvider } from '@/contexts/StopsSelection.context';
import { type Stop } from '@carrismetropolitana/api-types/network';

/* * */

export interface StopsSelectionProps {
	addToRecentsOnPress?: boolean
	onPress: (item: MapOverlayStopsGeoJsonProperties | Stop) => void
	replaceChevron?: React.ReactNode
	withSafeArea?: boolean
	withSearchAutoFocus?: boolean
}

/* * */

export function StopsSelection(props: StopsSelectionProps) {
	return (
		<StopsSelectionContextProvider>
			<StopsSelectionMain {...props} />
		</StopsSelectionContextProvider>
	);
}
