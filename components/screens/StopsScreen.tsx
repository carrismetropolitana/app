/* * */
import { useStops } from '@/services/api/queries/useStops';

import { StyledMapView } from '../maps/StyledMapView';
/* * */
export default function StopsScreen() {
	//

	//
	// A. Setup variables

	const { data: stops } = useStops({
		needsFocus: true,
	});

	//
	// B. Render components

	return <StyledMapView />;

	//
}
