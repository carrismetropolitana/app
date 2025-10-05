/* * */

import { LineBadge } from '@/components/lines/LineBadge';
import { ListSection } from '@/components/list/ListSection';
import { ListSectionItemProps } from '@/components/list/ListSectionItem';
import { useSystemVariables } from '@/theme/global';
import { type Pattern } from '@carrismetropolitana/api-types/network';
import { IconChecks, IconCircle, IconCircleCheckFilled } from '@tabler/icons-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

interface WidgetConfigSelectPatternProps {
	availablePatterns?: Pattern[]
	description?: string
	onTogglePatternId: (patternId: string) => void
	onToggleSelectAll?: () => void
	selectedPatternIds?: string[]
	title?: string
}

/* * */

export function WidgetConfigSelectPattern({ availablePatterns, description, onTogglePatternId, onToggleSelectAll, selectedPatternIds, title }: WidgetConfigSelectPatternProps) {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetConfigSelectPattern' });

	//
	// B. Transform data

	const availablePatternsList: ListSectionItemProps[] = useMemo(() => {
		// Skip if no patterns are available
		if (!availablePatterns?.length) return [];
		// Prepare patterns list
		const preparedPatterns = availablePatterns.map(item => ({
			icon: <LineBadge lineId={item.line_id} withAlertIcon />,
			key: item.id,
			label: item.headsign,
			onPress: () => onTogglePatternId(item.id),
			replaceChevron: selectedPatternIds?.includes(item.id) ? <IconCircleCheckFilled color={systemVariables.status.ok} /> : <IconCircle color={systemVariables.text[200]} />,
		}));
		// Check if "select all" option should be added
		if (!onToggleSelectAll || preparedPatterns?.length <= 1) return preparedPatterns;
		// Add "select all" option at the top of the list
		const selectAllListItem: ListSectionItemProps = {
			key: 'select_all',
			label: isAllSelected ? t('deselect_all') : t('select_all'),
			onPress: onToggleSelectAll,
			replaceChevron: <IconChecks color={systemVariables.text[100]} />,
		};
		return [selectAllListItem, ...preparedPatterns];
	}, [availablePatterns, selectedPatternIds]);

	const isAllSelected = useMemo(() => {
		if (!availablePatterns || !selectedPatternIds) return false;
		return availablePatterns.length === selectedPatternIds.length;
	}, [availablePatterns, selectedPatternIds]);

	//
	// C. Render components

	if (!availablePatterns || availablePatterns.length === 0) {
		return null;
	}

	return (
		<ListSection
			description={description}
			items={availablePatternsList}
			title={title}
		/>
	);

	//
}
