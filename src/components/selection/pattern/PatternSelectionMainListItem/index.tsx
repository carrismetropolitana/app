/* * */

import { ListSectionItem } from '@/components/list/ListSectionItem';
import { type PatternSelectionProps } from '@/components/selection/pattern/PatternSelection';
import { useStopsContext } from '@/contexts/Stops.context';
import { type Pattern } from '@carrismetropolitana/api-types/network';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

interface PatternSelectionMainListItemProps extends Pick<PatternSelectionProps, 'onSelect' | 'replaceChevron'> {
	item: Pattern
}

/* * */

export function PatternSelectionMainListItem({ item, onSelect, replaceChevron }: PatternSelectionMainListItemProps) {
	//

	//
	// A. Setup variables

	const stopsContext = useStopsContext();

	const { t } = useTranslation('translation', { keyPrefix: 'selection.PatternSelectionMainListItem' });

	//
	// B. Transform data

	const selectedPatternInitialStopData = useMemo(() => {
		if (!item.id) return;
		const sortedStops = item.path.sort((a, b) => a.stop_sequence - b.stop_sequence);
		if (!sortedStops || sortedStops.length === 0) return;
		return stopsContext.actions.getStopById(sortedStops[0].stop_id);
	}, [item, stopsContext.data.stops]);

	//
	// C. Render components

	return (
		<ListSectionItem
			key={item.id}
			accessibilityHint={t('accessibility_hint')}
			accessibilityLabel={t('accessibility_label', { stop_name: selectedPatternInitialStopData?.tts_name ?? '-', tts_headsign: item.tts_headsign })}
			description={t('description', { stop_name: selectedPatternInitialStopData?.long_name ?? '-' })}
			label={item.headsign}
			onPress={() => onSelect(item.id)}
			replaceChevron={replaceChevron}
		/>
	);

	//
}
