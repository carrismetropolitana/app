/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { LinesSelectionListSearch } from '@/components/lines/list/LinesSelectionListSearch';
import { ListSectionItem } from '@/components/list/ListSectionItem';
import { ListTitle } from '@/components/list/ListTitle';
import { useLinesListContext } from '@/contexts/LinesList.context';
import { type Line } from '@carrismetropolitana/api-types/network';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionList, View } from 'react-native';

import { LineBadge } from '../../LineBadge';
import { useStyles } from './styles';

/* * */

export interface LinesSelectionListMainProps {
	addToRecentsOnPress?: boolean
	onPress: (item: Line) => void
}

/* * */

export function LinesSelectionListMain({ addToRecentsOnPress, onPress }: LinesSelectionListMainProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const linesListContext = useLinesListContext();

	const { t } = useTranslation('translation', { keyPrefix: 'lines.LinesSelectionListMain' });

	//
	// B. Transform data

	const listSections = useMemo(() => {
		// Setup a final variable to add the sections
		const regularSections = [
			{ data: linesListContext.data.favorites, title: t('favorites.title') },
			{ data: linesListContext.data.around, title: t('around.title') },
			{ data: linesListContext.data.recent, title: t('recent.title') },
			{ data: linesListContext.data.all.slice(0, 5), title: t('all.title') },
		];
		// Filter out empty sections
		const searchResultsSection = [
			{ data: linesListContext.data.filtered.slice(0, 5), title: linesListContext.data.filtered.length === 1 ? t('search_results.title.singular') : t('search_results.title.plural', { count: linesListContext.data.filtered.length || 0 }) },
		];
		// If search is active, show only the search results section
		if (linesListContext.filters.by_search) return searchResultsSection;
		// Otherwise, return only sections with data
		return regularSections.filter(section => section.data.length > 0);
	}, [
		linesListContext.data.favorites,
		linesListContext.data.around,
		linesListContext.data.recent,
		linesListContext.data.filtered,
	]);

	//
	// C. Handle Actions

	const handlePress = (item: Line) => {
		if (addToRecentsOnPress) linesListContext.actions.addToRecent(item);
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
				<LinesSelectionListSearch
					onChange={linesListContext.actions.updateFilterBySearch}
					value={linesListContext.filters.by_search}
				/>
			)}
			renderItem={({ item }) => (
				<ListSectionItem
					key={item.id}
					icon={<LineBadge color={item.color} shortName={item.short_name} textColor={item.text_color} />}
					label={item.long_name}
					onPress={() => handlePress(item)}
				/>
			)}
		/>
	);

	//
}
