/* * */

import { ListSectionItem } from '@/components/list/ListSectionItem';
import { type PatternSelectionProps } from '@/components/selection/pattern/PatternSelection';
import { useStopsContext } from '@/contexts/Stops.context';
import { useSystemVariables } from '@/theme/global';
import { type Pattern } from '@carrismetropolitana/api-types/network';
import { IconCheck } from '@tabler/icons-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

interface PatternSelectionMainListItemProps extends Pick<PatternSelectionProps, 'onSelect' | 'replaceChevron'> {
	isSelected?: boolean
	item: Pattern
}

/* * */

export function PatternSelectionMainListItem({ isSelected, item, onSelect, replaceChevron }: PatternSelectionMainListItemProps) {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();
	const stopsContext = useStopsContext();

	const { t } = useTranslation();

	//
	// B. Transform data

	const selectedPatternInitialStopData = useMemo(() => {
		if (!item.id) return;
		const sortedStops = [...item.path].sort((a, b) => a.stop_sequence - b.stop_sequence);
		if (!sortedStops || sortedStops.length === 0) return;
		return stopsContext.actions.getStopById(sortedStops[0].stop_id);
	}, [item.id, item.path, stopsContext.actions]);

	//
	// C. Render components

	return (
		<ListSectionItem
			key={item.id}
			accessibilityHint={t($ => $.selection.PatternSelectionMainListItem.accessibility_hint)}
			label={item.headsign}
			onPress={() => onSelect(item.id)}
			replaceChevron={isSelected ? <IconCheck color={systemVariables.status.ok} size={24} /> : replaceChevron}
			accessibilityLabel={t($ => $.selection.PatternSelectionMainListItem.accessibility_label, {
				stop_name: selectedPatternInitialStopData?.tts_name ?? '-',
				tts_headsign: item.tts_headsign,
			})}
			description={t($ => $.selection.PatternSelectionMainListItem.description, {
				stop_name: selectedPatternInitialStopData?.long_name ?? '-',
			})}
		/>
	);

	//
}
