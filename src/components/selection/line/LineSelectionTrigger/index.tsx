/* * */

import { LineBadge } from '@/components/lines/LineBadge';
import { ListSection } from '@/components/list/ListSection';
import { useLinesContext } from '@/contexts/Lines.context';
import { useSystemVariables } from '@/theme/global';
import { IconArrowLoopRight, IconArrowsRightLeft } from '@tabler/icons-react-native';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

interface LineSelectionTriggerProps {
	description?: string
	onSelect?: (lineId: string) => void
	selectedLineId?: string
	title?: string
}

/* * */

export function LineSelectionTrigger({ description, onSelect, selectedLineId, title }: LineSelectionTriggerProps) {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const linesContext = useLinesContext();

	const pathname = usePathname();
	const localSearchParams = useLocalSearchParams<{ line_id: string }>();

	const { t } = useTranslation('translation', { keyPrefix: 'selection.LineSelectionTrigger' });

	//
	// B. Transform data

	const selectedLineData = useMemo(() => {
		if (!localSearchParams.line_id) return;
		return linesContext.actions.getLineDataById(localSearchParams.line_id);
	}, [localSearchParams.line_id]);

	//
	// C. Handle actions

	useEffect(() => {
		// Skip if no line is selected or if
		// the selected line is the same as the param value
		if (!selectedLineId) return;
		if (selectedLineId === localSearchParams.line_id) return;
		// Update the URL param to match the selected line
		router.setParams({ line_id: selectedLineId });
	}, [selectedLineId]);

	useEffect(() => {
		// Skip if no stop was selected
		if (!localSearchParams.line_id) return;
		// Trigger the onSelect callback with the selected stop ID
		if (onSelect) onSelect(localSearchParams.line_id);
	}, [localSearchParams.line_id]);

	const handleShowList = () => {
		router.navigate({
			params: { return_to: pathname },
			pathname: '/selection/line',
		});
	};

	//
	// D. Render components

	return (
		<>

			{!selectedLineData && (
				<ListSection
					description={description}
					title={title}
					items={[{
						icon: <IconArrowLoopRight color="#C61D23" size={30} />,
						key: 'select-line',
						label: t('label'),
						onPress: handleShowList,
					}]}
				/>
			)}

			{selectedLineData && (
				<ListSection
					description={description}
					title={title}
					items={[{
						accessibilityHint: t('selected.accessibility_hint'),
						accessibilityLabel: t('selected.accessibility_label', { tts_name: selectedLineData.tts_name }),
						icon: <LineBadge lineId={selectedLineData.id} withAlertIcon />,
						key: 'selected-line',
						label: selectedLineData.long_name,
						onPress: handleShowList,
						replaceChevron: <IconArrowsRightLeft color={systemVariables.text[100]} />,
					}]}
				/>
			)}

		</>
	);

	//
}
