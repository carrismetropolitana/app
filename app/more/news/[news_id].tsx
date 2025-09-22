/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { useSystemVariables } from '@/theme/global';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { WebView } from 'react-native-webview';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const localContext = useLocaleContext();
	const systemVariables = useSystemVariables();
	const searchParams = useLocalSearchParams();

	//
	// B. Transform data

	useEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerTitle: '',
		});
	}, [navigation]);

	const preparedNewsId = useMemo(() => {
		if (!searchParams.news_id) return;
		if (Array.isArray(searchParams.news_id)) return searchParams.news_id[0];
		return searchParams.news_id;
	}, [searchParams.news_id]);

	//
	// C. Render components

	return (
		<WebView
			source={{ uri: `https://carrismetropolitana.pt/news/${preparedNewsId}?locale=${localContext.locale}` }}
			style={{ backgroundColor: systemVariables.background[200] }}
			allowsFullscreenVideo
			mediaPlaybackRequiresUserAction
		/>
	);

	//
}
