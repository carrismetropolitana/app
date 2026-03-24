/* * */

import { ListSection } from '@/components/list/ListSection';
import { useLinesContext } from '@/contexts/Lines.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useSystemVariables } from '@/theme/global';
import { type Pattern } from '@carrismetropolitana/api-types/network';
import { IconArrowBarToRight, IconArrowsRightLeft } from '@tabler/icons-react-native';
import { type OperationalDate } from '@tmlmobilidade/types';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

interface PatternSelectionTriggerProps {
	description?: string
	onSelect?: (patternId: string) => void
	selectedLineId?: string
	selectedOperationalDate?: OperationalDate
	selectedPatternId?: string
	title?: string
}

/* * */

export function PatternSelectionTrigger({ description, selectedLineId, selectedOperationalDate, selectedPatternId, title }: PatternSelectionTriggerProps) {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const linesContext = useLinesContext();
	const stopsContext = useStopsContext();

	const [selectedPatternData, setSelectedPatternData] = useState<Pattern>();

	const { t } = useTranslation();

	//
	// B. Handle actions

	useEffect(() => {
		(async () => {
			if (!selectedPatternId) {
				setSelectedPatternData(undefined);
				return;
			}

			const foundPatternData = await linesContext.actions.getValidPatternVersionForOperationalDate(
				selectedPatternId,
				selectedOperationalDate,
			);

			setSelectedPatternData(foundPatternData ?? undefined);
		})();
	}, [linesContext.actions, selectedOperationalDate, selectedPatternId]);

	const selectedPatternInitialStopName = useMemo(() => {
		if (!selectedPatternData) return;

		const sortedStops = [...selectedPatternData.path].sort((a, b) => a.stop_sequence - b.stop_sequence);
		if (sortedStops.length === 0) return;

		const stopData = stopsContext.actions.getStopById(sortedStops[0].stop_id);
		return stopData?.long_name;
	}, [selectedPatternData, stopsContext.actions]);

	const handleShowList = () => {
		router.push({
			params: { line_id: selectedLineId ?? '', pattern_id: selectedPatternId ?? '' },
			pathname: '/(modals)/(line-modal)/[line_id]/pattern',
		});
	};

	//
	// C. Render components

	return (
		<>
			{!selectedPatternData && (
				<ListSection
					description={description}
					title={title}
					items={[{
						icon: <IconArrowBarToRight color={systemVariables.text[100]} />,
						key: 'select-pattern',
						label: t($ => $.selection.PatternSelectionTrigger.label),
						onPress: handleShowList,
					}]}
				/>
			)}
			{selectedPatternData && (
				<ListSection
					description={description}
					title={title}
					items={[{
						accessibilityHint: t($ => $.selection.PatternSelectionTrigger.selected.accessibility_hint),
						accessibilityLabel: t($ => $.selection.PatternSelectionTrigger.selected.accessibility_label, {
							tts_headsign: selectedPatternData.tts_headsign,
						}),
						description: t($ => $.selection.PatternSelectionTrigger.selected.description, {
							stop_name: selectedPatternInitialStopName,
						}),
						icon: <IconArrowBarToRight color={systemVariables.text[100]} />,
						key: 'selected-pattern',
						label: selectedPatternData.headsign,
						onPress: handleShowList,
						replaceChevron: <IconArrowsRightLeft color={systemVariables.text[100]} />,
					}]}
				/>
			)}
		</>
	);

	//
}
