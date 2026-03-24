/* * */

import { NoDataLabel } from '@/components/common/NoDataLabel';
import { MoreNewsItem } from '@/components/more/MoreNewsItem';
import { NewsResponse } from '@/types/news.types';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import useSWR from 'swr';

import styles from './styles';

/* * */

export function MoreNews() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation();

	//
	// B. Fetch data

	const { data: allNewsData, isLoading: allNewsLoading } = useSWR<NewsResponse>('https://carrismetropolitana.pt/admin/api/news');

	//
	// C. Transform data

	const preparedNewsData = useMemo(() => {
		if (!allNewsData) return [];
		return allNewsData.docs
			.filter(news => !news.is_unlisted && news._status === 'published')
			.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
			.slice(0, 5);
	}, [allNewsData]);

	//
	// D. Handle action

	const handlePress = (newsId: string) => {
		router.push(`/more/news/${newsId}`);
	};

	//
	// E. Render components

	if (allNewsLoading) {
		return <NoDataLabel text={t($ => $.more.MoreNews.loading)} />;
	}

	if (!preparedNewsData.length) {
		return null;
	}

	return (
		<ScrollView showsHorizontalScrollIndicator={false} horizontal>
			<View style={styles.container}>
				{preparedNewsData.map(news => (
					<MoreNewsItem key={news.id} item={news} onClick={handlePress} />
				))}
			</View>
		</ScrollView>
	);

	//
}
