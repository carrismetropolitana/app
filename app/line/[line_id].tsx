/* * */

import { LinesDetail } from '@/components/lines/LinesDetail';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const { line_id } = useLocalSearchParams<{ line_id: string }>();

	const themeContext = useThemeContext();

	const navigation = useNavigation();
	const { t } = useTranslation('translation', { keyPrefix: 'layout' });

	//
	// B. Fetch Data

	useEffect(() => {
		navigation.setOptions({
			headerBackTitle: `Linha ${line_id}`,
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
			headerTitle: '',
		});
	}, [navigation, themeContext.theme.mode]);

	//
	// C. Render components

	return (
		<LinesDetailContextProvider lineIdParams={line_id}>
			<LinesDetail />
		</LinesDetailContextProvider>
	);

	//
}
