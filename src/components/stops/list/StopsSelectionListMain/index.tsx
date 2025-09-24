/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { SearchBar } from '@/components/common/SearchBar';
import { ListSectionItem } from '@/components/list/ListSectionItem';
import { ListTitle } from '@/components/list/ListTitle';
import { useStopsListContext } from '@/contexts/StopsList.context';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionList, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export interface StopsSelectionListMainProps {
	addToRecentsOnPress?: boolean
	onPress: (item: Stop) => void
	replaceChevron?: React.ReactNode
}

/* * */

export function StopsSelectionListMain({ addToRecentsOnPress, onPress, replaceChevron }: StopsSelectionListMainProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const stopsListContext = useStopsListContext();

	const { t } = useTranslation('translation', { keyPrefix: 'stops.StopsSelectionListMain' });

	//
	// B. Transform data

	const listSections = useMemo(() => {
		// Setup a final variable to add the sections
		const regularSections = [
			{ data: stopsListContext.data.favorites, title: t('favorites.title') },
			{ data: stopsListContext.data.recent, title: t('recent.title') },
			{ data: stopsListContext.data.all, title: t('all.title') },
		];
		// Filter out empty sections
		const searchResultsSection = [
			{ data: stopsListContext.data.filtered, title: stopsListContext.data.filtered.length === 1 ? t('search_results.title.singular') : t('search_results.title.plural', { count: stopsListContext.data.filtered.length || 0 }) },
		];
		// If search is active, show only the search results section
		if (stopsListContext.filters.by_search) return searchResultsSection;
		// Otherwise, return only sections with data
		return regularSections.filter(section => section.data.length > 0);
	}, [
		stopsListContext.data.favorites,
		stopsListContext.data.recent,
		stopsListContext.data.filtered,
	]);

	//
	// C. Handle Actions

	const handlePress = (item: Stop) => {
		if (addToRecentsOnPress) stopsListContext.actions.addToRecent(item);
		if (onPress) onPress(item);
	};

	//
	// D. Render components

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
			ListHeaderComponent={(
				<SearchBar
					onChange={stopsListContext.actions.updateFilterBySearch}
					value={stopsListContext.filters.by_search}
				/>
			)}
			renderItem={({ index, item }) => (
				<ListSectionItem
					key={item.id}
					accessibilityHint={t('items.accessibility_hint', { id: item.id })}
					accessibilityLabel={t('items.accessibility_label', { ordinal: String(index + 1), tts_name: item.tts_name })}
					description={item.id}
					label={item.long_name}
					onPress={() => handlePress(item)}
					replaceChevron={replaceChevron}
				/>
			)}
		/>
	);

	//
}
