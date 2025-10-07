/* * */

import { ListSection } from '@/components/list/ListSection';
import { useLinesContext } from '@/contexts/Lines.context';
import { useSystemVariables } from '@/theme/global';
import { IconArrowsRightLeft, IconBusStop } from '@tabler/icons-react-native';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

interface PatternSelectionTriggerProps {
	description?: string
	onSelect?: (lineId: string) => void
	selectedPatternId?: string
	title?: string
}

/* * */

export function PatternSelectionTrigger({ description, onSelect, selectedPatternId, title }: PatternSelectionTriggerProps) {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const linesContext = useLinesContext();

	const pathname = usePathname();
	const localSearchParams = useLocalSearchParams<{ line_id: string }>();

	const { t } = useTranslation('translation', { keyPrefix: 'lines.PatternSelectionTrigger' });

	//
	// B. Transform data

	const selectedPatternData = useMemo(() => {
		if (!localSearchParams.line_id) return;
		return linesContext.actions.getLineDataById(localSearchParams.line_id);
	}, [localSearchParams.line_id]);

	//
	// C. Handle actions

	useEffect(() => {
		// Skip if no pattern is selected or if
		// the selected pattern is the same as the param value
		if (!selectedPatternId) return;
		if (selectedPatternId === localSearchParams.line_id) return;
		// Update the URL param to match the selected pattern
		router.setParams({ line_id: selectedPatternId });
	}, [selectedPatternId]);

	useEffect(() => {
		// Skip if no stop was selected
		if (!localSearchParams.line_id) return;
		// Trigger the onSelect callback with the selected stop ID
		if (onSelect) onSelect(localSearchParams.line_id);
	}, [localSearchParams.line_id]);

	const handleShowList = () => {
		router.navigate({
			params: { return_to: pathname },
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
						icon: <IconBusStop color="#FF6900" />,
						key: 'select-line',
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
						accessibilityLabel: t('selected.accessibility_label', { tts_name: selectedPatternData.tts_name }),
						description: selectedPatternData.id,
						key: 'selected-line',
						label: selectedPatternData.long_name,
						onPress: handleShowList,
						replaceChevron: <IconArrowsRightLeft color={systemVariables.text[100]} />,
					}]}
				/>
			)}

		</>
	);

	//
}
