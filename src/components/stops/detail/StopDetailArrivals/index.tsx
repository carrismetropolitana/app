/* * */

import { StopDetailArrivalsList } from '@/components/stops/detail/StopDetailArrivalsList';
import { ArrivalsContextProvider } from '@/contexts/Arrivals.context';
import { useStopDetailContext } from '@/contexts/StopDetail.context';

/* * */

export function StopDetailArrivals() {
	//

	//
	// A. Setup variables

	const stopDetailContext = useStopDetailContext();

	//
	// B. Render components

	if (!stopDetailContext.data.selected_stop_id || !stopDetailContext.data.selected_stop?.pattern_ids?.length) {
		return null;
	}

	return (
		<ArrivalsContextProvider
			limit={5}
			patternIds={stopDetailContext.data.selected_stop.pattern_ids.map(patternId => patternId.toString())}
			stopId={stopDetailContext.data.selected_stop_id}
			onlyFuture
		>
			<StopDetailArrivalsList />
		</ArrivalsContextProvider>
	);

	//
}
