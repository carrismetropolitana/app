/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const searchParams = useLocalSearchParams();
	const localeContext = useLocaleContext();
	const themeContext = useThemeContext();
	const navigation = useNavigation();

	const { t } = useTranslation('translation', { keyPrefix: 'layout' });

	//
	// B. Transform data

	const preparedUrl = useMemo(() => {
		return `${searchParams.url}?locale=${localeContext.locale}`;
	}, [searchParams.url, localeContext.locale]);

	//
	// B. Fetch data

	useEffect(() => {
		navigation.setOptions({
			headerBackTitle: `${t('BackButton')}`,
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
			headerTitle: '',
		});
	}, [navigation, themeContext.theme.mode]);

	//
	// C. Render components

	return <WebView source={{ uri: preparedUrl }} />;

	//
}
