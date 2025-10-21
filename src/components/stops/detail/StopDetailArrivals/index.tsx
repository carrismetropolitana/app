/* * */

import { ListFootnote } from '@/components/list/ListFootnote';
import { ListTitle } from '@/components/list/ListTitle';
import { StopDetailArrivalsList } from '@/components/stops/detail/StopDetailArrivalsList';
import { ArrivalsContextProvider } from '@/contexts/Arrivals.context';
import { useStopDetailContext } from '@/contexts/StopDetail.context';
import { useTranslation } from 'react-i18next';

/* * */

export function StopDetailArrivals() {
	//

	//
	// A. Setup variables

	const stopDetailContext = useStopDetailContext();

	const { t } = useTranslation('translation', { keyPrefix: 'stops.StopDetailArrivals' });

	//
	// B. Render components

	if (!stopDetailContext.data.selected_stop_id || !stopDetailContext.data.selected_stop?.pattern_ids?.length) {
		return null;
	}

	return (
		<>
			<ListTitle title={t('title')} />
			<ArrivalsContextProvider
				limit={5}
				patternIds={stopDetailContext.data.selected_stop.pattern_ids}
				stopId={stopDetailContext.data.selected_stop_id}
				onlyFuture
			>
				<StopDetailArrivalsList />
			</ArrivalsContextProvider>
			<ListFootnote text={t('footnote')} />
		</>
	);

	//
}
