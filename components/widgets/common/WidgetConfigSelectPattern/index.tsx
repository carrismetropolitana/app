/* * */

import { LineBadge } from '@/components/lines/LineBadge';
import { ListSection } from '@/components/list/ListSection';
import { ListSectionItemProps } from '@/components/list/ListSectionItem';
import { type Pattern } from '@carrismetropolitana/api-types/network';
import { IconChecks, IconCircle, IconCircleCheckFilled } from '@tabler/icons-react-native';
import { useMemo } from 'react';

/* * */

interface WidgetConfigSelectPatternProps {
	availablePatterns?: Pattern[]
	onTogglePatternId: (patternId: string) => void
	onToggleSelectAll?: () => void
	selectedPatternIds?: string[]
	subtitle?: string
	title?: string
}

/* * */

export function WidgetConfigSelectPattern({ availablePatterns, onTogglePatternId, onToggleSelectAll, selectedPatternIds, subtitle, title }: WidgetConfigSelectPatternProps) {
	//

	//
	// A. Transform data

	const availablePatternsList: ListSectionItemProps[] = useMemo(() => {
		// Skip if no patterns are available
		if (!availablePatterns?.length) return [];
		// Prepare patterns list
		const preparedPatterns = availablePatterns.map(item => ({
			icon: <LineBadge color={item.color} shortName={item.short_name} textColor={item.text_color} />,
			key: item.id,
			label: item.headsign,
			onPress: () => onTogglePatternId(item.id),
			replaceChevron: selectedPatternIds?.includes(item.id) ? <IconCircleCheckFilled /> : <IconCircle />,
		}));
		// Check if "select all" option should be added
		if (!onToggleSelectAll || preparedPatterns?.length <= 1) return preparedPatterns;
		// Add "select all" option at the top of the list
		const selectAllListItem: ListSectionItemProps = {
			key: 'select_all',
			label: isAllSelected ? 'Desmarcar todos' : 'Selecionar todos',
			onPress: onToggleSelectAll,
			replaceChevron: <IconChecks />,
		};
		return [selectAllListItem, ...preparedPatterns];
	}, [availablePatterns, selectedPatternIds]);

	const isAllSelected = useMemo(() => {
		if (!availablePatterns || !selectedPatternIds) return false;
		return availablePatterns.length === selectedPatternIds.length;
	}, [availablePatterns, selectedPatternIds]);

	//
	// B. Render components

	if (!availablePatterns || availablePatterns.length === 0) {
		return null;
	}

	return (
		<ListSection
			items={availablePatternsList}
			subtitle={subtitle}
			title={title}
		/>
	);

	//
}
