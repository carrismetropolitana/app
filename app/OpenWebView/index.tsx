import { useThemeContext } from '@/contexts/Theme.context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';

export default function OpenWebView() {
	const { locale, url } = useLocalSearchParams();
	const formedUrl = `${url}?locale=${locale}`;

	const navigation = useNavigation();

	const themeContext = useThemeContext();
	const { t } = useTranslation('translation', { keyPrefix: 'layout' });

	useEffect(() => {
		navigation.setOptions({
			headerBackTitle: `${t('BackButton')}`,
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
			headerTitle: '',
		});
	}, [navigation, themeContext.theme.mode]);

	return (
		<WebView
			source={{ uri: formedUrl as string }}
		/>
	);
}
