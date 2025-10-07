/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { ListSectionItem } from '@/components/list/ListSectionItem';
import { ListTitle } from '@/components/list/ListTitle';
import { usePatternSelectionContext } from '@/components/selection/pattern/context/PatternSelection.context';
import { type PatternSelectionProps } from '@/components/selection/pattern/PatternSelection';
import { type Line } from '@carrismetropolitana/api-types/network';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionList, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function PatternSelectionMainList({ onSelect, replaceChevron }: PatternSelectionProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const patternSelectionContext = usePatternSelectionContext();

	const { t } = useTranslation('translation', { keyPrefix: 'lines.PatternSelectionMainList' });

	//
	// B. Transform data

	const listSections = useMemo(() => {
		// Setup a final variable to add the sections
		const regularSections = [
			{ data: patternSelectionContext.data.recent, key: 'recent', title: t('recent.title') },
			{ data: patternSelectionContext.data.favorites, key: 'favorites', title: t('favorites.title') },
			{ data: patternSelectionContext.data.nearby, key: 'nearby', title: t('nearby.title') },
			{ data: patternSelectionContext.data.filtered, key: 'filtered', title: t('all.title') },
		];
		// Filter out empty sections
		const searchResultsSection = [
			{ data: patternSelectionContext.data.filtered, key: 'search_results', title: patternSelectionContext.data.filtered.length === 1 ? t('search_results.title.singular') : t('search_results.title.plural', { count: patternSelectionContext.data.filtered.length || 0 }) },
		];
		// If search is active, show only the search results section
		if (patternSelectionContext.filters.by_search) return searchResultsSection;
		// Otherwise, return only sections with data
		return regularSections.filter(section => section.data.length > 0);
	}, [
		patternSelectionContext.data.favorites,
		patternSelectionContext.data.recent,
		patternSelectionContext.data.filtered,
		patternSelectionContext.data.nearby,
		patternSelectionContext.filters.by_search,
	]);

	//
	// C. Render components

	const renderSectionItem = ({ index, item }: { index: number, item: Line }) => {
		return (
			<ListSectionItem
				key={item.id}
				accessibilityHint={t('items.accessibility_hint', { id: item.id })}
				accessibilityLabel={t('items.accessibility_label', { index: index + 1, tts_name: item.tts_name })}
				description={item.id}
				label={item.long_name}
				onPress={() => onSelect(item.id)}
				replaceChevron={replaceChevron}
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
