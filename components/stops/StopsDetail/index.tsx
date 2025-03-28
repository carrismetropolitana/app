/* * */

// import { StopsDetailAlerts } from '@/components/stops/StopsDetailAlerts';
// import { StopsDetailContent } from '@/components/stops/StopsDetailContent';
import { StopsDetailHeader } from '@/components/stops/StopsDetailsHeader';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { Text } from '@rneui/base';

/* * */

export function StopsDetail() {
	const stopsDetailContext = useStopsDetailContext();

	return (
		<>
			<Text>{stopsDetailContext.data.stop?.id}</Text>
			{/* <StopsDetailHeader /> */}
			{/* <StopsDetailAlerts />
			<StopsDetailContent /> */}
			{/* TODO */}
			{/* <StopDetailMetrics /> */}
		</>
	);
}
