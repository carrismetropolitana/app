/* * */

import { LinesDetail } from '@/components/lines/LinesDetail';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	const { line_id } = useLocalSearchParams<{ line_id: string }>();

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
		<LinesDetailContextProvider lineId={line_id}>
			<LinesDetail />
		</LinesDetailContextProvider>
	);
}
