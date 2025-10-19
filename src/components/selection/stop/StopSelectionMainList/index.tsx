/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { ListSectionItem } from '@/components/list/ListSectionItem';
import { ListTitle } from '@/components/list/ListTitle';
import { useStopSelectionContext } from '@/components/selection/stop/context/StopSelection.context';
import { type StopSelectionProps } from '@/components/selection/stop/StopSelection';
import { type StopWithDistance } from '@/schemas/stop-with-distance';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionList, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function StopSelectionMainList({ onSelect, replaceChevron }: StopSelectionProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const stopsSelectionContext = useStopSelectionContext();

	const { t } = useTranslation('translation', { keyPrefix: 'selection.StopSelectionMainList' });

	//
	// B. Transform data

	const listSections = useMemo(() => {
		// Setup a final variable to add the sections
		const regularSections = [
			{ data: stopsSelectionContext.data.recent, key: 'recent', title: t('recent.title') },
			{ data: stopsSelectionContext.data.favorites, key: 'favorites', title: t('favorites.title') },
			{ data: stopsSelectionContext.data.nearby, key: 'nearby', title: t('nearby.title') },
			{ data: stopsSelectionContext.data.filtered, key: 'filtered', title: t('all.title') },
		];
		// Filter out empty sections
		const searchResultsSection = [
			{ data: stopsSelectionContext.data.filtered, key: 'search_results', title: stopsSelectionContext.data.filtered.length === 1 ? t('search_results.title.singular') : t('search_results.title.plural', { count: stopsSelectionContext.data.filtered.length || 0 }) },
		];
		// If search is active, show only the search results section
		if (stopsSelectionContext.filters.by_search) return searchResultsSection;
		// Otherwise, return only sections with data
		return regularSections.filter(section => section.data.length > 0);
	}, [
		stopsSelectionContext.data.favorites,
		stopsSelectionContext.data.recent,
		stopsSelectionContext.data.filtered,
		stopsSelectionContext.data.nearby,
		stopsSelectionContext.filters.by_search,
	]);

	//
	// C. Render components

	const renderSectionItem = ({ index, item, section }: { index: number, item: Stop | StopWithDistance, section: { data: (Stop | StopWithDistance)[], key: string, title: string } }) => {
		if (section.key === 'nearby') {
			const nearbyItem = item as StopWithDistance;
			return (
				<ListSectionItem
					key={item.id}
					accessibilityHint={t('items.accessibility_hint', { id: item.id })}
					accessibilityLabel={t('items.accessibility_label.nearby', { distance: nearbyItem.distance?.toFixed(0), index: index + 1, tts_name: item.tts_name })}
					description={`${nearbyItem.distance?.toFixed(0)} m • ${item.id}`}
					label={item.long_name}
					onPress={() => onSelect(item.id)}
					replaceChevron={replaceChevron}
				/>
			);
		}
		return (
			<ListSectionItem
				key={item.id}
				accessibilityHint={t('items.accessibility_hint', { id: item.id })}
				accessibilityLabel={t('items.accessibility_label.default', { index: index + 1, tts_name: item.tts_name })}
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
