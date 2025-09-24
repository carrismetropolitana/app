/* * */

import { WidgetCardStopBodyArrivals } from '@/components/widgets/cards/WidgetCardStopBodyArrivals';
import { ArrivalsContextProvider } from '@/contexts/Arrivals.context';
import { type WidgetStop } from '@/schemas/widgets';

/* * */

interface WidgetCardStopBodyProps {
	data: WidgetStop
}

/* * */

export function WidgetCardStopBody({ data }: WidgetCardStopBodyProps) {
	return (
		<ArrivalsContextProvider
			limit={5}
			patternIds={data.properties.pattern_ids}
			stopId={data.properties.stop_id}
			onlyFuture
		>
			<WidgetCardStopBodyArrivals />
		</ArrivalsContextProvider>
	);
}
