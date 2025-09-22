/* * */
import TabBarOnly from '@/components/common/layout/TabOnly';
import { StopDetail } from '@/components/stops/StopDetail';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	// A. Setup variables

	const { stop_id } = useLocalSearchParams<{ stop_id: string }>();

	const themeContext = useThemeContext();

	const navigation = useNavigation();
	const { t } = useTranslation('translation', { keyPrefix: 'layout' });

	//
	// B. Fetch Data

	useEffect(() => {
		navigation.setOptions({
			headerBackTitle: `${t('BackButton')}`,
			headerShown: true,
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
			headerTitle: '',
		});
	}, [navigation, themeContext.theme.mode]);

	//
	// C. Render components

	return (
		<StopsDetailContextProvider stopId={stop_id}>
			<StopDetail />
		</StopsDetailContextProvider>
	);

	//
}
