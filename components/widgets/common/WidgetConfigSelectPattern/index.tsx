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
	onToggleSelectAll: () => void
	selectedPatternIds?: string[]
}

/* * */

export function WidgetConfigSelectPattern({ availablePatterns, onTogglePatternId, onToggleSelectAll, selectedPatternIds }: WidgetConfigSelectPatternProps) {
	//

	//
	// A. Transform data

	const availablePatternsList: ListSectionItemProps[] = useMemo(() => {
		if (!availablePatterns) return [];
		return availablePatterns.map(item => ({
			icon: <LineBadge color={item.color} shortName={item.short_name} textColor={item.text_color} />,
			key: item.id,
			label: item.headsign,
			onPress: () => onTogglePatternId(item.id),
			replaceChevron: selectedPatternIds?.includes(item.id) ? <IconCircleCheckFilled /> : <IconCircle />,
		}));
	}, [availablePatterns, selectedPatternIds]);

	const isAllSelected = useMemo(() => {
		if (!availablePatterns || !selectedPatternIds) return false;
		return availablePatterns.length === selectedPatternIds.length;
	}, [availablePatterns, selectedPatternIds]);

	const selectAllListItem: ListSectionItemProps = {
		key: 'select_all',
		label: isAllSelected ? 'Desmarcar todos' : 'Selecionar todos',
		onPress: onToggleSelectAll,
		replaceChevron: <IconChecks />,
	};

	//
	// B. Render components

	if (!availablePatterns || availablePatterns.length === 0) {
		return null;
	}

	return (
		<ListSection
			items={[selectAllListItem, ...availablePatternsList]}
			subtitle="Escolha se quer ver estimativas de chegada para todos os destinos desta paragem ou apenas alguns na página inicial."
			title="Selecione um ou mais destinos"
		/>
	);

	//
}
