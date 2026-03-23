/* * */

import { SearchBar } from '@/components/common/SearchBar';
import { LineBadge } from '@/components/lines/LineBadge';
import { ListSectionItem } from '@/components/list/ListSectionItem';
import { ListTitle } from '@/components/list/ListTitle';
import { MoreNewsItem } from '@/components/more/MoreNewsItem';
import { useAlertsContext } from '@/contexts/Alerts.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { useStopsContext } from '@/contexts/Stops.context';
import createDocCollection, { type SearchableDocument } from '@/hooks/useOtheSearch';
import { useSystemVariables } from '@/theme/global';
import { type News, type NewsResponse } from '@/types/news.types';
import { type Line, type Stop } from '@carrismetropolitana/api-types/network';
import { IconAlertTriangleFilled } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSWR from 'swr';

import { useStyles } from './styles';

/* * */

const MAX_VISIBLE = 3;

/* * */

function StopCircleIcon({ stopId }: { stopId: string }) {
	//
	const systemVariables = useSystemVariables();
	const alertsContext = useAlertsContext();

	const hasAlert = useMemo(() => {
		return alertsContext.actions.getSimplifiedAlertsByStopId(stopId).length > 0;
	}, [alertsContext.actions, stopId]);

	return (
		<View style={{ alignItems: 'center', height: 32, justifyContent: 'center', width: 32 }}>
			<View style={{ alignItems: 'center', backgroundColor: systemVariables.brand.cm, borderRadius: 999, height: 26, justifyContent: 'center', width: 26 }} />
			{hasAlert && (
				<View style={{ alignItems: 'center', backgroundColor: '#000', borderColor: systemVariables.brand.cm, borderRadius: 999, borderWidth: 1.5, bottom: 0, height: 16, justifyContent: 'center', position: 'absolute', right: 0, width: 16 }}>
					<IconAlertTriangleFilled color={systemVariables.brand.cm} size={10} />
				</View>
			)}
		</View>
	);
}

/* * */

