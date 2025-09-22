/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { MoreNewsItem } from '@/components/more/MoreNewsItem';
import { type News } from '@/types/news.types';
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

	const { t } = useTranslation('translation', { keyPrefix: 'more.MoreNews' });

	//
	// B. Fetch data

	const { data: allNewsData, isLoading: allNewsLoading } = useSWR<News[]>('https://carrismetropolitana.pt/api/news');

	//
	// C. Transform data

	const preparedNewsData = useMemo(() => {
		if (!allNewsData) return [];
		return allNewsData
			.sort((a, b) => b.publish_date.localeCompare(a.publish_date))
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
		return <NoDataLabel text={t('loading')} />;
	}

	return (
		<ScrollView showsHorizontalScrollIndicator={false} horizontal>
			<View style={styles.container}>
				{preparedNewsData.map(news => (
					<MoreNewsItem key={news._id} item={news} onClick={handlePress} />
				))}
			</View>
		</ScrollView>
	);

	//
}
