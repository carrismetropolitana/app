/* * */

import { NoDataLabel } from '@/components/common/NoDataLabel';
import { LineBadge } from '@/components/lines/LineBadge';
import { ListSectionItem } from '@/components/list/ListSectionItem';
import { ListTitle } from '@/components/list/ListTitle';
import { useLineSelectionContext } from '@/components/selection/line/context/LineSelection.context';
import { type LineSelectionProps } from '@/components/selection/line/LineSelection';
import { type Line } from '@carrismetropolitana/api-types/network';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionList, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function LineSelectionMainList({ onSelect, replaceChevron }: LineSelectionProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const lineSelectionContext = useLineSelectionContext();

	const { t } = useTranslation();

	//
	// B. Transform data

	const listSections = useMemo(() => {
		// Setup a final variable to add the sections
		const regularSections = [
			{ data: lineSelectionContext.data.recent, key: 'recent', title: t($ => $.selection.LineSelectionMainList.recent.title) },
			{ data: lineSelectionContext.data.favorites, key: 'favorites', title: t($ => $.selection.LineSelectionMainList.favorites.title) },
			{ data: lineSelectionContext.data.nearby, key: 'nearby', title: t($ => $.selection.LineSelectionMainList.nearby.title) },
			{ data: lineSelectionContext.data.filtered, key: 'filtered', title: t($ => $.selection.LineSelectionMainList.all.title) },
		];
		// Filter out empty sections
		const searchResultsSection = [
			{ data: lineSelectionContext.data.filtered, key: 'search_results', title: lineSelectionContext.data.filtered.length === 1 ? t($ => $.selection.LineSelectionMainList.search_results.title.singular) : t($ => $.selection.LineSelectionMainList.search_results.title.plural, {
				count: lineSelectionContext.data.filtered.length || 0,
			}) },
		];
		// If search is active, show only the search results section
		if (lineSelectionContext.filters.by_search) return searchResultsSection;
		// Otherwise, return only sections with data
		return regularSections.filter(section => section.data.length > 0);
	}, [lineSelectionContext.data.recent, lineSelectionContext.data.favorites, lineSelectionContext.data.nearby, lineSelectionContext.data.filtered, lineSelectionContext.filters.by_search, t]);

	//
	// C. Render components

	const renderSectionItem = ({ index, item }: { index: number, item: Line }) => {
		return (
			<ListSectionItem
				key={item.id}
				icon={<LineBadge lineId={item.id} withAlertIcon />}
				label={item.long_name}
				onPress={() => onSelect(item.id)}
				replaceChevron={replaceChevron}
				size="sm"
				accessibilityHint={t($ => $.selection.LineSelectionMainList.items.accessibility_hint, {
					id: item.id,
				})}
				accessibilityLabel={t($ => $.selection.LineSelectionMainList.items.accessibility_label, {
					index: index + 1,
					tts_name: item.tts_name,
				})}
			/>
		);
	};

	return (
		<SectionList
			contentContainerStyle={styles.contentContainer}
			initialNumToRender={30}
			ItemSeparatorComponent={() => <View style={styles.border} />}
			ListEmptyComponent={<NoDataLabel />}
			maxToRenderPerBatch={30}
			renderItem={renderSectionItem}
			renderSectionHeader={info => <ListTitle title={info.section.title} />}
			sections={listSections}
			SectionSeparatorComponent={() => <View style={styles.border} />}
			stickySectionHeadersEnabled={false}
			windowSize={30}
		/>
	);

	//
}
