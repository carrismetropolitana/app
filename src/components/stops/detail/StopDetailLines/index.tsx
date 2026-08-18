/* * */

import { NoDataLabel } from '@/components/common/NoDataLabel';
import { LineBadge } from '@/components/lines/LineBadge';
import { ListSection } from '@/components/list/ListSection';
import { ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useStopDetailContext } from '@/contexts/StopDetail.context';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export function StopDetailLines() {
	//

	//
	// A. Setup variables

	const stopDetailContext = useStopDetailContext();

	const { t } = useTranslation();

	//
	// B. Transform data

	const availablePatternsList: ListSectionItemProps[] = useMemo(() => {
		// Skip if no patterns are available
		if (!stopDetailContext.data.available_patterns?.length) return [];
		// Prepare patterns list
		return stopDetailContext.data.available_patterns.map(item => ({
			icon: <LineBadge lineId={item.line_id} withAlertIcon />,
			key: item._id.toString(),
			label: item.headsign,
			onPress: () => router.navigate(`/(modals)/(line-modal)/${item.line_id}`),
		}));
	}, [stopDetailContext.data.available_patterns]);

	//
	// C. Render components

	if (!availablePatternsList.length) {
		return <NoDataLabel text={t($ => $.stops.StopDetailLines.no_data)} />;
	}

	return (
		<ListSection
			items={availablePatternsList}
			title={t($ => $.stops.StopDetailLines.title)}
		/>
	);

	//
}
