/* * */

import { ListSection } from '@/components/list/ListSection';
import { useLinesContext } from '@/contexts/Lines.context';
import { useSystemVariables } from '@/theme/global';
import { Pattern } from '@carrismetropolitana/api-types/network';
import { IconArrowBarToRight, IconArrowsRightLeft } from '@tabler/icons-react-native';
import { type OperationalDate } from '@tmlmobilidade/types';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
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

export function PatternSelectionTrigger({ description, onSelect, selectedLineId, selectedOperationalDate, selectedPatternId, title }: PatternSelectionTriggerProps) {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const linesContext = useLinesContext();

	const pathname = usePathname();
	const localSearchParams = useLocalSearchParams<{ pattern_id: string }>();

	const [selectedPatternData, setSelectedPatternData] = useState<Pattern>();

	const { t } = useTranslation('translation', { keyPrefix: 'selection.PatternSelectionTrigger' });

	//
	// B. Transform data

	useEffect(() => {
		(async () => {
			if (!localSearchParams.pattern_id) return;
			const foundPatternData = await linesContext.actions.getValidPatternVersionForOperationalDate(localSearchParams.pattern_id, selectedOperationalDate);
			if (!foundPatternData) return;
			setSelectedPatternData(foundPatternData);
		})();
	}, [localSearchParams.pattern_id]);

	//
	// C. Handle actions

	useEffect(() => {
		// Skip if no pattern is selected or if
		// the selected pattern is the same as the param value
		if (!selectedPatternId) return;
		if (selectedPatternId === localSearchParams.pattern_id) return;
		// Update the URL param to match the selected pattern
		router.setParams({ pattern_id: selectedPatternId });
	}, [selectedPatternId]);

	useEffect(() => {
		// Skip if no stop was selected
		if (!localSearchParams.pattern_id) return;
		// Trigger the onSelect callback with the selected stop ID
		if (onSelect) onSelect(localSearchParams.pattern_id);
	}, [localSearchParams.pattern_id]);

	const handleShowList = () => {
		router.navigate({
			params: {
				line_id: selectedLineId,
				operational_date: selectedOperationalDate,
				return_to: pathname,
			},
			pathname: '/selection/pattern',
		});
	};

	//
	// D. Render components

	return (
		<>

			{!selectedPatternData && (
				<ListSection
					description={description}
					title={title}
					items={[{
						icon: <IconArrowBarToRight color={systemVariables.text[100]} />,
						key: 'select-pattern',
						label: t('label'),
						onPress: handleShowList,
					}]}
				/>
			)}

			{selectedPatternData && (
				<ListSection
					description={description}
					title={title}
					items={[{
						accessibilityHint: t('selected.accessibility_hint'),
						accessibilityLabel: t('selected.accessibility_label', { tts_headsign: selectedPatternData.tts_headsign }),
						description: selectedPatternData.version_id,
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