export function OmniSearchScreen() {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const safeAreaInsets = useSafeAreaInsets();

	const linesContext = useLinesContext();
	const stopsContext = useStopsContext();

	const { t } = useTranslation();

	const [searchQuery, setSearchQuery] = useState('');
	const [showAllLines, setShowAllLines] = useState(false);
	const [showAllStops, setShowAllStops] = useState(false);
	const [showAllNews, setShowAllNews] = useState(false);

	//
	// B. Fetch data

	const { data: allNewsData } = useSWR<NewsResponse>('https://carrismetropolitana.pt/admin/api/news');

	//
	// C. Transform / filter data

	const filteredLines: Line[] = useMemo(() => {
		if (!searchQuery) return [];
		const searchable = linesContext.data.lines as unknown as SearchableDocument<Line>[];
		const searchHook = createDocCollection(searchable, {
			id: 4,
			long_name: 2,
			short_name: 4,
			tts_name: 3,
		});
		return searchHook.search(searchQuery) as unknown as Line[];
	}, [searchQuery, linesContext.data.lines]);

	const filteredStops: Stop[] = useMemo(() => {
		if (!searchQuery) return [];
		const searchable = stopsContext.data.stops as unknown as SearchableDocument<Stop>[];
		const searchHook = createDocCollection(searchable, {
			id: 4,
			long_name: 2,
			tts_name: 3,
		});
		return searchHook.search(searchQuery) as unknown as Stop[];
	}, [searchQuery, stopsContext.data.stops]);

	const filteredNews: News[] = useMemo(() => {
		if (!searchQuery || !allNewsData) return [];
		const publishedDocs = allNewsData.docs.filter(n => !n.is_unlisted && n._status === 'published');
		const searchable = publishedDocs as unknown as SearchableDocument<News>[];
		const searchHook = createDocCollection(searchable, {
			content: 1,
			title: 3,
		});
		return searchHook.search(searchQuery) as unknown as News[];
	}, [searchQuery, allNewsData]);

	//
	// D. Handle actions

	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		setShowAllLines(false);
		setShowAllStops(false);
		setShowAllNews(false);
	};

	const handleSelectLine = (lineId: string) => {
		router.push(`/(tabs)/(lines)/(line-modal)/${lineId}`);
	};

	const handleSelectStop = (stopId: string) => {
		router.push(`/stops/${stopId}`);
	};

	const handleSelectNews = (newsId: string) => {
		router.push(`/more/news/${newsId}`);
	};

	//
	// E. Derived display slices

	const visibleLines = showAllLines ? filteredLines : filteredLines.slice(0, MAX_VISIBLE);
	const hiddenLinesCount = filteredLines.length - MAX_VISIBLE;

	const visibleStops = showAllStops ? filteredStops : filteredStops.slice(0, MAX_VISIBLE);
	const hiddenStopsCount = filteredStops.length - MAX_VISIBLE;

	const visibleNews = showAllNews ? filteredNews : filteredNews.slice(0, MAX_VISIBLE);
	const hiddenNewsCount = filteredNews.length - MAX_VISIBLE;

	//
	// F. Render components

	const hasResults = filteredLines.length > 0 || filteredStops.length > 0 || filteredNews.length > 0;

	return (
		<View style={styles.root}>

			{/* Search bar */}
			<View style={[styles.searchBarWrapper, { paddingTop: safeAreaInsets.top + 10 }]}>
				<SearchBar
					onChange={handleSearchChange}
					value={searchQuery}
					autoFocus
				/>
			</View>

			{/* Results */}
			{searchQuery.length > 0 && (
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
				>

					{/* News section */}
					{filteredNews.length > 0 && (
						<View style={styles.section}>
							<ListTitle
								title={filteredNews.length === 1
									? t($ => $.search.OmniSearchScreen.news_results.singular)
									: t($ => $.search.OmniSearchScreen.news_results.plural, { count: filteredNews.length })}
							/>
							<ScrollView
								showsHorizontalScrollIndicator={false}
								style={styles.newsScrollView}
								horizontal
							>
								<View style={styles.newsRow}>
									{visibleNews.map(news => (
										<MoreNewsItem key={news.id} item={news} onClick={handleSelectNews} />
									))}
								</View>
							</ScrollView>
							{!showAllNews && hiddenNewsCount > 0 && (
								<>
									<View style={styles.separator} />
									<ListSectionItem
										key="news-show-more"
										onPress={() => setShowAllNews(true)}
										size="sm"
										label={hiddenNewsCount === 1
											? t($ => $.search.OmniSearchScreen.see_more.singular)
											: t($ => $.search.OmniSearchScreen.see_more.plural, { count: hiddenNewsCount })}
									/>
								</>
							)}
						</View>
					)}

					{/* Lines section */}
					{filteredLines.length > 0 && (
						<View style={styles.section}>
							<ListTitle
								title={filteredLines.length === 1
									? t($ => $.search.OmniSearchScreen.lines_results.singular)
									: t($ => $.search.OmniSearchScreen.lines_results.plural, { count: filteredLines.length })}
							/>
							<View>
								{visibleLines.map((line, index) => (
									<View key={line.id}>
										{index > 0 && <View style={styles.separator} />}
										<ListSectionItem
											key={line.id}
											icon={<LineBadge lineId={line.id} size="sm" withAlertIcon />}
											label={line.long_name}
											onPress={() => handleSelectLine(line.id)}
											size="sm"
										/>
									</View>
								))}
								{!showAllLines && hiddenLinesCount > 0 && (
									<>
										<View style={styles.separator} />
										<ListSectionItem
											key="lines-show-more"
											onPress={() => setShowAllLines(true)}
											size="sm"
											label={hiddenLinesCount === 1
												? t($ => $.search.OmniSearchScreen.see_more.singular)
												: t($ => $.search.OmniSearchScreen.see_more.plural, { count: hiddenLinesCount })}
										/>
									</>
								)}
							</View>
						</View>
					)}

					{/* Stops section */}
					{filteredStops.length > 0 && (
						<View style={styles.section}>
							<ListTitle
								title={filteredStops.length === 1
									? t($ => $.search.OmniSearchScreen.stops_results.singular)
									: t($ => $.search.OmniSearchScreen.stops_results.plural, { count: filteredStops.length })}
							/>
							<View>
								{visibleStops.map((stop, index) => (
									<View key={stop.id}>
										{index > 0 && <View style={styles.separator} />}
										<ListSectionItem
											key={stop.id}
											description={`${stopsContext.actions.getStopLocationById(stop.id)} • ${stop.id}`}
											icon={<StopCircleIcon stopId={stop.id} />}
											label={stop.long_name}
											onPress={() => handleSelectStop(stop.id)}
											size="sm"
										/>
									</View>
								))}
								{!showAllStops && hiddenStopsCount > 0 && (
									<>
										<View style={styles.separator} />
										<ListSectionItem
											key="stops-show-more"
											onPress={() => setShowAllStops(true)}
											size="sm"
											label={hiddenStopsCount === 1
												? t($ => $.search.OmniSearchScreen.see_more.singular)
												: t($ => $.search.OmniSearchScreen.see_more.plural, { count: hiddenStopsCount })}
										/>
									</>
								)}
							</View>
						</View>
					)}

					{/* No results */}
					{!hasResults && (
						<View style={styles.emptyState}>
							<ListTitle title={t($ => $.search.OmniSearchScreen.no_results)} />
						</View>
					)}

				</ScrollView>
			)}

		</View>
	);

	//
}
