/* * */
import { StopsDetail } from '@/components/stops/StopsDetail';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	const { stop_id } = useLocalSearchParams<{ stop_id: string }>();

	const themeContext = useThemeContext();

	const navigation = useNavigation();
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
		<StopsDetailContextProvider stopId={stop_id}>
			<StopsDetail />
		</StopsDetailContextProvider>
	);
}
