/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { ListSectionItem } from '@/components/list/ListSectionItem';
import { ListTitle } from '@/components/list/ListTitle';
import { type StopsSelectionProps } from '@/components/stops/selection/StopsSelection';
import { useStopsSelectionContext } from '@/contexts/StopsSelection.context';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionList, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function StopsSelectionMainList({ onPress, replaceChevron }: StopsSelectionProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const stopsSelectionContext = useStopsSelectionContext();

	const { t } = useTranslation('translation', { keyPrefix: 'stops.StopsSelectionMainList' });

	//
	// B. Transform data

	const listSections = useMemo(() => {
		// Setup a final variable to add the sections
		const regularSections = [
			{ data: stopsSelectionContext.data.favorites, title: t('favorites.title') },
			{ data: stopsSelectionContext.data.recent, title: t('recent.title') },
			{ data: stopsSelectionContext.data.filtered, title: t('all.title') },
		];
		// Filter out empty sections
		const searchResultsSection = [
			{ data: stopsSelectionContext.data.filtered, title: stopsSelectionContext.data.filtered.length === 1 ? t('search_results.title.singular') : t('search_results.title.plural', { count: stopsSelectionContext.data.filtered.length || 0 }) },
		];
		// If search is active, show only the search results section
		if (stopsSelectionContext.filters.by_search) return searchResultsSection;
		// Otherwise, return only sections with data
		return regularSections.filter(section => section.data.length > 0);
	}, [
		stopsSelectionContext.data.favorites,
		stopsSelectionContext.data.recent,
		stopsSelectionContext.data.filtered,
		stopsSelectionContext.filters.by_search,
	]);

	//
	// C. Render components

	return (
		<SectionList
			contentContainerStyle={styles.contentContainer}
			initialNumToRender={30}
			ItemSeparatorComponent={() => <View style={styles.border} />}
			ListEmptyComponent={<NoDataLabel />}
			maxToRenderPerBatch={30}
			renderSectionHeader={info => <ListTitle title={info.section.title} />}
			sections={listSections}
			SectionSeparatorComponent={() => <View style={styles.border} />}
			stickySectionHeadersEnabled={false}
			windowSize={30}
			renderItem={({ index, item }) => (
				<ListSectionItem
					key={item.id}
					accessibilityHint={t('items.accessibility_hint', { id: item.id })}
					accessibilityLabel={t('items.accessibility_label', { index: index + 1, tts_name: item.tts_name })}
					description={item.id}
					label={item.long_name}
					onPress={() => onPress(item)}
					replaceChevron={replaceChevron}
				/>
			)}
		/>
	);

	//
}
