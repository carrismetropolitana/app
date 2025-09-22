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

	const searchParams = useLocalSearchParams();
	const localeContext = useLocaleContext();
	const navigation = useNavigation();
	const systemVariables = useSystemVariables();

	//
	// B. Transform data

	useEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerStyle: {
				backgroundColor: systemVariables.background[100],
			},
			headerTitle: '',
		});
	}, [navigation]);

	const preparedUrl = useMemo(() => {
		return `${searchParams.url}?locale=${localeContext.locale}`;
	}, [searchParams.url, localeContext.locale]);

	//
	// C. Render components

	return <WebView source={{ uri: preparedUrl }} />;

	//
}
